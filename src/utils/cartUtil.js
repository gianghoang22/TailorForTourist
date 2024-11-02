import { toast } from "react-toastify";

const storageType = localStorage;

// Lấy giỏ hàng từ storage
export const getCart = () => {
  const cart = storageType.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

// Lưu giỏ hàng vào storage
const saveCart = (cart) => {
  storageType.setItem("cart", JSON.stringify(cart));
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = (product) => {
  let cart = getCart();

  // Tạo ID duy nhất cho mỗi sản phẩm dựa trên thuộc tính của nó
  const productId = `${product.type}-${product.fabricId}-${product.styleId}-${product.liningId}`;

  // Kiểm tra sản phẩm đã có trong giỏ chưa
  const existingProduct = cart.find((item) => item.productId === productId);

  if (existingProduct) {
    // Nếu sản phẩm đã có, tăng số lượng
    existingProduct.quantity += 1;
    toast.success(
      `Cập nhật số lượng sản phẩm "${product.name}" trong giỏ hàng!`
    );
  } else {
    // Thêm sản phẩm mới với tất cả chi tiết
    const newProduct = {
      ...product,
      quantity: 1,
      productId,
      fabric: product.fabric, // Thêm thông tin fabric
      style: product.style, // Thêm thông tin style
      lining: product.lining, // Thêm thông tin lining
    };
    cart.push(newProduct);
    toast.success(`Sản phẩm "${product.name}" đã được thêm vào giỏ hàng!`);
  }

  saveCart(cart);
};

// Thêm sản phẩm tùy chỉnh vào giỏ hàng
export const addCustomProductToCart = (product) => {
  let cart = getCart();

  // Tạo ID duy nhất cho sản phẩm tùy chỉnh
  const customProductId = `${product.fabric.id}-${product.style.id}-${product.lining.id}-${Date.now()}`;

  const customProduct = {
    productId: customProductId,
    fabric: product.fabric,
    style: product.style,
    lining: product.lining,
    price: product.fabric.price + product.style.price + product.lining.price,
    quantity: 1,
  };

  cart.push(customProduct);

  saveCart(cart);

  toast.success(`Sản phẩm tùy chỉnh đã được thêm vào giỏ hàng!`);
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeFromCart = (productId) => {
  let cart = getCart();

  cart = cart.filter((item) => item.productId !== productId);

  saveCart(cart);

  return cart;
};

// Cập nhật số lượng sản phẩm
export const updateQuantity = (productId, quantity) => {
  let cart = getCart();

  cart = cart.map((item) => {
    if (item.productId === productId) {
      return { ...item, quantity: Math.max(1, quantity) };
    }
    return item;
  });

  saveCart(cart);

  return cart;
};

// Lấy giỏ hàng hiện tại
export const getCurrentCart = () => {
  return getCart();
};
