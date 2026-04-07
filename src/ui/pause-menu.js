export class PauseMenu {
  visible = false;
  selectedIndex = 0;
  options = ['Resume', 'Restart Level', 'Quit to Title'];

  get isPaused() {
    return this.visible;
  }

  open() {
    this.visible = true;
    this.selectedIndex = 0;
  }

  close() {
    this.visible = false;
  }

  navigateDown() {
    this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
  }

  navigateUp() {
    this.selectedIndex =
      (this.selectedIndex - 1 + this.options.length) % this.options.length;
  }

  confirm() {
    return this.options[this.selectedIndex];
  }
}
