import { toast } from 'react-toastify';

export const CART_KEY = 'shopping_cart';
const GUEST_CART_KEY = 'guestCart';

export const clearCustomizationCache = () => {
  localStorage.removeItem("styleOptionId");
  localStorage.removeItem("selectedStyles");
  localStorage.removeItem("selectedImages");
  localStorage.removeItem("selectedOptionValues");
  localStorage.removeItem("selectedOptions");
};

export const addToCart = (item) => {
  let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  console.log("Current Cart before adding:", cart);
  console.log("Adding Item:", item);

  if (item.type === 'fabric') {
    cart = [];
    
    const newSuit = {
      id: `SUIT-${item.id}`,
      fabricId: item.id,
      type: 'SUIT',
      complete: false,
      styles: [],
      lining: null
    };
    cart.push(newSuit);
  } else if (item.type === 'style') {
    const lastSuit = cart[cart.length - 1];
    if (lastSuit && !lastSuit.complete) {
      lastSuit.styles = lastSuit.styles || [];
      const existingStyleIndex = lastSuit.styles.findIndex(
        style => style.optionType === item.optionType
      );
      if (existingStyleIndex !== -1) {
        lastSuit.styles[existingStyleIndex] = item;
      } else {
        lastSuit.styles.push(item);
      }
      checkAndMarkComplete(lastSuit);
    }
  } else if (item.type === 'lining') {
    const lastSuit = cart[cart.length - 1];
    if (lastSuit && !lastSuit.complete) {
      lastSuit.lining = item;
      checkAndMarkComplete(lastSuit);
    }
  }

  console.log("Updated Cart:", cart);
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  return cart;
};

const checkAndMarkComplete = (suit) => {
  if (
    suit.fabricId &&
    suit.styles && suit.styles.length > 0 &&
    suit.lining
  ) {
    suit.complete = true;
    console.log("Suit marked as complete:", suit);
  }
};

export const getLastCompleteSuit = () => {
  const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  return cart.find(suit => suit.complete === true);
};

export const getCart = () => {
  const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  console.log("Retrieved Cart:", cart);
  return cart;
};

export const removeFromCart = (itemId) => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== itemId);
  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  toast.info('Item removed from cart');
};

export const addToGuestCart = (product, isCustom = false) => {
  const guestCart = JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || {
    cartItems: [],
    cartTotal: 0
  };

  const cartItemId = Date.now(); // Generate unique ID
  const newItem = {
    cartItemId,
    quantity: 1,
    price: product.price,
    isCustom,
    product: isCustom ? null : product,
    customProduct: isCustom ? {
      ...product,
      productCode: `CUSTOM${Date.now()}`
    } : null
  };

  guestCart.cartItems.push(newItem);
  guestCart.cartTotal = guestCart.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
  toast.success(isCustom ? 'Custom product added to cart' : 'Product added to cart');
};

export const getGuestCart = () => {
  return JSON.parse(localStorage.getItem(GUEST_CART_KEY)) || {
    cartItems: [],
    cartTotal: 0
  };
};

export const updateGuestCartQuantity = (productCode, action) => {
  const guestCart = getGuestCart();
  const item = guestCart.cartItems.find(item => 
    (item.isCustom ? item.customProduct.productCode : item.product.productCode) === productCode
  );

  if (item) {
    if (action === 'increase') {
      item.quantity += 1;
    } else if (action === 'decrease' && item.quantity > 1) {
      item.quantity -= 1;
    }

    guestCart.cartTotal = guestCart.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
    return guestCart;
  }
};

export const removeFromGuestCart = (productCode) => {
  const guestCart = getGuestCart();
  guestCart.cartItems = guestCart.cartItems.filter(item => 
    (item.isCustom ? item.customProduct.productCode : item.product.productCode) !== productCode
  );
  guestCart.cartTotal = guestCart.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(guestCart));
  toast.success('Product removed from cart');
  return guestCart;
};

export const clearGuestCart = () => {
  localStorage.removeItem(GUEST_CART_KEY);
};

export const removeStyleFromCart = (optionType) => {
  const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  const updatedCart = cart.map(suit => {
    if (suit.styles) {
      suit.styles = suit.styles.filter(style => style.optionType !== optionType);
    }
    return suit;
  });
  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  toast.info(`${optionType} removed from cart`);
};