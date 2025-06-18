export class ModalDialog {
  static #backdrop = null;

  static show({ title = 'Aviso', message = '' } = {}) {
    if (this.#backdrop) return;

    const backdrop = document.createElement('div');
    backdrop.classList.add('modal-backdrop');

    const modal = document.createElement('div');
    modal.classList.add('modal');

    const titleEl = document.createElement('div');
    titleEl.classList.add('modal-title');
    titleEl.textContent = title;

    const messageEl = document.createElement('div');
    messageEl.classList.add('modal-message');
    messageEl.textContent = message;

    const closeBtn = document.createElement('button');
    closeBtn.classList.add('modal-button');
    closeBtn.textContent = 'Fechar';
    closeBtn.addEventListener('click', () => this.hide());

    modal.appendChild(titleEl);
    modal.appendChild(messageEl);
    modal.appendChild(closeBtn);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    this.#backdrop = backdrop;
  }

  static hide() {
    if (!this.#backdrop) return;
    this.#backdrop.remove();
    this.#backdrop = null;
  }

  static setupListeners() {
    window.addEventListener('modal-show', (e) => {
      this.show(e.detail);
    });
    window.addEventListener('modal-hide', () => this.hide());
  }
}
