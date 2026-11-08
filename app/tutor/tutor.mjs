import { Microphone } from './microphone.mjs';
import { Continuity, remaining } from './continuity.mjs';
import { ingest, localStream, readingSegment, Protocol, Playback, LIMITS } from './core.mjs';
import { MOVES, LESSON, getMove, authoredChoice, remoteChoice } from './teaching.mjs';

const $ = id => document.getElementById(id);
let chunks = [], controller, releaseWait, frame, uploadGeneration = 0;
let started = 0, firstStroke, firstSpeech;
const board = $('board');
let lastTopic = '';
let teaching = false, currentMove = 'start';
const teachingChunks = MOVES.flatMap(move => ingest(`8.3 · ${move.title}`, move.text).map((chunk, i) =>
  Object.freeze({ ...chunk, id: `teach-${move.id}-${i}` })));
const noteLesson = window.HahaPhysicsNotesContent.lessons.find(l => l.id === LESSON);
const visualStates = {};
function showTeaching(id) {
  const move = getMove(id);
  if (!move) return;
  currentMove = move.id;
  $('teaching-panel').hidden = false;
  $('teaching-title').textContent = move.title;
  $('teaching-text').textContent = move.text;
  $('teaching-prompt').textContent = move.prompt;
  $('teaching-references').textContent = move.sections.length ? 'Grounding · original 8.3 notes: ' + move.sections.map(i => noteLesson.sections[i].title.en).join('; ') + '.' : 'Scope boundary · no scientific answer supplied.';
  $('teaching-visual').replaceChildren();
  if (move.visual) {
    const spec = noteLesson.visuals.find(v => v.kind === move.visual);
    $('teaching-visual').append(window.HahaPhysicsNotes.renderVisual(spec, 'en', { guided: true, state: visualStates[move.visual] ||= {} }));
  }
  document.querySelectorAll('#teaching-topics button').forEach(b => b.setAttribute('aria-current', String(b.dataset.move === id)));
  $('teaching-panel').scrollIntoView({ block: 'start' });
}
function leaveTeaching() {
  teaching = false; $('teaching-panel').hidden = true; $('teaching-topics').hidden = true;
  $('teaching-visual').replaceChildren();
  for (const key of Object.keys(visualStates)) delete visualStates[key];
}
for (const move of MOVES.filter(m => m.id !== 'unsupported')) {
  const button = document.createElement('button'); button.type = 'button'; button.textContent = move.title; button.dataset.move = move.id;
  button.onclick = () => ask(move.title, 'topic', move.id);
  $('teaching-topics').append(button);
}
$('friction').onclick = () => {
  ++uploadGeneration;
  load('Original 8.3 teaching material', MOVES.map(m => m.text).join('\n'));
  teaching = true; chunks = teachingChunks; currentMove = 'start';
  $('teaching-topics').hidden = false; $('question').value = '';
  ask('start', 'topic', 'start');
};
fetch('/api/tutor/status', { credentials: 'same-origin' }).then(async response => {
  if (!response.ok) throw Error();
  const data = await response.json();
  if (data.available !== true) throw Error();
  $('ai-selection').disabled = false;
  $('ai-status').textContent = 'Optional AI selection available. It stays off until you enable it.';
}).catch(() => { $('ai-status').textContent = 'AI is not connected here. Authored teaching and interactive models are available.'; });
const continuity = new Continuity();
function bookmarks() { $('resume-lesson').disabled = !continuity.bookmarks.length; }
function turn(role, text) {
  const item = document.createElement('li'); item.textContent = `${role}: ${text}`;
  $('conversation').append(item);
  while ($('conversation').children.length > 40) $('conversation').firstChild.remove();
  if (!teaching) item.scrollIntoView({ block: 'nearest' });
}
const microphone = new Microphone({
  status(text, active) { $('mic-status').textContent = text; $('mic').textContent = active ? 'Mute microphone' : 'Enable microphone'; $('mic').setAttribute('aria-pressed', String(active)); },
  interrupt() { if (controller) stop('Listening to your interruption…'); },
  submit(text) { if (!chunks.length) { $('status').textContent = 'Load notes before asking a question.'; return; } ask(text.slice(0, 500), 'voice'); }
});
$('mic').addEventListener('click', () => microphone.toggle());
$('end-session').addEventListener('click', () => { microphone.end(); $('clear').click(); $('conversation').replaceChildren(); lastTopic = ''; });
$('voice').addEventListener('change', () => { if (controller) stop('Audio preference changed. Resume the interrupted lesson when ready.'); });

