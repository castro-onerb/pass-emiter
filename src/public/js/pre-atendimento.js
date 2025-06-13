const touch = document.getElementsByName('touch');

Array.from(touch).forEach((e) => {
  e.addEventListener('click', async () => {
    try {
      const prioridade = e.getAttribute('data-type') ?? 'NORMAL';
      const result = await fetch('https://hom.deovita.com.br/carlosw/clinicas/ambulatorio/atendimento/criar_senha_pre_atendimento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          senha: 'A002',
          guiche: 'BALCÃO: PRÉ ATENDIMENTO',
          setor_id: 1,
          prioridade,
          empresa_id: 1
        }),
      });
      if (result.ok) {
        const data = await result.json();
        alert('Sucesso:\n' + JSON.stringify(data, null, 2));
      } else {
        alert(`Erro na requisição: ${result.status}`);
      }
    } catch (error) {
      console.error('Erro ao buscar o endereço:', error);
      alert('Erro ao buscar o endereço.');
    }
  });
});
