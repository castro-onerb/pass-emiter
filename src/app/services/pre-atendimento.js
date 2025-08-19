import { TicketGenerator } from '../../public/js/ticket-generator.js';
import { generateTicketHTML } from './printers.service.js';
import isActuallyOnline from '../util/isOnline.js';

isActuallyOnline();

setInterval(isActuallyOnline, 5000);

const touch = document.getElementsByName('touch');

Array.from(touch).forEach((e) => {
  e.addEventListener('click', async () => {
    window.dispatchEvent(new Event('toast-start'));

    try {
      const prefix = e.getAttribute('data-type') ?? 'N';
      const ticketGenerated = TicketGenerator.generate(prefix);
      const ticket = 'sigla: ' + ticketGenerated;

      const typeMap = {
        N: 'NORMAL',
        P: 'PRIORIDADE',
        PE: 'PRIORIDADE ESPECIAL OU URGENTE',
      };

      const fila_id = 7;
      const guiche = null;
      const setor = 'Recepção 1';

      const prioridade = typeMap[prefix] ?? 'NORMAL';

      const query = fetch('https://backoffice.deovita.com.br/deovita_fila_pre/ambulatorio/atendimento/criar_senha_pre_atendimento', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          senha: ticket,
          guiche,
          setor_id: 1,
          prioridade: prioridade,
          empresa_id: 1,
          fila_id,
          setor
        }),
      });

      const content = generateTicketHTML({
        code: ticketGenerated,
        type: prioridade,
        qrcodeBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASIAAAEiAQAAAAB1xeIbAAAB50lEQVR4nO2aTc6bMBiEn7dYYmmk7wA9irlZ1ZuZo+QAlWAZyWi6MOb7q9ouSp2AvYgEeaSMgAzDO5j485q+/AUEjWrUE1GLbWtcHNsHUPa6WrouQXWSJIG/myKr5a+CJGmup+sa1HZ5L73Mvib0fYD8hxir6jo35d5u+LsJVgg3l+rquiJlNnSy0affUv/yF69OSUrA4iDMxe/xkmJVXeen1hxogE6w9MpnYTIzs6GerrNT9uHZyvAzBt1b02nPVkdRr4F+WI1wc+RkOQ1g49Ly/VEUOdtHn1D0kjR3UvQS+IQinRQfVf1zUw6WAcKtl4WbIVizDwlWLMwvVXRdgXLgUw75moYuWYjbHcAABKmKritQm7fjJcIMhLnLxpMzZragR1X/3FSO9tn0VQ67IuXYN78/lMpZ3mFjHqPts7R5Nfs2V9N1esqBFxYEAuVob7CaJmt+fyi1+33KVl/8HoAtbTbPOYYqVl9m9Zv9787f7rWHUq+9FZ2YrM8h08bKuk5PlWtcUimqOpG7rLl5zn+gtt6K1XJvFVnLCLOqrnNT7tOexSXD/3BiecHwdXRdjlr6fYIGTMNqim2OeRj13u/Tu7cTygsMze+Po/beaq+sAAi627b5yOqfl/rYW/1ytd6qUSejfgK7ajEQOaU3YwAAAABJRU5ErkJggg=='
      });

      window.printerAPI.print(content);

      const response = await query;
      const contentType = response.headers.get('Content-Type');
      const result = await response.json();

      if (result.success && contentType?.includes('application/json')) {
        window.dispatchEvent(new CustomEvent('modal-show', {
          detail: {
            type: 'success',
            hideCloseButton: true,
            autoClose: 3
          },
        }));
      } else {
        let errorText = 'Erro inesperado';
        try {
          const text = await response.text();
          if (response.status === 500 || response.status === 400 || text.startsWith('<')) {
            errorText = `O servidor retornou uma página HTML (${response.status ?? 'erro desconhecido'})`;
          } else {
            errorText = text;
          }
        } catch (_) {
          errorText = `Código HTTP: ${response.status}`;
        }

        window.dispatchEvent(new CustomEvent('modal-show', {
          detail: {
            type: 'danger',
            hideCloseButton: true,
            autoClose: 3
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
