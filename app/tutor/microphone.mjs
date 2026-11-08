// Browser speech is an optional adapter; no raw audio or transcripts are persisted.
export class Microphone {
  constructor(callbacks) {
    this.callbacks = callbacks; this.wanted = false; this.generation = 0;
    this.Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) this.end('Microphone off · page hidden; enable to resume');
    });
    this.initialize();
  }
  saved() { try { return localStorage.getItem('yoon.tutor.mic-muted'); } catch { return null; } }
  save(value) { try { localStorage.setItem('yoon.tutor.mic-muted', String(value)); } catch { /* Ephemeral preference when storage is blocked. */ } }
  async initialize() {
    const generation = this.generation;
    if (!this.Recognition || !window.isSecureContext) {
      this.callbacks.status('Microphone unavailable · type below', false); return;
    }
    try {
      this.permission = await navigator.permissions.query({ name: 'microphone' });
      this.permission.onchange = () => {
        if (this.permission.state !== 'granted') this.end('Microphone permission withdrawn · type below');
      };
      // Permission alone does not authorize a potentially remote recognition provider.
      if (generation === this.generation && !document.hidden && this.permission.state === 'granted' && this.saved() === 'false') this.start();
      else if (generation === this.generation && this.saved() === 'true') this.callbacks.status('Microphone muted · saved preference', false);
    } catch { /* Browsers without permission queries require the explicit enable gesture. */ }
  }
  toggle() {
    if (this.wanted) { this.save(true); this.end('Microphone muted'); }
    else { this.save(false); this.start(); }
  }
  end(message = 'Microphone off · session ended') {
    this.wanted = false; ++this.generation; clearTimeout(this.timer);
    const recognition = this.recognition; this.recognition = undefined;
    recognition?.abort(); this.callbacks.status(message, false);
  }
  start() {
    if (!this.Recognition || !window.isSecureContext || document.hidden) {
      this.end('Microphone unavailable · type below'); return;
    }
    this.wanted = true; const generation = ++this.generation;
    const recognition = new this.Recognition(); this.recognition = recognition;
    recognition.lang = 'en-US'; recognition.continuous = true; recognition.interimResults = true;
    const current = () => this.wanted && this.generation === generation;
    this.callbacks.status('Microphone starting · waiting for browser authorization', true);
    recognition.onaudiostart = () => { if (current()) this.callbacks.status('Microphone listening', true); };
    recognition.onresult = event => {
      if (!current()) return;
      let final = '', heard = false;
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript.trim();
        if (text) heard = true;
        if (event.results[i].isFinal) final += text + ' ';
      }
      if (heard) this.callbacks.interrupt();
      if (final.trim()) this.callbacks.submit(final.trim());
    };
    recognition.onerror = event => {
      if (!current()) return;
      if (event.error === 'no-speech') {
        this.callbacks.status('No speech detected · still listening', true); return;
      }
      this.end(`Microphone stopped (${event.error || 'browser error'}) · enable to retry or type below`);
    };
    recognition.onend = () => {
      if (!current()) return;
      this.callbacks.status('Microphone reconnecting', true);
      this.timer = setTimeout(() => { if (current()) this.start(); }, 700);
    };
    try { recognition.start(); }
    catch { this.end('Browser requires a microphone enable gesture · type below'); }
  }
}
