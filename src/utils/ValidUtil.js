

export const validateFormFields = (fields) => {
    const errors = {};
  
    // Validate First Name
    if (!fields.guestFname?.trim()) {
      errors.guestFname = "First name is required.";
    }
  
    // Validate Last Name
    if (!fields.guestLname?.trim()) {
      errors.guestLname = "Last name is required.";
    }
  
    // Validate Phone
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!fields.guestPhone?.trim()) {
      errors.guestPhone = "Phone number is required.";
    } else if (!phoneRegex.test(fields.guestPhone)) {
      errors.guestPhone = "Phone number is invalid.";
    }
  
    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!fields.guestEmail?.trim()) {
      errors.guestEmail = "Email is required.";
    } else if (!emailRegex.test(fields.guestEmail)) {
      errors.guestEmail = "Email is invalid.";
    }
  
    // Validate Address
    if (!fields.guestAddress?.trim()) {
      errors.guestAddress = "Address is required.";
    }
  
    // Validate Deposit
    if (fields.deposit <= 0) {
      errors.deposit = "Deposit must be greater than 0.";
    }
  
    // Validate Shipping Fee
    if (fields.shippingFee <= 0) {
      errors.shippingFee = "Shipping Fee must be greater than 0.";
    }
  
    return errors;
  };
  