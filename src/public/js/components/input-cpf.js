export function createCpfInput(containerId, onComplete) {
  const container = document.getElementById(containerId);
  const inputs = [];

  const addSeparator = (text) => {
    const span = document.createElement('span');
    span.textContent = text;
    span.classList.add('cpf-separator');
    container.appendChild(span);
  };

  for (let i = 0; i < 11; i++) {
    // Adiciona pontuação nos lugares certos
    if (i === 3 || i === 6) addSeparator('.');
    if (i === 9) addSeparator('-');

    const input = document.createElement('input');
    input.type = 'tel';
    input.inputMode = 'numeric';
    input.pattern = '[0-9]*';
    input.maxLength = 1;
    input.classList.add('cpf-digit');
    container.appendChild(input);
    inputs.push(input);
  }

  inputs.forEach((input, i) => {
    input.addEventListener('input', (e) => {
      const value = e.target.value.replace(/\D/g, '');
      if (value) {
        e.target.value = value[0];
        if (i < inputs.length - 1) {
          inputs[i + 1].focus();
        }
      }

      const cpf = inputs.map(inp => inp.value).join('');
      if (cpf.length === 11) {
        onComplete(cpf);
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace') {
        if (input.value === '') {
          if (i > 0) {
            inputs[i - 1].focus();
            inputs[i - 1].value = '';
          }
        } else {
          input.value = '';
        }
        e.preventDefault();
      }

      if (e.key === 'ArrowLeft' && i > 0) {
        inputs[i - 1].focus();
      }

      if (e.key === 'ArrowRight' && i < inputs.length - 1) {
        inputs[i + 1].focus();
      }
    });
  });
}
