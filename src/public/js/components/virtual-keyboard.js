export function enableVirtualKeyboard(targetSelector = '.cpf-digit') {
  const keyboard = document.getElementById('virtual-keyboard');
  const keys = keyboard.querySelectorAll('button');
  let focusedInput = null;
  let hideTimeout = null;

  function showKeyboard() {
    clearTimeout(hideTimeout);
    keyboard.classList.add('visible');
  }

  function hideKeyboard() {
    hideTimeout = setTimeout(() => {
      keyboard.classList.remove('visible');
    }, 150);
  }

  document.querySelectorAll(targetSelector).forEach(input => {
    input.addEventListener('focus', () => {
      focusedInput = input;
      showKeyboard();
    });

    input.addEventListener('blur', () => {
      hideKeyboard();
    });
  });

  // Clica nos botões
  keys.forEach(key => {
    key.addEventListener('click', () => {
      if (!focusedInput) return;

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
        const all = Array.from(document.querySelectorAll(targetSelector));
        const i = all.indexOf(focusedInput);
        if (i < all.length - 1) {
          all[i + 1].focus();
        }
      }
    });
  });
}
