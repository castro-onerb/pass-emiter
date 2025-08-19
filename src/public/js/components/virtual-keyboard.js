export function enableVirtualKeyboard(targetSelector = '.cpf-digit') {
  const keyboard = document.getElementById('virtual-keyboard');
  const keys = keyboard.querySelectorAll('button');
  let focusedInput = null;

  document.querySelectorAll(targetSelector).forEach(input => {
    input.addEventListener('focus', () => {
      focusedInput = input;
    });
  });

  // Clica nos botões
  keys.forEach(key => {
    key.addEventListener('click', () => {
      if (!focusedInput) {
        const all = Array.from(document.querySelectorAll(targetSelector));
        if (all.length > 0) {
          focusedInput = all[0];
          focusedInput.focus();
        } else {
          return;
        }
      }

      const value = key.getAttribute('data-key');

      if (value === 'backspace') {
        focusedInput.value = '';
        const all = Array.from(document.querySelectorAll(targetSelector));
        const i = all.indexOf(focusedInput);
        if (i > 0) {
          all[i - 1].focus();
        }
        return;
      }

      if (value === 'clear') {
        document.querySelectorAll(targetSelector).forEach(i => (i.value = ''));
        document.querySelector(targetSelector)?.focus();
        return;
      }

      if (value.match(/[0-9]/)) {
        focusedInput.value = value;
        focusedInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  });
}
