export class ModalDialog {
  static #backdrop = null;
  static #autoCloseTimeout = null;

  static show({ title = '', message = '', type = null, hideCloseButton = false, autoClose = null } = {}) {
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

    if (type) {
      const imgEl = document.createElement('img');
      imgEl.classList.add('modal-icon');
      imgEl.alt = type;

      try {
        const basePath = window.appPath?.getBasePath?.();
        imgEl.src = basePath
          ? `file://${basePath}/../../public/img/icons/${type}.gif`
          : `img/modal/${type}.gif`;
        imgEl.height = 240;
        imgEl.style.marginInline = 'auto';
      } catch {
        imgEl.src = `img/modal/${type}.gif`;
      }

      modal.appendChild(imgEl);
    }

    if (!hideCloseButton) {
      const closeBtn = document.createElement('button');
      closeBtn.classList.add('modal-button');
      closeBtn.textContent = 'Fechar';
      closeBtn.addEventListener('click', () => this.hide());
      modal.appendChild(closeBtn);
    }

    if (autoClose && typeof autoClose === 'number') {
      this.#autoCloseTimeout = setTimeout(() => {
        this.hide();
      }, autoClose * 1000);
    }

    modal.appendChild(titleEl);
    modal.appendChild(messageEl);
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    this.#backdrop = backdrop;
  }

  static hide() {
    if (!this.#backdrop) return;
    if (this.#autoCloseTimeout) {
      clearTimeout(this.#autoCloseTimeout);
      this.#autoCloseTimeout = null;
    }

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
