window.printerAPI.getPrinters().then(printers => {
  const printersField = document.getElementById('printers');

  printers.forEach(printer => {
    const option = document.createElement('option');
    option.value = printer.name;
    option.textContent = printer.name;
    printersField.appendChild(option);
  });

  window.printerAPI.getDefault().then(defaultPrinter => {
    if (defaultPrinter) {
      printersField.value = defaultPrinter;
    }
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const printTest = document.getElementById('printTest');

  printTest.addEventListener('click', () => {
    const content = `
      Senha: 001
      Data: 18/06/2025
      Tipo: NORMAL
      Origem: Atendimento Geral
      Aguarde sua vez
    `;

    window.printerAPI.print(content);
  });
});
