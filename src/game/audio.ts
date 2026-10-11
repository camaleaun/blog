// Tiny 8-bit sound effects with Web Audio: square and noise blips, no files.
// The AudioContext is created only from the sound button (a user gesture).
export class Sound {
  private ctx: AudioContext | null = null;
  enabled = false;

  enable(on: boolean) {
    this.enabled = on;
    if (on && !this.ctx) this.ctx = new AudioContext();
    if (on) void this.ctx?.resume();
  }

  private tone(freq: number, to: number, time: number, type: OscillatorType = "square", volume = 0.05) {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(to, t + time);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + time);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + time);
  }

  private noise(time: number, volume = 0.08) {
    if (!this.enabled || !this.ctx) return;
    const ctx = this.ctx;
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * time), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = volume;
    source.buffer = buffer;
    source.connect(gain).connect(ctx.destination);
    source.start();
  }

  move() {
    this.tone(520, 700, 0.06, "square", 0.03);
  }
  out() {
    this.noise(0.18, 0.06);
    this.tone(880, 1320, 0.1, "triangle", 0.05);
  }
  hurt() {
    this.noise(0.35, 0.12);
    this.tone(220, 70, 0.35, "sawtooth", 0.06);
  }
  life() {
    this.tone(660, 990, 0.12);
    setTimeout(() => this.tone(990, 1480, 0.14), 110);
  }
  level() {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, f, 0.1, "square", 0.04), i * 90));
  }
  over() {
    [392, 330, 262, 196].forEach((f, i) => setTimeout(() => this.tone(f, f * 0.98, 0.18, "square", 0.05), i * 160));
  }
}
