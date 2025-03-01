export const validateCustomer = (customer) => {
  const errors = {};
  
  if (!customer.name) errors.name = 'Name is required';
  if (!customer.mobile) errors.mobile = 'Mobile is required';
  if (!customer.type) errors.type = 'Customer type is required';
  if (customer.panCard && customer.panCard.length !== 10) {
    errors.panCard = 'Invalid PAN card number';
  }
  if (customer.aadhar && customer.aadhar.length !== 12) {
    errors.aadhar = 'Invalid Aadhar number';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateOrder = (order) => {
  const errors = {};

  if (!order.name) errors.name = 'Product name is required';
  if (!order.size) errors.size = 'Size is required';
  if (!order.amount) errors.amount = 'Amount is required';

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
