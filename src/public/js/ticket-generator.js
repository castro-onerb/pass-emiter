const TicketGenerator = {
  generate(prefix = 'N') {
    const today = new Date();
    const dateKey = today.toISOString().split('T')[0];

    const storageKey = `counter_${prefix}_${dateKey}`;

    let counter = parseInt(localStorage.getItem(storageKey) || '0', 10);
    counter += 1;

    localStorage.setItem(storageKey, counter.toString());

    const formattedNumber = String(counter).padStart(3, '0');

    return `${prefix}-${formattedNumber}`;
  }
};

export { TicketGenerator };
