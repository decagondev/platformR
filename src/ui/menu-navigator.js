export class MenuNavigator {
  options;
  selectedIndex = 0;

  constructor(options) {
    this.options = options;
  }

  down() {
    this.selectedIndex = (this.selectedIndex + 1) % this.options.length;
  }

  up() {
    this.selectedIndex =
      (this.selectedIndex - 1 + this.options.length) % this.options.length;
  }

  confirm() {
    return this.options[this.selectedIndex];
  }

  reset() {
    this.selectedIndex = 0;
  }

  setOptions(options) {
    this.options = options;
    this.selectedIndex = 0;
  }
}
