import { toast } from 'react-toastify';

const CART_KEY = 'shopping_cart';
const GUEST_CART_KEY = 'guestCart';

export const addToCart = (item) => {
  const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

  if (item.type === 'fabric') {
    const newSuit = {
      id: `SUIT-${item.id}`,
      fabricId: item.id,
      type: 'SUIT',
      complete: false,
    };
    cart.push(newSuit);
    toast.success(`Fabric ${item.name} added to a new suit`);
  } else if (item.type === 'style') {
    const lastIncompleteSuit = cart.find(suit => suit.type === 'SUIT' && !suit.complete);

    if (lastIncompleteSuit) {
      lastIncompleteSuit.styles = lastIncompleteSuit.styles || [];
      lastIncompleteSuit.styles.push(item);
      toast.success(`Style option added to your suit`);
    } else {
      toast.error('Please select a fabric first to start a new suit');
      return;
    }
  } else if (item.type === 'lining') {
    const lastIncompleteSuit = cart.find(suit => suit.type === 'SUIT' && !suit.complete);

    if (lastIncompleteSuit) {
      lastIncompleteSuit.lining = item;
      toast.success(`Lining added to your suit`);
    } else {
      toast.error('Please select a fabric first to start a new suit');
      return;
    }
  }

  // Mark suit as complete if fabric, style, and lining are selected
  cart.forEach((suit) => {
    if (suit.type === 'SUIT' && suit.fabricId && suit.styles && suit.styles.length > 0 && suit.lining) {
      suit.complete = true;
    }
  });

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  console.log("Cart after adding item:", cart); // Log to check cart contents
};

export const getCart = () => {
  const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  console.log("Retrieved Cart:", cart); // Log to check cart retrieval
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