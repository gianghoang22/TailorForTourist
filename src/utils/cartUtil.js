// utils/cartUtil.js
import { toast } from 'react-toastify';

const CART_KEY = 'shopping_cart';

export const addToCart = (item) => {
  const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  
  if (item.type === 'fabric') {
    // Start a new suit product
    const newSuit = {
      id: `SUIT ${item.id}`,
      name: `SUIT ${item.name}`,
      price: item.price,
      fabric: item,
      type: 'suit'
    };
    cart.push(newSuit);
    toast.success(`Fabric ${item.name} added to your suit`);
  } else if (item.type === 'style' || item.type === 'lining') {
    // Find the latest suit without complete components
    const lastSuit = cart[cart.length - 1];
    if (lastSuit && lastSuit.type === 'suit') {
      if (item.type === 'style') {
        lastSuit.style = item;
        toast.success(`Style option added to your suit`);
      } else if (item.type === 'lining') {
        lastSuit.lining = item;
        toast.success(`Lining added to your suit`);
      }
    } else {
      toast.error('Please select a fabric first');
      return;
    }
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