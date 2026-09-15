// The four stages an order moves through, in order. Shared by the
// customer tracker (/account) and the admin status dropdown (/admin) so
// the two can never drift apart.
export const ORDER_STEPS = [
  { key: 'received', label: 'Order received', hint: 'We have your order' },
  { key: 'preparing', label: 'Preparing', hint: 'Cooking has started' },
  { key: 'ready', label: 'Ready', hint: 'Packed for delivery' },
  { key: 'delivered', label: 'Delivered', hint: 'Enjoy your meal' },
];

export const STATUS_LABEL = ORDER_STEPS.reduce((acc, s) => {
  acc[s.key] = s.label;
  return acc;
}, {});