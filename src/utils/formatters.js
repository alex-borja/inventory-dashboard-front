export function formatCurrency(value) {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'USD'
  }).format(value);
}

export function getStockClass(stock) {
  if (stock < 5) return 'stock-low';
  if (stock < 15) return 'stock-warning';
  return 'stock-ok';
}
