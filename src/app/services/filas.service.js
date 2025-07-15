document.addEventListener('DOMContentLoaded', async () => {
  const filaInput = document.getElementById('fila_id');

  // Busca o valor salvo anteriormente
  const savedFilaId = await window.settingsAPI.getSetting('fila_id');
  
  if (savedFilaId) {
    filaInput.value = savedFilaId;
  }
});