function draw(action) {
  if (firstStroke === undefined) { firstStroke = performance.now() - started; metrics(); }
  const element = document.createElementNS('http://www.w3.org/2000/svg', action.kind === 'text' ? 'text' : 'polyline');
  if (action.kind === 'text') {
    element.setAttribute('x', action.x); element.setAttribute('y', action.y); element.textContent = action.text;
  } else element.setAttribute('points', action.points.map(p => p.join(',')).join(' '));
  board.append(element);
}
const playback = new Playback(action => {
  continuity.active?.drawn.push(action);
  draw(action);
});
function metrics() {
  $('timing').textContent = `First board mark: ${firstStroke === undefined ? 'pending' : Math.round(firstStroke) + ' ms'}. First speech: ${firstSpeech === undefined ? 'not measured' : Math.round(firstSpeech) + ' ms'}. Local measurements only.`;
}
function controls(running) {
  $('start').disabled = !chunks.length;
  $('pause').disabled = !running; $('stop').disabled = !running;
  $('upload').disabled = running; $('sample').disabled = running;
}
function stop(message = 'Stopped. Resume the interrupted lesson, or send a new question.') {
  if (controller) continuity.checkpoint();
  controller?.abort(); controller = undefined;
  bookmarks();
  playback.cancel(); cancelAnimationFrame(frame);
  window.speechSynthesis?.cancel(); releaseWait?.(); releaseWait = undefined;
  $('pause').textContent = 'Pause'; controls(false); $('status').textContent = message;
}
function load(name, text) {
  leaveTeaching();
  stop(); continuity.clear(); bookmarks(); lastTopic = ''; $('conversation').replaceChildren(); chunks = []; controls(false); board.replaceChildren(); $('sources').replaceChildren(); $('timing').textContent = '';
  try {
    chunks = ingest(name, text); $('material').textContent = `${name}: ${chunks.length} note sections loaded in memory.`;
    $('status').textContent = 'Choose a topic found in these notes.';
  } catch (error) { $('material').textContent = error.message; }
  controls(false);
}
$('upload').addEventListener('change', async () => {
  const generation = ++uploadGeneration;
  const file = $('upload').files[0];
  if (!file) return;
  stop(); chunks = []; controls(false);
  try {
    if (!/\.txt$/i.test(file.name) || file.size > LIMITS.bytes) throw Error('Choose a UTF-8 .txt file up to 100 KB. PDF uploads are not supported yet.');
    const text = new TextDecoder('utf-8', { fatal: true }).decode(await file.arrayBuffer());
    if (generation === uploadGeneration) load(file.name, text);
  } catch (error) {
    if (generation === uploadGeneration) { load('', ''); $('material').textContent = error.message; }
  }
  $('upload').value = '';
});
$('sample').addEventListener('click', () => {
  ++uploadGeneration;
  load('Original conceptual sample', 'Balanced forces leave an object’s velocity unchanged. A moving object can keep moving when the forces balance.\nUnbalanced forces change an object’s velocity. The change follows the direction of the net force.\nA force diagram represents the forces acting on a chosen object. Each arrow names a force and shows its direction.');
  $('question').value = 'balanced forces';
});
$('clear').addEventListener('click', () => {
  leaveTeaching(); $('ai-selection').checked = false;
  ++uploadGeneration; microphone.end(); lastTopic = ''; $('conversation').replaceChildren(); stop('Notes cleared.'); continuity.clear(); bookmarks(); chunks = []; board.replaceChildren(); $('sources').replaceChildren();
  $('question').value = ''; $('upload').value = ''; $('timing').textContent = '';
  $('material').textContent = 'No material loaded. Files stay in this page’s memory; clearing or reloading removes them.'; controls(false);
});
$('stop').addEventListener('click', () => stop());
$('pause').addEventListener('click', () => {
  if (playback.paused) {
    playback.resume(); window.speechSynthesis?.resume(); $('pause').textContent = 'Pause';
  } else {
    playback.pause(); window.speechSynthesis?.pause(); $('pause').textContent = 'Resume';
  }
});

