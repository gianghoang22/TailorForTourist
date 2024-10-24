import { toast } from "react-toastify"; // Import react-toastify

// Đặt biến để sử dụng storage (localStorage hoặc sessionStorage)
const storageType = localStorage; // Có thể đổi thành sessionStorage nếu cần

// Hàm lấy cart từ storage
export const getCart = () => {
  const cart = storageType.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

// Biến tạm để lưu trữ cart
let tempCart;

// Khởi tạo tempCart bằng cách gọi getCart() sau khi hàm được định nghĩa
const initializeCart = () => {
  tempCart = getCart();
};

// Gọi hàm khởi tạo
initializeCart();

export const addToCart = (product) => {
  let cart = getCart();
  // Create a unique identifier for each product
  const productId = `${product.type}-${product.id}-${product.fabricId}-${product.styleId}-${product.liningId}-${Date.now()}`;
  // Check if the product already exists in the cart
  const existingProduct = cart.find((item) => item.uniqueId === productId);

  if (existingProduct) {
    // If the product exists, update the quantity
    existingProduct.quantity += 1;
    toast.success(
      `Cập nhật số lượng sản phẩm "${product.name}" trong giỏ hàng!`
    );
  } else {
    // Add new product to the cart
    cart.push({ ...product, quantity: 1, uniqueId: productId });
    toast.success(`Sản phẩm "${product.name}" đã được thêm vào giỏ hàng!`);
  }

  // Save the cart to storage
  storageType.setItem("cart", JSON.stringify(cart));
};

// Hàm thêm sản phẩm tùy chỉnh vào giỏ
export const addCustomProductToCart = (product) => {
  // Tạo id duy nhất cho sản phẩm tùy chỉnh
  const productId = tempCart.length + 1;

  const customProduct = {
    productId, // ID duy nhất
    fabric: product.fabric, // Chất liệu đã chọn
    style: product.style, // Kiểu dáng đã chọn
    lining: product.lining, // Lớp lót đã chọn
    price: product.fabric.price + product.style.price + product.lining.price, // Tổng giá
    quantity: 1, // Số lượng mặc định
  };

  // Thêm sản phẩm vào giỏ hàng
  tempCart.push(customProduct);

  // Thông báo cho người dùng
  toast.success(`Sản phẩm tùy chỉnh đã được thêm vào giỏ hàng!`);
};

export const removeFromCart = (uniqueId) => {
  // Lọc giỏ hàng để xóa sản phẩm có uniqueId tương ứng
  tempCart = tempCart.filter((item) => item.uniqueId !== uniqueId);
  // Cập nhật lại cart trong storage
  storageType.setItem("cart", JSON.stringify(tempCart));
  return tempCart; // Trả về cart đã cập nhật
};

// Hàm cập nhật số lượng sản phẩm
export const updateQuantity = (id, type, quantity) => {
  // Tìm sản phẩm và cập nhật số lượng
  tempCart = tempCart.map((item) => {
    if (item.id === id && item.type === type) {
      return { ...item, quantity: Math.max(1, quantity) }; // Đảm bảo số lượng >= 1
    }
    return item;
  });

  return tempCart; // Trả về cart đã cập nhật
};

// Hàm để lấy giỏ hàng hiện tại (tạm thời)
export const getCurrentCart = () => {
  return tempCart;
};
