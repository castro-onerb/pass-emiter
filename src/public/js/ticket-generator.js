const TicketGenerator = {
  generate(type = 'NORMAL') {
    const prefix = type === 'PRIORIDADE' ? 'P' : 'N';
    const random = Array.from({ length: 6 }, () =>
      Math.random().toString(36).toUpperCase().charAt(2)
    ).join('');
    return `${prefix}-${random}`;
  }
};

export { TicketGenerator };
