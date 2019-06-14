// 95.89 иногда 95.89000000000002 нужно .toFixed(2)
// export const calculatePrice = (items) => items.reduce((acc, item) => acc + item.quantity * item.price, 0);

// $ 95.89
export const calculatePrice = (items) =>
  `$ ${items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}`;
