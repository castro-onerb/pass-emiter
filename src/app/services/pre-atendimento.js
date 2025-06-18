import { TicketGenerator } from '../../public/js/ticket-generator.js';

const touch = document.getElementsByName('touch');

Array.from(touch).forEach((e) => {
  e.addEventListener('click', async () => {
    window.dispatchEvent(new Event('toast-start'));

    try {
      const prioridade = e.getAttribute('data-type') ?? 'NORMAL';
      const result = await fetch('https://backoffice.deovita.com.br/deovita_atendimento/ambulatorio/atendimento/criar_senha_pre_atendimento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          senha: TicketGenerator.generate(prioridade),
          guiche: 'BALCÃO: PRÉ ATENDIMENTO',
          setor_id: 1,
          prioridade,
          empresa_id: 1
        }),
      });

      const contentType = result.headers.get('Content-Type');

      if (result.ok && contentType?.includes('application/json')) {
        window.dispatchEvent(new CustomEvent('modal-show', {
          detail: {
            title: 'Senha gerada com sucesso',
          },
        }));
      } else {
        let errorText = 'Erro inesperado';

        try {
          const text = await result.text();
          if (result.status == 500 || result.status == 400 || text.startsWith('<')) {
            errorText = `O servidor retornou uma página HTML ${result.status ?? 'com 404, 500 ou outro erro desconhecido.'}`;
          } else {
            errorText = text;
          }
        } catch (_) {
          errorText = `Código HTTP: ${result.status}`;
        }

        window.dispatchEvent(new CustomEvent('modal-show', {
          detail: {
            title: 'Erro ao gerar senha',
            message: errorText,
          },
        }));
      }

    } catch (error) {
      console.error('Erro ao buscar o endereço:', error);
      window.dispatchEvent(new CustomEvent('modal-show', {
        detail: {
          title: 'Erro inesperado',
          message: error.message || 'Não foi possível conectar com o servidor.',
        }
      }));
    }

    window.dispatchEvent(new Event('toast-end'));
  });
});
