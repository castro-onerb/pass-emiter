
async function isActuallyOnline() {
  const controller = new AbortController();
  let timeout;

  try {
    timeout = setTimeout(() => controller.abort(), 3000);
    const response = await fetch('https://backoffice.deovita.com.br/deovita_fila_pre/base/BaseController/ping', {
      method: 'HEAD',
      cache: 'no-cache',
      signal: controller.signal
    });
    clearTimeout(timeout);

    const online = response.ok;

    if (!online) {
      window.dispatchEvent(new CustomEvent('modal-show', {
        detail: {
          id: 'connection',
          type: 'error',
          title: 'Está sem internet?',
          message: 'Não conseguimos nos conectar à internet.',
          hideCloseButton: false,
          autoClose: 5,
          id: 'connection'
        },
      }));
    }

    if (online) {
      window.dispatchEvent(new CustomEvent('modal-hide', {
        detail: { id: 'connection' }
      }));
    }
  } catch {
    console.log('errado');
    window.dispatchEvent(new CustomEvent('modal-show', {
      detail: {
        type: 'danger',
        title: 'Está sem internet?',
        message: 'Não conseguimos nos conectar a internet.',
        hideCloseButton: true,
      },
    }));
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export default isActuallyOnline;