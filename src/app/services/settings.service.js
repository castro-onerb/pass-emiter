document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('finishSettings').addEventListener('click', () => {
    const fila_id = document.getElementById('fila_id');

    window.settingsAPI.saveSettings({
      isConfigured: true,
      fila_id: Number(fila_id.value)
    }).then(res => {
      if (res.success) {
        window.dispatchEvent(new CustomEvent('modal-show', {
          detail: {
            title: `Configurações finalizadas.`,
          },
        }));
        window.appAPI.reloadToMain();
      }
    });
  });
});
