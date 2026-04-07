export class HudState {
  deathCount = 0;
  levelName = '';
  timerMs = 0;
  paused = false;

  setDeathCount(count) {
    this.deathCount = count;
  }

  setLevelName(name) {
    this.levelName = name;
  }

  tick(dt) {
    if (!this.paused) {
      this.timerMs += dt;
    }
  }

  resetTimer() {
    this.timerMs = 0;
  }

  get formattedTime() {
    const totalSeconds = this.timerMs / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const centiseconds = Math.floor((this.timerMs % 1000) / 10);

    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    const cs = String(centiseconds).padStart(2, '0');

    return `${mm}:${ss}.${cs}`;
  }
}
