export class ModalDialog {
  static #backdrop = null;
  static #autoCloseTimeout = null;

  static show({ title = '', message = '', type = null, hideCloseButton = false, autoClose = null, id = null } = {}) {
    if (this.#backdrop && this.#backdrop.dataset.id !== id) return;

    const backdrop = document.createElement('div');
    backdrop.classList.add('modal-backdrop');
    if (id) backdrop.dataset.id = id;

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

    modal.appendChild(titleEl);
    modal.appendChild(messageEl);

    if (!hideCloseButton) {
      const closeBtn = document.createElement('button');
      closeBtn.classList.add('modal-button');
      closeBtn.textContent = 'Fechar';
      closeBtn.dataset.id = id;
      closeBtn.addEventListener('click', (e) => this.hide({ id: e.currentTarget.dataset.id }));
      closeBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('modal-hide', { detail: { id } }));
      });
      modal.appendChild(closeBtn);
    }

    if (autoClose !== null && Number.isFinite(autoClose) && autoClose > 0) {
      this.#autoCloseTimeout = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('modal-hide', { detail: { id } }));
      }, autoClose * 1000);
    }
    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    this.#backdrop = backdrop;
  }

  static hide({ id = null } = {}) {
    if (!this.#backdrop) return;

    // Se houver um id, só fecha se bater com o que está no modal atual
    if (id && this.#backdrop.dataset.id !== id) return;

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

    window.addEventListener('modal-hide', (e) => {
      const id = e.detail?.id ?? null;
      this.hide({ id });
    });
  }

}
