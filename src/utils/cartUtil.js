import { toast } from 'react-toastify';

const CART_KEY = 'shopping_cart';

export const addToCart = (item) => {
  const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

  if (item.type === 'fabric') {
    
    const newSuit = {
      id: `SUIT-${item.name}-${Date.now()}`,
      name: `SUIT ${item.name}`,
      price: item.price,
      fabric: item,
      styles: [], 
      lining: null,
      type: 'SUIT',
      complete: false, 
    };
    cart.push(newSuit);
    toast.success(`Fabric ${item.name} added to a new suit`);
  } else if (item.type === 'style') {
    const lastIncompleteSuit = cart.find(suit => suit.type === 'SUIT' && !suit.complete);
    
    if (lastIncompleteSuit) {
      lastIncompleteSuit.styles.push(item); 
      toast.success(`Style option added to your suit`);
    } else {
      toast.error('Please select a fabric first to start a new suit');
      return;
    }
  } else if (item.type === 'lining') {
    const lastIncompleteSuit = cart.find(suit => suit.type === 'SUIT' && !suit.complete);
    
    if (lastIncompleteSuit) {
      if (!lastIncompleteSuit.lining) {
        lastIncompleteSuit.lining = item;
        toast.success(`Lining added to your suit`);
      } else {
        toast.info(`Lining is already added to your suit`);
      }
    } else {
      toast.error('Please select a fabric first to start a new suit');
      return;
    }
  }

  // Mark suit as complete if fabric, style, and lining are selected
  cart.forEach((suit) => {
    if (suit.type === 'SUIT' && suit.fabric && suit.styles.length > 0 && suit.lining) {
      suit.complete = true;
    }
  });

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addNonCustomSuitToCart = (item) => {
  const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');

  if (item.type === 'non-custom-suit') {
    const newSuit = {
      id: `NONCUSTOM-${item.id}-${Date.now()}`,
      name: `Non-Custom Suit: ${item.name}`,
      price: item.price,
      type: 'NONCUSTOM_SUIT',
      complete: true,
    };
    cart.push(newSuit);
    toast.success(`${item.name} added to your cart`);
  } else {
    toast.error('Invalid item!');
    return;
  }

  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const getCart = () => {
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
};

export const removeFromCart = (itemId) => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== itemId);
  localStorage.setItem(CART_KEY, JSON.stringify(updatedCart));
  toast.info('Item removed from cart');
};
