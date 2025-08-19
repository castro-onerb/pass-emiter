export function generateTicketHTML({ code, type, origin, qrcodeBase64 }) {
  const date = new Date().toLocaleString('pt-BR');

  return `
    <!DOCTYPE html>
    <html lang="pt-br">
    <head>
      <meta charset="UTF-8">
      <style>
        @page { size: 60mm auto; margin: 0; }
        body {
          width: 60mm;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-family: Arial, sans-serif;
          text-align: center;
        }
        h1 { margin: 0; font-size: 32px; }
        p { margin: 4px 0; }
        .ticket:first-child { border-bottom: 1px solid #000; }
        img.qrcode { width: 100px; height: 100px; margin: 10px auto; }
      </style>
    </head>
    <body>
      <div class="ticket">
        <h1>Senha: ${code}</h1>
        <p>Data: ${date}</p>
        <p>Tipo: ${type}</p>
        <p>Aguarde sua vez</p>
        <p class="margin-inline: auto;">
          ${qrcodeBase64 ? `<img class="qrcode" src="${qrcodeBase64}" alt="QR Code" />` : ''}
        </p>
      </div>
      <div class="ticket">
        <div style="height: 20mm;"></div>
      </div>
    </body>
    </html>
  `;
}
