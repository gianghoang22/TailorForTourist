export const calculateStoreRevenue = async (orderId) => {
  try {
    // Fetch order details from API
    const response = await fetch(`https://vesttour.xyz/api/Orders/${orderId}/details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch order details for order ${orderId}`);
    }

    const orderData = await response.json();
    
    // Calculate tailor's revenue (70% of SUIT items)
    const suitTotal = orderData.orderDetails
      .filter(detail => detail.productCode.startsWith('SUIT'))
      .reduce((sum, detail) => sum + (detail.price || 0), 0);
    
    const tailorRevenue = suitTotal * 0.7;

    // Store revenue is total price minus tailor revenue
    const storeRevenue = orderData.totalPrice - tailorRevenue;

    return {
      totalPrice: orderData.totalPrice,
      storeRevenue,
      tailorRevenue,
      suitTotal
    };
  } catch (error) {
    console.error('Error calculating store revenue:', error);
    throw error;
  }
}; 