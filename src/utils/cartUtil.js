import { toast } from 'react-toastify';

const CART_KEY = 'shopping_cart';

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