function play(segment, signal, voice, offset = -1) {
  const remainder = remaining(segment, offset);
  const generation = playback.begin(segment);
  // Existing marks are restored separately; skip them without drawing twice.
  while (playback.cursor < segment.actions.length && segment.actions[playback.cursor].at <= offset) playback.cursor++;
  playback.offset = offset;
  const advance = position => {
    if (signal.aborted || generation !== playback.generation || playback.paused) return;
    if (continuity.active) continuity.active.offset = Math.max(continuity.active.offset, position);
    playback.advance(generation, position);
  };
  return new Promise((resolve, reject) => {
    let settled = false, elapsed = 0, last = performance.now(), speechStarted = false;
    const finish = error => {
      if (settled) return;
      settled = true; cancelAnimationFrame(frame); signal.removeEventListener('abort', abort);
      releaseWait = undefined;
      if (error) reject(error); else resolve();
    };
    const abort = () => finish();
    releaseWait = abort; signal.addEventListener('abort', abort, { once: true });
    if (signal.aborted) { finish(); return; }
    let utterance;
    if (voice) {
      utterance = new SpeechSynthesisUtterance(remainder.text); utterance.lang = 'en-US'; utterance.rate = 0.95;
      utterance.onstart = () => {
        if (signal.aborted || generation !== playback.generation) return;
        speechStarted = true;
        if (firstSpeech === undefined) { firstSpeech = performance.now() - started; metrics(); }
        $('status').textContent = 'Reading aloud. Word timing when supported; phrase completion otherwise.';
        advance(remainder.start);
      };
      utterance.onboundary = event => { if (!signal.aborted) advance(remainder.start + event.charIndex); };
      utterance.onend = () => {
        if (signal.aborted || generation !== playback.generation) return;
        // Some browser voices emit no word boundaries; never invent precise audio timing.
        if (playback.paused) { endedWhilePaused = true; return; }
        advance(segment.text.length); finish();
      };
      utterance.onerror = () => { if (signal.aborted || generation !== playback.generation) return; finish(Error('Browser speech failed. Turn off Read aloud and start again for silent playback.')); };
      window.speechSynthesis.speak(utterance);
    }
    let endedWhilePaused = false;
    const duration = Math.max(1800, remainder.text.length * 42);
    function tick(now) {
      if (settled || signal.aborted) return;
      const delta = Math.min(100, now - last); last = now;
      if (!playback.paused) {
        elapsed += delta;
        if (!voice) {
          advance(remainder.start + Math.floor(remainder.text.length * Math.min(1, elapsed / duration)));
          if (elapsed >= duration) { finish(); return; }
        } else if (endedWhilePaused) {
          advance(segment.text.length); finish(); return;
        } else if (elapsed > (speechStarted ? 45000 : 10000)) {
          finish(Error('Browser speech timed out. Turn off Read aloud and start again for silent playback.')); return;
        }
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
  });
}

$('lesson').addEventListener('submit', event => {
  event.preventDefault();
  ask($('question').value.trim(), 'text');
});
$('resume-lesson').addEventListener('click', () => ask('continue', 'text'));

async function ask(question, origin, explicitMove) {
  if (!question || !chunks.length) return;
  const resume = /^(continue|go on|resume)[.!?]*$/i.test(question);
  const topic = /^(continue|again|repeat|go on|resume)[.!?]*$/i.test(question) ? lastTopic : question;
  turn(`Student (${origin})`, question);
  stop();
  const run = new AbortController(); controller = run;
  if (resume && continuity.bookmarks.length) continuity.resume();
  else {
    const session = crypto.randomUUID(), protocol = new Protocol(session, chunks), segments = [];
    const signal = run.signal;
    try {
      let stream;
      let move;
      if (teaching) {
        $('status').textContent = $('ai-selection').checked && !explicitMove ? 'Selecting an authored explanation…' : 'Preparing authored teaching…';
        controls(true);
        move = explicitMove ? getMove(explicitMove) : $('ai-selection').checked ? await remoteChoice(question, currentMove, signal) : authoredChoice(question, currentMove);
        if (signal.aborted) return;
        const matches = chunks.filter(c => c.id.startsWith(`teach-${move.id}-`));
        stream = matches.map((c, row) => ({ v: 1, session, seq: row, type: 'segment', ...readingSegment(c, row) }));
        stream.push({ v: 1, session, seq: matches.length, type: 'done', reason: 'complete' });
      } else stream = localStream(chunks, topic, session, signal);
      for await (const raw of stream) {
        if (run.signal.aborted) return;
        const event = protocol.accept(raw);
        if (event.type === 'segment') segments.push(event);
      }
      if (run.signal.aborted) return;
      protocol.finish();
      if (move) currentMove = move.id;
    } catch (error) { if (!run.signal.aborted) stop(error.message); return; }
    continuity.begin(topic, segments);
    if (teaching) continuity.active.moveId = currentMove;
  }
  const lesson = continuity.active;
  if (teaching && lesson.moveId) showTeaching(lesson.moveId);
  lastTopic = lesson.topic;
  board.replaceChildren(); $('sources').replaceChildren();
  lesson.drawn.forEach(draw);
  lesson.references.forEach(showSource);
  bookmarks();
  started = performance.now(); firstStroke = undefined; firstSpeech = undefined; metrics(); controls(true);
  const voice = $('voice').checked;
  try {
    if (voice && (!window.speechSynthesis || !window.SpeechSynthesisUtterance)) throw Error('Speech is unavailable in this browser. Turn off Read aloud to continue.');
    $('status').textContent = voice ? 'Waiting for browser speech…' : 'Silent reading timeline. No audio synchronization is claimed.';
    while (lesson.index < lesson.segments.length) {
      const message = lesson.segments[lesson.index];
      if (!lesson.references.includes(message.source)) {
        lesson.references.push(message.source); showSource(message.source);
        turn(teaching ? 'Tutor · authored teaching' : 'Tutor · source reading', message.text);
      }
      await play(message, run.signal, voice, lesson.offset);
      if (run.signal.aborted) return;
      lesson.index++; lesson.offset = -1;
    }
    $('status').textContent = teaching ? 'Authored explanation finished. Explore the model, choose a topic, or ask a clarification. AI selection does not generate teaching text.' : lesson.segments.length ? 'Finished reading matching notes. This was source reading, not an AI-generated explanation.' : 'No matching source. Try words that occur in your notes; no answer was invented.';
    continuity.complete();
  } catch (error) { if (!run.signal.aborted) stop(error.message); }
  finally { if (controller === run) { controller = undefined; controls(false); } bookmarks(); }
}
function showSource(id) {
  const source = chunks.find(chunk => chunk.id === id);
  const item = document.createElement('li');
  item.textContent = `${source.name}, line ${source.line} [${source.id}]: ${source.text}`;
  $('sources').append(item);
}
window.addEventListener('pagehide', () => {
  leaveTeaching(); $('ai-selection').checked = false;
  microphone.end(); ++uploadGeneration; stop(); continuity.clear(); bookmarks(); $('conversation').replaceChildren(); lastTopic = ''; chunks = []; board.replaceChildren(); $('sources').replaceChildren();
  $('question').value = ''; $('material').textContent = 'No material loaded.'; $('timing').textContent = ''; controls(false);
});

// Hide stops both output channels and preserves a page-memory checkpoint.
document.addEventListener('visibilitychange', () => {
  if (document.hidden && controller) stop('Lesson interrupted while page hidden. Resume when ready.');
});
// Reserve the actual dock height, including font scaling and mobile safe areas.
if (window.ResizeObserver) new ResizeObserver(entries => {
  document.querySelector('main').style.paddingBottom = `${entries[0].target.getBoundingClientRect().height + 24}px`;
}).observe(document.querySelector('.dock'));
