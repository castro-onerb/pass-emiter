export class ToastSpinner {
  static #spinner = null;
  static #backdrop = null;

  static show() {
    if (this.#spinner || this.#backdrop) return;

    const backdrop = document.createElement('div');
    backdrop.classList.add('backdrop');

    const spinner = document.createElement('div');
    spinner.classList.add('toast-spinner');

    backdrop.appendChild(spinner);
    document.body.appendChild(backdrop);

    this.#spinner = spinner;
    this.#backdrop = backdrop;
  }


  static hide() {
    this.#spinner?.remove();
    this.#backdrop?.remove();
    this.#spinner = null;
    this.#backdrop = null;
  }

  static setupListeners() {
    window.addEventListener('toast-start', () => this.show());
    window.addEventListener('toast-end', () => this.hide());
  }

  static autoStartUntilLoad() {
    this.show();
    window.addEventListener('load', () => this.hide());
  }
}
