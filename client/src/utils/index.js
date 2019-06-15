const CART_KEY = "cart";
const TOKEN_KEY = "jwt";

// 95.89 иногда 95.89000000000002 нужно .toFixed(2)
// export const calculatePrice = (items) => items.reduce((acc, item) => acc + item.quantity * item.price, 0);

// $ 95.89
export const calculatePrice = (items) =>
  `$ ${items.reduce((acc, item) => acc + item.quantity * item.price, 0).toFixed(2)}`;

/* Cart */
export const setCartToLocalStorage = (value, cartKey = CART_KEY) => {
  if (localStorage) {
    localStorage.setItem(cartKey, JSON.stringify(value));
  }
};

export const getCartFromLocalStorage = (cartKey = CART_KEY) => {
  if (localStorage && localStorage.getItem(cartKey)) {
    return JSON.parse(localStorage.getItem(cartKey));
  }
  return [];
};

/* Auth */
export const setTokenToLocalStorage = (value, tokenKey = TOKEN_KEY) => {
  if (localStorage) {
    localStorage.setItem(tokenKey, JSON.stringify(value));
  }
};
