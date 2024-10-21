export const getCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

export const addToCart = (product) => {
  let cart = getCart();

  // Check if the product is already in the cart
  const existingItem = cart.find(
    (item) => item.id === product.id && item.type === product.type
  );

  if (existingItem) {
    // If the item already exists, increase its quantity by 1
    existingItem.quantity += 1;
  } else {
    // If the item doesn't exist, add it to the cart with quantity 1
    cart.push({ ...product, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart)); // Save the updated cart
};

export const removeFromCart = (id, type) => {
  let cart = getCart();
  const updatedCart = cart.filter(
    (item) => !(item.id === id && item.type === type)
  );
  localStorage.setItem("cart", JSON.stringify(updatedCart)); // Update cart in localStorage
  return updatedCart;
};

export const updateQuantity = (id, type, quantity) => {
  let cart = getCart();

  // Find the item in the cart and update its quantity
  cart = cart.map((item) => {
    if (item.id === id && item.type === type) {
      return { ...item, quantity: Math.max(1, quantity) }; // Ensure quantity is >= 1
    }
    return item;
  });

  localStorage.setItem("cart", JSON.stringify(cart)); // Save the updated cart
  return cart;
};
