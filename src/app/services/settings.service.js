document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('finishSettings').addEventListener('click', () => {
    window.settingsAPI.saveSettings({ isConfigured: true }).then(res => {
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
