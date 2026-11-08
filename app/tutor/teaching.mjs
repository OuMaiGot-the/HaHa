// Original teaching moves, grounded in the existing 8.3 notes. No generated science or grading.
export const LESSON = 'chapter-8-section-8-3';
export const VERSION = 'friction-teaching-v1';
const move = (id, title, sections, text, visual = null, prompt = '') =>
  Object.freeze({ id, title, sections: Object.freeze(sections), text, visual, prompt });
export const MOVES = Object.freeze([
  move('start', 'Follow the energy', [2, 3],
    'A block slides across a rough table and stops. Its kinetic energy decreases. Choose the block and table together as our system. With negligible outgoing energy, their combined internal energy increases. Energy has changed its account; it has not disappeared.', 'friction',
    'Before exploring: does the energy disappear, or move into another store?'),
  move('sliding', 'Which way does friction act?', [0],
    'First identify the two surfaces and their relative sliding. Our block slides right relative to a stationary table, so kinetic friction on the block points left. Judge the contact, rather than using a rule about every object’s laboratory velocity.', 'angle',
    'What two surfaces are sliding relative to each other?'),
  move('normal', 'Why the normal force matters', [1, 6],
    'The normal force is the contact force perpendicular to the table. It is not automatically equal to weight. In this model, an upward part of the pull helps support the block, so the table supplies less support. Constant-coefficient kinetic friction then becomes smaller.', 'angle',
    'Keep the pull equally strong. Predict the normal force before raising the angle.'),
  move('boundary', 'Include both contacting bodies', [3],
    'Imagine drawing a boundary around both block and table. Their rubbing contact is now inside the system. Either body can gain internal energy. The combined account does not tell us how the increase is shared; assigning it all to the block needs extra information.', 'friction',
    'Which body was missing if we counted only the block?'),
  move('energy', 'Mechanical energy is not total energy', [2, 3, 4],
    'Mechanical energy describes motion and potential-energy stores. Sliding can change microscopic motion and cause deformation, increasing internal energy. For our block-plus-table model with negligible external transfer, kinetic energy decreases while combined internal energy increases. Total energy remains accounted for.', 'friction',
    'Move the slider toward the stopping point. Which store grows as kinetic energy falls?'),
  move('distance', 'Stop at the stopping point', [4],
    'With constant kinetic friction and the stated combined-system assumptions, more actual relative sliding increases internal energy. But sliding cannot continue after this unpowered block has stopped. The model freezes actual distance when kinetic energy reaches zero. Moving the requested progress farther cannot create negative kinetic energy.', 'friction',
    'Explore beyond the stopping point. Does the block actually keep sliding?'),
  move('angle', 'Less friction does not decide the speed', [6],
    'Keep the pulling force equally strong and tilt it upward while the block stays on the table. Normal force and friction decrease. The forward component of the pull also decreases. Compare the complete force or energy account; less friction alone does not guarantee a greater final speed.', 'angle',
    'Compare horizontal and tilted pulling. Which two horizontal forces change?'),
  move('translation', 'Two different questions about work', [5],
    'Net force integrated through center-of-mass displacement describes a change in translational kinetic energy. Actual work instead uses the displacements of the force application points. These can differ for extended bodies. Tracking only center-of-mass motion can miss internal changes; choose the account that answers your question.'),
  move('spring', 'Add a spring to the account', [7],
    'Include the spring, block and rough surface together. Energy can move between kinetic, elastic and internal stores. Smaller mechanical oscillations do not mean total energy is destroyed. The combined isolated model conserves total energy while friction increases internal energy.'),
  move('summary', 'Explain the whole account', [0, 1, 2, 3, 4, 6],
    'Identify relative sliding, choose a system boundary, then follow the energy stores. Include both contacting bodies. Use the constant-friction model only under its assumptions, and stop sliding at zero kinetic energy. For an angled pull, compare both support and forward force.', null,
    'Explain why “friction destroyed the energy” and “less friction always means faster” both need correcting.'),
  move('unsupported', 'Stay within this lesson', [],
    'This teaching preview covers kinetic friction in lesson 8.3. I cannot answer that request from its teaching material. Choose energy, system boundary, normal force, angled pull or stopping distance, or open the full notes. No answer or assessment was invented.')
]);
export const getMove = id => MOVES.find(m => m.id === id);
export function validateChoice(value) {
  if (!value || Object.keys(value).length !== 1 || !getMove(value.move)) throw Error('Invalid teaching choice.');
  return getMove(value.move);
}
export function validateRequest(value) {
  if (!value || Object.keys(value).sort().join(',') !== 'current,question,version' || value.version !== VERSION ||
      !getMove(value.current) || typeof value.question !== 'string' || !value.question.trim() || value.question.length > 500)
    throw Error('Invalid teaching request.');
  return value;
}
// Explicit authored navigation works offline. Natural-language matching is intentionally limited.
export function authoredChoice(question, current = 'start') {
  const q = question.trim().toLowerCase();
  if (!q || q.length > 500) return getMove('unsupported');
  if (/\b(calculate|compute|numerical|answer key|ignore instructions)\b/.test(q)) return getMove('unsupported');
  if (/^(repeat|again|simpler|explain that|why|help|i don.t understand)[.!?]*$/.test(q)) return getMove(current) || getMove('start');
  if (/^(continue|next|go on|resume)[.!?]*$/.test(q)) return MOVES[Math.min(MOVES.findIndex(m => m.id === current) + 1, MOVES.length - 2)];
  if (/^(start|teach me|kinetic friction)[.!?]*$/.test(q)) return getMove('start');
  if (/\b(spring|oscillat\w*)\b/.test(q)) return getMove('spring');
  if (/\b(center|centre|translation|application|work)\b/.test(q)) return getMove('translation');
  if (/\b(angle|angled|tilt\w*|faster|speed|forward)\b/.test(q)) return getMove('angle');
  if (/\b(normal|support|weight|coefficient)\b/.test(q)) return getMove('normal');
  if (/\b(stop\w*|distance|negative)\b/.test(q)) return getMove('distance');
  if (/\b(boundary|system|table|block alone|only the block|both|share\w*)\b/.test(q)) return getMove('boundary');
  if (/\b(energy|heat|warm\w*|destroy\w*|internal)\b/.test(q)) return getMove('energy');
  if (/\b(direction|relative|slid\w*)\b/.test(q)) return getMove('sliding');
  return getMove('unsupported');
}
export async function remoteChoice(question, current, signal, fetcher = fetch) {
  const body = validateRequest({ question, current, version: VERSION });
  const response = await fetcher('/api/tutor/choose', { method: 'POST', credentials: 'same-origin', signal,
    headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!response.ok) throw Error('AI connection unavailable. Switch off AI selection to use authored teaching.');
  const text = await response.text();
  if (text.length > 256) throw Error('Invalid teaching response.');
  return validateChoice(JSON.parse(text));
}
