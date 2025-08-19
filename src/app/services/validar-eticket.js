import isActuallyOnline from '../util/isOnline.js';

isActuallyOnline();
setInterval(isActuallyOnline, 5000);

export const buscarPaciente = async (cpf) => {
  const response = await fetch(`https://backoffice.deovita.com.br/deovita_fila_pre/autocomplete/verificarcpfpacienteagendamentorapido?cpf=${cpf}`);
  return await response.json();
};

export const iniciarPreAtendimento = async (cpf) => {
  const response = await fetch(`https://backoffice.deovita.com.br/deovita_fila_pre/autocomplete/iniciarPreAtendimento?cpf=${cpf}&ajax=true`);
  return await response.json();
};

export const validarDeovitaPaciente = async (cpf) => {
  const response = await fetch(`https://backoffice.deovita.com.br/deovita_fila_pre/autocomplete/validarDeovitaPaciente/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ cpfPaciente: cpf.toString(), empresa_id: '1' })
  });

  const result = await response.json();
  if (result === 'true' || result === 'cartaodesatualizado') return { pendencias: true };
  if (Array.isArray(result) && result[0]?.paciente_id) return result[0];
  return { erro: true };
};

/**
 * Valida se o paciente tem E-Ticket confirmado
 * @param {string|number} paciente_id
 * @param {string|number} empresa_id
 * @returns {Promise<{ cod: number, exames: any[], exame_inicial?: { sala_nome: string } }>}
 */
export const validarEticket = async (paciente_id, empresa_id = 1) => {
  const response = await fetch(
    `https://backoffice.deovita.com.br/deovita_fila_pre/autocomplete/validarEticketPaciente/`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        paciente_id: paciente_id.toString(),
        empresa_id: empresa_id.toString()
      }),
    }
  );

  return await response.json();
};

export const verificarAtendimentoPendente = async (paciente_id) => {
  const response = await fetch(`https://backoffice.deovita.com.br/deovita_fila_pre/autocomplete/verificarAtendimentoPendente/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ paciente_id: paciente_id.toString(), empresa_id: '1' })
  });
  return await response.json();
};

export const validarAtendimentoPendente = async (paciente_id) => {
  const response = await fetch(`https://backoffice.deovita.com.br/deovita_fila_pre/autocomplete/validarAtendimentoPendente/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ paciente_id: paciente_id.toString(), empresa_id: '1' })
  });
  return await response.json();
};

export const finalizarAtendimento = async (cpf, paciente_id, prioridade_id = 0, empresa_id = 1) => {
  const response = await fetch(`https://backoffice.deovita.com.br/deovita_fila_pre/autocomplete/finalizarAtendimento/?cpfPaciente=${cpf}&prioridade_id=${prioridade_id}&paciente_id=${paciente_id}&empresa_id=${empresa_id}`);
  return await response.json();
};
