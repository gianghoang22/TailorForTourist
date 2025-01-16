import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  MenuItem,
  InputAdornment,
  Grid,
  Box,
  Stack,
  Chip,
  TablePagination,
  Card,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { Edit, Visibility, Add, Delete, FilterList, Payment } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { OrderChart } from "./DashboardCharts";
import Autocomplete from "@mui/material/Autocomplete";
import debounce from "lodash/debounce";
import Address from "../../../layouts/components/Address/Address";
import Slider from "@mui/material/Slider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import BankingPayment from '../../../assets/img/elements/bankingPayment.jpg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BASE_URL = "https://vesttour.xyz/api"; // Update this to match your API URL
const BASE_URL = "https://vesttour.xyz/api"; // Update this to match your API URL
const EXCHANGE_API_KEY = '6aa988b722d995b95e483312';

const fetchStoreByStaffId = async (staffId) => {
  const response = await fetch(`${BASE_URL}/Store/GetStoreByStaff/${staffId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch store");
  }
  return response.json();
};

const fetchOrdersByStoreId = async (storeId) => {
  const response = await fetch(`${BASE_URL}/Orders/store/${storeId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
};

// Custom styling for components using `styled`
const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.common.white,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
  },
}));

// Create an axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

const convertVNDToUSD = async (amountInVND) => {
  try {
    const response = await axios.get(`https://v6.exchangerate-api.com/v6/${EXCHANGE_API_KEY}/latest/VND`);
    if (response.status === 200) {
      const usdRate = response.data.conversion_rates.USD;
      const amountInUSD = amountInVND * usdRate;
      return Number(amountInUSD.toFixed(2));
    }
    throw new Error('Failed to fetch exchange rate');
  } catch (error) {
    console.error('Error converting VND to USD:', error);
    // Fallback rate if API fails
    const fallbackRate = 0.00004; // Approximately 1 USD = 25,000 VND
    return Number((amountInVND * fallbackRate).toFixed(2));
  }
};

const fetchUserDetails = async (userId) => {
  try {
    const response = await api.get(`/User/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    return null;
  }
};

const calculateFinalShippingFee = (originalFee, selectedVoucher) => {
  // Nếu không có voucher, trả về phí gốc
  if (!selectedVoucher) return originalFee;
  
  // Kiểm tra xem có phải voucher shipping không (bắt đầu bằng FREESHIP)
  if (selectedVoucher.voucherCode?.substring(0, 8) === 'FREESHIP') {
    const discountAmount = originalFee * selectedVoucher.discountNumber;
    return Math.max(0, originalFee - discountAmount);
  }
  return originalFee;
};

// Add this validation function near the top with other utility functions
const validateShippedDate = (date) => {
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
  
  if (selectedDate < today) {
    return 'Delivery date cannot be in the past';
  }
  return '';
};

// Tạo một utility function để xử lý error messages
const getErrorMessage = (error) => {
  if (!error.response) {
    return 'Network error - Please check your connection';
  }

  const { status, data } = error.response;

  // Xử lý các trường hợp lỗi 400 cụ thể
  if (status === 400) {
    // Kiểm tra message từ API
    if (data?.message) {
      switch (data.message) {
        case 'INVALID_VOUCHER':
          return 'This voucher is not valid or has expired';
        case 'INSUFFICIENT_QUANTITY':
          return 'Some products are out of stock';
        case 'INVALID_MEASUREMENT':
          return 'Please check measurement details';
        case 'INVALID_ADDRESS':
          return 'Please provide a valid delivery address';
        case 'INVALID_PAYMENT':
          return 'Payment information is incorrect';
        default:
          return data.message; // Sử dụng message từ API nếu có
      }
    }
    
    // Xử lý validation errors
    if (data?.errors) {
      const errorMessages = Object.values(data.errors).flat();
      return errorMessages[0] || 'Please check your input';
    }

    return 'Please check your input information';
  }

  // Xử lý các status code khác
  // switch (status) {
  //   case 401:
  //     return 'Your session has expired. Please login again';
  //   case 403:
  //     return 'You do not have permission to perform this action';
  //   case 404:
  //     return 'The requested information could not be found';
  //   case 500:
  //     return 'Something went wrong. Please try again later';
  //   default:
  //     return 'An error occurred. Please try again';
  // }
};

// Cập nhật API interceptor
api.interceptors.response.use(
  response => response,
  error => {
    const errorMessage = getErrorMessage(error);
    
    // Set snackbar message với thông báo thân thiện
    toast.error(errorMessage);

    // Log chi tiết lỗi cho development
    if (process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        status: error.response?.status,
        data: error.response?.data,
        error: error
      });
    }

    return Promise.reject(error);
  }
);

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formState, setFormState] = useState({
    id: "",
    customerName: "",
    status: "pending",
    paymentId: "",
    storeId: "",
    voucherId: "",
    orderDate: "",
    shippedDate: "",
    note: "",
    paid: false,
    totalPrice: "",
  });
  const [orderDetails, setOrderDetails] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [createOrderForm, setCreateOrderForm] = useState({
    storeId: 0,
    voucherId: 0,
    shippedDate: "",
    note: "",
    paid: false,
    guestName: "",
    guestEmail: "",
    guestAddress: "",
    deposit: 0,
    shippingFee: 0,
    deliveryMethod: "",
    products: [],
    customProducts: []
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [stores, setStores] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [nearestStore, setNearestStore] = useState(null);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [productQuantity, setProductQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [fabrics, setFabrics] = useState([]);
  const [linings, setLinings] = useState([]);
  const [styleOptions, setStyleOptions] = useState([]);
  const [openCustomDialog, setOpenCustomDialog] = useState(false);
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [selectedLining, setSelectedLining] = useState(null);
  const [selectedStyleOptions, setSelectedStyleOptions] = useState([]);
  const [customQuantity, setCustomQuantity] = useState(1);
  const [measurementId, setMeasurementId] = useState('');
  const [measurements, setMeasurements] = useState([]);
  const [measurementsWithUserDetails, setMeasurementsWithUserDetails] = useState([]);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: Infinity });
  const [priceRange, setPriceRange] = useState([0, 10000]); // Default range, adjust as needed
  const [customDateRange, setCustomDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 7;
  const [userMeasurements, setUserMeasurements] = useState([]);
  const [measurementIds, setMeasurementIds] = useState([]);
  const [payments, setPayments] = useState({}); 
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false); // State to control the payment dialog
  const [unpaidOrders, setUnpaidOrders] = useState([]);
  const [userId, setUserId] = useState(''); // State để lưu userId
  const [amount, setAmount] = useState(0); // State để lưu amount
  const [createdOrderId, setCreatedOrderId] = useState(''); // State cho createdOrderId
  const [method, setMethod] = useState('Cash'); // Thêm state cho payment method
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]); // Tự động chọn ngày hiện tại
  const [paymentDetails, setPaymentDetails] = useState('Paid full'); // Mặc định là "Paid full"
  const [resetAddress, setResetAddress] = useState(false); // Add this state
  const [validationErrors, setValidationErrors] = useState({
    productQuantity: '',
    customQuantity: '',
    deposit: '',
    amount: '',
    shippedDate: ''
  });
  const [paymentListDialog, setPaymentListDialog] = useState(false);
  const [unpaidDeposits, setUnpaidDeposits] = useState([]);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);
  const [remainingPaymentDialog, setRemainingPaymentDialog] = useState(false);
  const [isDeposit, setIsDeposit] = useState(false);
  const [isLoadingDeposits, setIsLoadingDeposits] = useState(false);
  // Thêm state để theo dõi việc cần refresh data
  const [refreshData, setRefreshData] = useState(false);
  // Thêm state để lưu shipping fee gốc
  const [originalShippingFee, setOriginalShippingFee] = useState(0);

  const handleDateFilterChange = (event) => {
    setDateFilter(event.target.value);
    if (event.target.value !== "custom") {
      setCustomDateRange({ startDate: null, endDate: null });
    }
  };

  const filterOrders = (orders) => {
    const now = new Date();
    return orders.filter((order) => {
      const orderDate = new Date(order.orderDate);
      const totalPrice = order.totalPrice || 0;

      let dateMatch = true;
      switch (dateFilter) {
        case "today":
          dateMatch = orderDate.toDateString() === now.toDateString();
          break;
        case "thisWeek":
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - now.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          dateMatch = orderDate >= startOfWeek && orderDate <= endOfWeek;
          break;
        case "thisMonth":
          dateMatch =
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear();
          break;
        case "lastMonth":
          const lastMonth = new Date(now);
          lastMonth.setMonth(now.getMonth() - 1);
          dateMatch =
            orderDate.getMonth() === lastMonth.getMonth() &&
            orderDate.getFullYear() === lastMonth.getFullYear();
          break;
        case "custom":
          if (customDateRange.startDate && customDateRange.endDate) {
            dateMatch =
              orderDate >= customDateRange.startDate &&
              orderDate <= customDateRange.endDate;
          }
          break;
        default:
          dateMatch = true;
      }

      const priceMatch =
        totalPrice >= priceFilter.min && totalPrice <= priceFilter.max;

      return dateMatch && priceMatch;
    });
  };

  const handlePriceFilterChange = (min, max) => {
    setPriceFilter({ min, max });
  };

  const handlePriceRangeChange = (event, newValue) => {
    setPriceRange(newValue);
    handlePriceFilterChange(newValue[0], newValue[1]);
  };

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await api.get('/Voucher/valid');
        console.log('Valid Vouchers:', response.data);
        setVouchers(response.data);
      } catch (error) {
        console.error('Error fetching vouchers:', error);
        toast.error('Error loading vouchers');
      }
    };

    fetchVouchers();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/Product/products/custom-false');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Error loading products');
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCustomData = async () => {
      try {
        // Fetch fabrics
        const fabricsResponse = await api.get('/Fabrics');
        setFabrics(Array.isArray(fabricsResponse.data) ? fabricsResponse.data : []);
        console.log('Fabrics data:', fabricsResponse.data); // Thêm log để debug
  
        // Fetch linings
        const liningsResponse = await api.get('/linings');
        const liningsData = liningsResponse.data?.data || [];
        console.log('Linings data:', liningsData);
        setLinings(liningsData);
  
        // Fetch style options
        const styleOptionsResponse = await api.get('/StyleOption');
        setStyleOptions(Array.isArray(styleOptionsResponse.data) ? styleOptionsResponse.data : []);
        console.log('Style options data:', styleOptionsResponse.data); // Thêm log để debug
  
      } catch (error) {
        console.error('Error fetching custom data:', error);
        // Đặt giá trị mặc định là mảng rỗng khi có lỗi
        setFabrics([]);
        setLinings([]);
        setStyleOptions([]);
        toast.error('Error loading custom data');
      }
    };
  
    fetchCustomData();
  }, []);

  useEffect(() => {
    const fetchMeasurements = async () => {
      if (selectedUser?.userId) {
        try {
          const response = await api.get(`/Measurement?userId=${selectedUser.userId}`);
          console.log('Fetched Measurements:', response.data);
          setMeasurements(response.data);
          setMeasurementIds(response.data.map(measurement => measurement.measurementId));
          if (response.data.length > 0) {
            setMeasurementId(response.data[0].measurementId);
          }
        } catch (error) {
          console.error('Error fetching measurements:', error);
        }
      } else {
        setMeasurements([]);
        setMeasurementId('');
        setMeasurementIds([]);
      }
    };

    fetchMeasurements();
  }, [selectedUser]);

  const searchUsers = useCallback(
    debounce(async (query) => {
      if (!query) return;
      try {
        const response = await api.get(`/user?roleId=3&search=${query}`);
        console.log('Search Results:', response.data);
        const filteredUsers = response.data.filter(user => user.roleId === 3);
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Error searching users:', error);
        toast.error('Error searching users');
      }
    }, 500),
    []
  );

  const handleUserSelect = async (user) => {
    setSelectedUser(user);
    try {
      const response = await api.get(`/Measurement?userId=${user.userId}`);
      console.log('Fetched Measurements:', response.data);
      setUserMeasurements(response.data);
      setMeasurementId('');

      // Lưu measurementId vào localStorage
      if (response.data.length > 0) {
        const userMeasurementId = response.data[0].measurementId;
        localStorage.setItem('measurementId', userMeasurementId);
      }
    } catch (error) {
      console.error('Error fetching measurements:', error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("userID");
        if (!userId) {
          console.warn("User ID not found");
          setLoading(false);
          return;
        }

        try {
          const storeData = await fetchStoreByStaffId(userId);
          const ordersData = await fetchOrdersByStoreId(storeData.storeId);
          setOrders(Array.isArray(ordersData) ? ordersData : [ordersData]);
        } catch (err) {
          console.error("API Error:", err);
          // Just log the error, don't set error state
        }
        
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [refreshData]);
  }, [refreshData]);

  const fetchUnpaidOrders = async () => {
    try {
      const userId = localStorage.getItem("userID");
      console.log("Retrieved userId from localStorage:", userId);

      if (!userId) {
        throw new Error("User ID not found");
      }
      const storeData = await fetchStoreByStaffId(userId);
      const ordersData = await fetchOrdersByStoreId(storeData.storeId);
      const unpaidOrderData = ordersData.filter(order => order.paid === false);
      setUnpaidOrders(unpaidOrderData);
    } catch (error) {
      console.error('Error fetching unpaid orders:', error);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setOpen(false);
    try {
      if (isEditMode) {
        await api.put(`/Orders/${formState.id}`, formState);
        toast.success("Order updated successfully");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update order");
    }
  };

  const handleEdit = (order) => {
    setFormState(order);
    setIsEditMode(true);
    setOpen(true);
  };

  const handleViewDetails = async (orderId) => {
    try {
        const response = await api.get(`/Orders/${orderId}/details`);
        setOrderDetails(response.data);
        
        // Fetch product details for each order detail
        const productDetailsPromises = response.data.orderDetails.map(async (detail) => {
            const productResponse = await api.get(`/Product/details/${detail.productId}`);
            return {
                ...detail,
                product: productResponse.data
            };
        });

        const orderDetailsWithProducts = await Promise.all(productDetailsPromises);
        setOrderDetails(prev => ({
            ...prev,
            orderDetails: orderDetailsWithProducts
        }));

        setDetailsOpen(true);
    } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Failed to fetch order details");
    }
  };

  const handleCreateOrder = async () => {
    setIsCreatingOrder(true);
    try {
      // Validation checks...

      // Format regular products
      const formattedProducts = selectedProducts.map(product => ({
        productID: product.productID,
        quantity: product.quantity,
        price: product.price
      }));

      // Format custom products
      const formattedCustomProducts = createOrderForm.customProducts.map(product => ({
        fabricID: product.fabricID,
        liningID: product.liningID,
        measurementID: product.measurementID,
        quantity: product.quantity,
        pickedStyleOptions: product.pickedStyleOptions
      }));

      // Calculate totals with voucher discount
      const productTotal = selectedProducts.reduce((sum, product) => 
        sum + (product.price * product.quantity), 0);
      
      const customProductTotal = createOrderForm.customProducts.reduce((sum, product) => 
        sum + (product.price * product.quantity), 0);

      // Calculate total before voucher
      let totalBeforeVoucher = productTotal + customProductTotal;
      console.log('Total before voucher:', totalBeforeVoucher);

      // Apply voucher discount
      let finalTotal = totalBeforeVoucher;
      if (createOrderForm.voucherId) {
        const voucher = vouchers.find(v => v.voucherId === createOrderForm.voucherId);
        console.log('Applied voucher:', voucher);
        
        if (voucher?.voucherCode?.includes('BIGSALE')) {
          const discount = totalBeforeVoucher * voucher.discountNumber;
          finalTotal = totalBeforeVoucher - discount;
          console.log('Total after BIGSALE discount:', finalTotal);
        }
      }

      // Add shipping fee (after voucher discount)
      let finalShippingFee = createOrderForm.shippingFee || 0;
      if (createOrderForm.voucherId) {
        const voucher = vouchers.find(v => v.voucherId === createOrderForm.voucherId);
        if (voucher?.voucherCode?.includes('FREESHIP')) {
          finalShippingFee = 0;
        }
      }
      
      finalTotal += finalShippingFee;
      console.log('Final total with shipping:', finalTotal);

      // Calculate deposit
      const depositAmount = isDeposit ? finalTotal * 0.5 : finalTotal;
      console.log('Deposit amount:', depositAmount);

      const orderPayload = {
        userId: selectedUser?.userId || null,
        storeId: createOrderForm.storeId,
        voucherId: createOrderForm.voucherId || null,
        shippedDate: createOrderForm.shippedDate,
        note: createOrderForm.note || '',
        paid: false,
        guestName: createOrderForm.guestName,
        guestEmail: createOrderForm.guestEmail,
        guestAddress: createOrderForm.guestAddress,
        guestPhone: createOrderForm.guestPhone,
        deposit: depositAmount,
        shippingFee: finalShippingFee,
        deliveryMethod: createOrderForm.deliveryMethod,
        products: formattedProducts,
        customProducts: formattedCustomProducts,
        totalPrice: finalTotal // Sử dụng giá đã được tính với voucher
      };

      console.log('Final order payload:', orderPayload);

      const response = await api.post('/Orders/staffcreateorder', orderPayload);
      const orderId = response.data.orderId;
      
      // Thêm log để kiểm tra
      console.log('New order created with ID:', orderId);
      
      // Đảm bảo orderId là giá trị hợp lệ trước khi lưu
      if (orderId) {
        setCreatedOrderId(orderId);
        localStorage.setItem('orderId', orderId);
        await fetchOrderDetails(orderId);
      } else {
        throw new Error('Invalid order ID received from server');
      }
      
      setAmount(depositAmount);
      setOpenPaymentDialog(true);
      toast.success('Order created successfully');
      setOpen(false);

      // Trigger data refresh
      setRefreshData(prev => !prev);

    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to create order');
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleCreateFormChange = (field, value) => {
    if (field === 'shippedDate') {
      // Nếu không có giá trị được chọn, set mặc định là 4 ngày sau
      if (!value) {
        value = calculateShippedDate();
      }
      
      const dateError = validateShippedDate(value);
      setValidationErrors(prev => ({
        ...prev,
        shippedDate: dateError
      }));
      if (dateError) return;
    }
    
    setCreateOrderForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const findNearestStore = (address) => {
    if (!address || !stores.length) return;

    try {
      // Lọc các store trong cùng district
      const storesInDistrict = stores.filter(store => 
        store.districtID === parseInt(address.districtId)
      );

      // Nếu có store trong district, hiển thị chúng đầu tiên
      if (storesInDistrict.length > 0) {
        setStores([...storesInDistrict, ...stores.filter(store => 
          !storesInDistrict.includes(store)
        )]);
      }

      // Chỉ reset nearestStore nếu chưa có store nào được chọn
      if (!nearestStore) {
        setNearestStore(null);
        setCreateOrderForm(prev => ({
          ...prev,
          storeId: 0
        }));
      }

    } catch (error) {
      console.error('Error processing stores:', error);
    }
  };

  // Sửa lại hàm calculateShippingFee
  const calculateShippingFee = async (addressData) => {
    console.log('Calculating Shipping Fee with data:', addressData);
    
    if (!addressData?.wardCode || !addressData?.districtId || !nearestStore) {
      console.log('Missing required data');
      const defaultFee = 2;
      setOriginalShippingFee(defaultFee);
      setCreateOrderForm(prev => ({
        ...prev,
        shippingFee: defaultFee
      }));
      return;
    }

    try {
      const shippingPayload = {
        serviceId: 0,
        insuranceValue: 0,
        coupon: "",
        toWardCode: addressData.wardCode,
        toDistrictId: parseInt(addressData.districtId),
        fromDistrictId: nearestStore.districtID,
        weight: 0,
        length: 0,
        width: 0,
        height: 0,
        shopCode: nearestStore.storeCode
      };

      console.log('Shipping Fee Payload:', shippingPayload);

      const response = await axios.post(
        'https://vesttour.xyz/api/Shipping/calculate-fee',
        'https://vesttour.xyz/api/Shipping/calculate-fee',
        shippingPayload
      );

      if (response.data) {
        console.log('Shipping Fee Response (VND):', response.data.total);
        const shippingFeeVND = response.data.total || 0;
        const shippingFeeUSD = await convertVNDToUSD(shippingFeeVND);
        console.log('Shipping Fee (USD):', shippingFeeUSD);
        
        // Lưu shipping fee gốc
        setOriginalShippingFee(shippingFeeUSD);
        
        // Áp dụng giảm giá nếu có voucher FREESHIP
        const currentVoucher = vouchers.find(v => v.voucherId === createOrderForm.voucherId);
        let finalShippingFee = shippingFeeUSD;
        
        if (currentVoucher?.voucherCode?.includes('FREESHIP')) {
          const shippingDiscount = shippingFeeUSD * currentVoucher.discountNumber;
          finalShippingFee = Math.max(0, shippingFeeUSD - shippingDiscount);
        }

        setCreateOrderForm(prev => ({
          ...prev,
          shippingFee: finalShippingFee
        }));
      }
    } catch (error) {
      console.error('Error calculating shipping fee:', error);
      const defaultFee = 2;
      setOriginalShippingFee(defaultFee);
      setCreateOrderForm(prev => ({
        ...prev,
        shippingFee: defaultFee
      }));
    }
  };

  useEffect(() => {
    if (createOrderForm.deliveryMethod === 'Delivery' && 
        createOrderForm.guestAddress && 
        nearestStore) {
      const addressData = {
        wardCode: document.querySelector('input[name="wardCode"]')?.value,
        districtId: document.querySelector('input[name="districtId"]')?.value,
      };
      if (addressData.wardCode && addressData.districtId) {
        calculateShippingFee(addressData);
      }
    }
  }, [createOrderForm.deliveryMethod, createOrderForm.guestAddress, nearestStore]);

  const handleAddProduct = () => {
    try {
      if (selectedProduct && productQuantity > 0) {
        // Log selected product để kiểm tra
        console.log('Selected Product:', selectedProduct);
        
        const newProduct = {
          productID: selectedProduct.productID,
          productCode: selectedProduct.productCode,
          quantity: productQuantity,
          price: selectedProduct.price || 0
        };
        
        // Log new product để kiểm tra
        console.log('New Product:', newProduct);
        
        setSelectedProducts([...selectedProducts, newProduct]);
        setCreateOrderForm(prev => ({
          ...prev,
          products: [...prev.products, newProduct]
        }));
        
        // Reset form
        setSelectedProduct(null);
        setProductQuantity(1);
        setOpenProductDialog(false);
      } else {
        throw new Error("Please select a product and enter a valid quantity."); // Bắt lỗi nếu không có sản phẩm hoặc số lượng không hợp lệ
      }
    } catch (error) {
      console.error('Error adding product:', error.message); // Log lỗi ra console
      // Có thể hiển thị thông báo lỗi cho người dùng nếu cần
      toast.error(error.message);
    }
  };

  const calculateCustomProductPrice = (fabricId, styleOptions, measurementDetails) => {
    // Lấy giá vải
    const fabric = fabrics.find(f => f.fabricID === fabricId);
    let basePrice = fabric ? fabric.price : 0;

    // Cộng thêm giá của các style options (nếu có)
    const optionsPrice = styleOptions.reduce((sum, option) => {
      const styleOption = styleOptions.find(so => so.styleOptionId === option.styleOptionID);
      return sum + (styleOption?.additionalPrice || 0);
    }, 0);

    // Tính phí phụ thu dựa trên measurement
    let additionalCharge = 0;
    if (measurementDetails) {
      if (measurementDetails.height > 190 || measurementDetails.weight > 100) {
        additionalCharge = 20;
      } else if (measurementDetails.height > 180 && measurementDetails.height <= 190 || 
                measurementDetails.weight > 85 && measurementDetails.weight <= 100) {
        additionalCharge = 10;
      }
    }

    // Tổng giá = giá vải + giá options + phí phụ thu size
    const totalPrice = basePrice + optionsPrice + additionalCharge;

    return {
      price: totalPrice,
      additionalCharges: {
        sizeCharge: additionalCharge
      }
    };
  };

  const handleAddCustomProduct = async () => {
    try {
      // Validation
      if (!selectedFabric) {
        throw new Error('Please select a fabric');
      }
      if (!selectedLining) {
        throw new Error('Please select a lining');
      }
      if (selectedStyleOptions.length === 0) {
        throw new Error('Please select at least one style option');
      }
      if (!measurementId) {
        throw new Error('Please select a measurement');
      }
      if (customQuantity < 1) {
        throw new Error('Quantity must be greater than 0');
      }

      // Fetch measurement details
      const measurementResponse = await api.get(`/Measurement/${measurementId}`);
      const measurementDetails = measurementResponse.data;

      // Tính giá cho custom product
      const priceDetails = calculateCustomProductPrice(
        selectedFabric.fabricID, 
        selectedStyleOptions,
        measurementDetails
      );

      // Create new custom product - remove note generation
      const newCustomProduct = {
        productCode: `CUSTOM-${Date.now()}`,
        categoryID: 5,
        fabricID: selectedFabric.fabricID,
        liningID: selectedLining.liningId,
        measurementID: parseInt(measurementId),
        quantity: customQuantity,
        price: priceDetails.price,
        pickedStyleOptions: selectedStyleOptions.map(option => ({
          styleOptionID: option.styleOptionId,
        }))
      };

      // Update form state without modifying the note
      setCreateOrderForm(prev => ({
        ...prev,
        customProducts: [...prev.customProducts, newCustomProduct]
      }));

      // Reset selections
      setSelectedFabric(null);
      setSelectedLining(null);
      setSelectedStyleOptions([]);
      setCustomQuantity(1);
      setOpenCustomDialog(false);

      // Show success message

    } catch (error) {
      console.error('Error adding custom product:', error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await api.get('/Store');
        // Filter out stores with status "Deactive"
        const activeStores = response.data.filter(store => store.status !== 'Deactive');
        setStores(activeStores);
        console.log('Active Stores fetched:', activeStores);
      } catch (error) {
        console.error('Error fetching stores:', error);
        toast.error('Error loading stores');
      }
    };

    fetchStores();
  }, []);

  const sortedOrders = [...orders].sort((a, b) => b.orderId - a.orderId);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/User');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbarMessage('Error fetching users');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/Payments');
      console.log('Payments Data:', response.data);
      const paymentsData = response.data;

      // Create a mapping of orderId to full payment object
      const paymentMap = {};
      paymentsData.forEach(payment => {
        paymentMap[payment.orderId] = payment;
      });

      console.log('Payment Map:', paymentMap);
      setPayments(paymentMap);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  // Call fetchPayments in useEffect
  useEffect(() => {
    fetchPayments();
  }, []);

  // Function to handle payment form submission
  const handlePaymentSubmit = async (event) => {
    event.preventDefault();
    console.log('handlePaymentSubmit called'); // Debug log 1

    try {
      const paymentPayload = {
        orderId: createdOrderId,
        userId: userId,
        method: method,
        paymentDate: paymentDate,
        paymentDetails: paymentDetails,
        amount: amount,
        status: "Success"
      };

      console.log('Payment Payload:', paymentPayload); // Debug log 2

      // Kiểm tra token
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debug log 3

      // Gọi API với async/await
      const response = await axios.post(
        'https://vesttour.xyz/api/Payments', 
        'https://vesttour.xyz/api/Payments', 
        paymentPayload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Payment Response:', response.data); // Debug log 4

      if (response.data) {
        // Cập nhật trạng thái paid của order
        await axios.put(
          `https://vesttour.xyz/api/Orders/SetPaidTrue/${createdOrderId}`,
          `https://vesttour.xyz/api/Orders/SetPaidTrue/${createdOrderId}`,
          null,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        await fetchPayments();

        setRefreshData(prev => !prev);

        setOpenPaymentDialog(false);
        toast.success('Payment created successfully');
        setRefreshData(prev => !prev);
      }
    } catch (error) {
      console.error('Payment Error:', error); // Debug log 5
      toast.error(error.response?.data?.message || 'Failed to create payment');
    }
  };

  // Call fetchUnpaidOrders in useEffect to load unpaid orders on component mount
  useEffect(() => {
    fetchUnpaidOrders();
  }, []);

  const fetchOrderDetails = async (orderId) => {
    try {
      // Validate orderId
      if (!orderId || isNaN(orderId)) {
        throw new Error('Invalid order ID');
      }

      const response = await api.get(`/Orders/${orderId}`);
      console.log('Order Details Response:', response.data);
      
      if (!response.data) {
        throw new Error('Order not found');
      }

      const orderData = response.data;

      if (orderData.userID) {
        setUserId(orderData.userID);
      } else {
        toast.error('userId not found in order data');
      }

      const totalAmount = orderData.totalPrice + (orderData.shippingFee || 0);
      setAmount(totalAmount);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast.error('Failed to fetch order details');
      
      // Clear invalid orderId from localStorage
      localStorage.removeItem('orderId');
    }
  };

  useEffect(() => {
    const orderId = localStorage.getItem('orderId');
    console.log('Retrieved orderId from localStorage:', orderId); // Kiểm tra giá trị
    if (orderId) {
        setCreatedOrderId(orderId);
        fetchOrderDetails(orderId); // Gọi hàm để lấy thông tin đơn hàng
    }
  }, []);

  const handleStoreSelect = (store) => {
    setNearestStore(store);
    setStoreId(store.storeId);
    setGuestAddress(''); // Clear the address when store changes
    setResetAddress(true); // Set resetAddress to true
    console.log("Updated storeId:", store.storeId);
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value < 1) {
      setValidationErrors(prev => ({
        ...prev,
        productQuantity: 'Quantity must be greater than 0'
      }));
      setProductQuantity(1);
    } else {
      setValidationErrors(prev => ({
        ...prev,
        productQuantity: ''
      }));
      setProductQuantity(value);
    }
  };

  const handleCustomQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value < 1) {
      setValidationErrors(prev => ({
        ...prev,
        customQuantity: 'Quantity must be greater than 0'
      }));
      setCustomQuantity(1);
    } else {
      setValidationErrors(prev => ({
        ...prev,
        customQuantity: ''
      }));
      setCustomQuantity(value);
    }
  };

  const handleDepositChange = (e) => {
    // Convert to number and ensure it's not negative
    const value = Math.max(0, parseFloat(e.target.value) || 0);
    
    if (value < 0) {
      setValidationErrors(prev => ({
        ...prev,
        deposit: 'Deposit cannot be negative'
      }));
    } else {
      setValidationErrors(prev => ({
        ...prev,
        deposit: ''
      }));
    }
    
    handleCreateFormChange('deposit', value);
  };

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    if (value < 0) {
      setValidationErrors(prev => ({
        ...prev,
        amount: 'Amount cannot be negative'
      }));
      setAmount(0);
    } else {
      setValidationErrors(prev => ({
        ...prev,
        amount: ''
      }));
      setAmount(value);
    }
  };

  // Thêm validation cho payment date
  const validatePaymentDate = (date) => {
    if (!date) {
      return 'Payment date is required';
    }
    return '';
  };

  const fetchUnpaidDeposits = async () => {
    setIsLoadingDeposits(true);
    try {
      const response = await api.get('/Payments');
      const paymentsData = response.data;
      
      // Debug logs
      console.log('All Orders:', orders);
      console.log('All Payments:', paymentsData);
      
      const depositsNeededPayment = orders.filter(order => {
        // Tìm tất cả payments cho order này
        const orderPayments = paymentsData.filter(p => p.orderId === order.orderId);
        
        // Kiểm tra xem có payment nào là "Paid remaining balance" không
        const hasRemainingPayment = orderPayments.some(p => 
          p.paymentDetails === "Paid remaining balance"
        );

        // Kiểm tra xem có payment deposit 50% không
        const hasDepositPayment = orderPayments.some(p => 
          p.paymentDetails === "Make deposit 50%"
        );

        console.log(`Checking order ${order.orderId}:`, {
          hasDepositPayment,
          hasRemainingPayment,
          balancePayment: order.balancePayment,
          isEligible: hasDepositPayment && !hasRemainingPayment && order.balancePayment > 0
        });

        // Chỉ trả về true nếu:
        // 1. Có payment deposit 50%
        // 2. Chưa có payment remaining balance
        // 3. Còn số tiền cần thanh toán
        return hasDepositPayment && !hasRemainingPayment && order.balancePayment > 0;
      });

      console.log('Filtered Orders for Payment:', depositsNeededPayment);
      setUnpaidDeposits(depositsNeededPayment);
    } catch (error) {
      console.error('Error fetching unpaid deposits:', error);
      toast.error('Error loading unpaid deposits');
    } finally {
      setIsLoadingDeposits(false);
    }
  };

  // Thêm hàm handleCreatePayment
  const handleCreatePayment = async (order) => {
    try {
      const remainingAmount = order.totalPrice - order.deposit;

      const paymentPayload = {
        orderId: order.orderId,
        userId: order.userId,
        method: method,
        paymentDate: new Date().toISOString().split('T')[0],
        paymentDetails: "Paid remaining balance",
        status: "Success",
        amount: remainingAmount
      };

      console.log('Payment Payload:', paymentPayload);

      // Gọi API tạo payment
      const response = await api.post('/Payments', paymentPayload);
      console.log('Payment created:', response.data);

      // Cập nhật trạng thái paid của order
      await api.put(`/Orders/SetPaidTrue/${order.orderId}`);

      // Cập nhật shipStatus thành Finished
      try {
        const updateStatusResponse = await fetch(`${BASE_URL}/Orders/update-ship-status/${order.orderId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify("Finished")
        });

        if (!updateStatusResponse.ok) {
          console.error('Failed to update ship status');
        }
      } catch (error) {
        console.error('Error updating ship status:', error);
      }

      // Refresh data and states
      setRefreshData(prev => !prev);
      await fetchPayments();
      await fetchUnpaidDeposits(); // Refresh unpaid deposits list
      setSelectedOrderForPayment(null); // Reset selected order

      // Show success message
      toast.success('Payment processed successfully');

      // Close dialogs
      setRemainingPaymentDialog(false);
      setPaymentListDialog(false);

    } catch (error) {
      console.error('Error creating payment:', error);
      toast.error('Failed to process payment');
    }
  };

  // Thêm hàm reset form
  const resetForm = () => {
    setFormState({
      id: "",
      customerName: "",
      status: "pending",
      paymentId: "",
      storeId: "",
      voucherId: "",
      orderDate: "",
      shippedDate: "",
      note: "",
      paid: false,
      totalPrice: 0,
    });
    
    // Reset các state khác
    setSelectedUser(null);
    setCreateOrderForm({
      guestName: "",
      guestEmail: "",
      guestAddress: "",
      guestPhone: "",
      storeId: "",
      voucherId: null,
      shippedDate: "",
      note: "",
      deliveryMethod: "Pick up",
      shippingFee: 0,
      products: [],
      customProducts: [],
      totalPrice: 0,
    });
    setSelectedProducts([]);
    setMethod("Cash");
    setPaymentDetails("Paid full");
    setIsDeposit(false);
    setSelectedFabric(null);
    setSelectedLining(null);
    setSelectedStyleOptions([]);
    setCustomQuantity(1);
    setProductQuantity(1);
    setSelectedProduct(null);
    setNearestStore(null);
    setValidationErrors({});
    setMeasurementId(null);
  };

  // Thêm xử lý đóng dialog
  const handleCloseDialog = () => {
    resetForm();
    setOpen(false);
  };

  // Sửa lại hàm calculateTotalAmount
  const calculateTotalAmount = () => {
    const productTotal = selectedProducts.reduce((sum, product) => 
      sum + (product.price * product.quantity), 0);

    const customProductTotal = createOrderForm.customProducts.reduce((sum, product) => 
      sum + (product.price * product.quantity), 0);

    let totalBeforeVoucher = productTotal + customProductTotal;
    let finalTotal = totalBeforeVoucher;

    if (createOrderForm.voucherId) {
      const voucher = vouchers.find(v => v.voucherId === createOrderForm.voucherId);
      
      if (voucher && voucher.voucherCode?.includes('BIGSALE')) {
        const discount = totalBeforeVoucher * voucher.discountNumber;
        finalTotal = totalBeforeVoucher - discount;
      }
    }

    // Cộng shipping fee đã được tính toán từ trước
    finalTotal += createOrderForm.shippingFee || 0;

    return finalTotal;
  };

  // Sửa lại hàm handleVoucherChange
  const handleVoucherChange = async (_, newValue) => {
    try {
      if (!newValue) {
        // Reset voucher và shipping fee về giá trị gốc
        setCreateOrderForm(prev => ({
          ...prev,
          voucherId: null,
          shippingFee: originalShippingFee
        }));
        return;
      }

      // Validate voucher status
      if (newValue.status !== "OnGoing") {
        toast.warning('This voucher is no longer valid');
        return;
      }

      // Cập nhật voucherId trong form
      setCreateOrderForm(prev => ({
        ...prev,
        voucherId: newValue.voucherId
      }));

      // Nếu là voucher FREESHIP, cập nhật shipping fee
      if (newValue.voucherCode?.includes('FREESHIP')) {
        const discountedShippingFee = originalShippingFee * (1 - newValue.discountNumber);
        setCreateOrderForm(prev => ({
          ...prev,
          shippingFee: Math.max(0, discountedShippingFee)
        }));
      }

      toast.success('Voucher applied successfully');

    } catch (error) {
      console.error('Error applying voucher:', error);
      toast.error('Unable to apply voucher');
    }
  };

  // First, add this new function to group style options by type
  const groupedStyleOptions = useMemo(() => {
    return styleOptions.reduce((acc, option) => {
      if (!acc[option.optionType]) {
        acc[option.optionType] = [];
      }
      acc[option.optionType].push(option);
      return acc;
    }, {});
  }, [styleOptions]);

  const handleDeliveryMethodChange = (event) => {
    const newMethod = event.target.value;
    
    // Reset shipping fee và address khi chuyển sang pick up
    if (newMethod === 'Pick up') {
      // Check if current voucher is FREESHIP
      const currentVoucher = vouchers.find(v => v.voucherId === createOrderForm.voucherId);
      const shouldClearVoucher = currentVoucher?.voucherCode?.includes('FREESHIP');

      setCreateOrderForm(prev => ({
        ...prev,
        deliveryMethod: newMethod,
        shippingFee: 0, // Reset shipping fee về 0
        guestAddress: '', // Xóa địa chỉ
        voucherId: shouldClearVoucher ? null : prev.voucherId // Clear FREESHIP voucher if present
      }));
      setOriginalShippingFee(0); // Reset original shipping fee
      setResetAddress(true); // Reset address component
    } else {
      setCreateOrderForm(prev => ({
        ...prev,
        deliveryMethod: newMethod,
      }));
      setResetAddress(false);
    }
  };

  // Thêm hàm để tính ngày giao hàng (4 ngày sau)
  const calculateShippedDate = () => {
    const today = new Date();
    const shippedDate = new Date(today);
    shippedDate.setDate(today.getDate() + 4);
    return shippedDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
  };

  // Sửa lại useEffect khi mở form tạo order mới
  useEffect(() => {
    if (open) {
      setCreateOrderForm(prev => ({
        ...prev,
        shippedDate: calculateShippedDate()
      }));
    }
  }, [open]);

  // Modify the remaining payment dialog to refresh on open
  const handleOpenRemainingPaymentDialog = async () => {
    console.log('Opening payment dialog');
    setIsLoadingDeposits(true);
    try {
      await fetchUnpaidDeposits();
      setRemainingPaymentDialog(true);
    } catch (error) {
      console.error('Error loading unpaid deposits:', error);
      toast.error('Error loading unpaid deposits');
    } finally {
      setIsLoadingDeposits(false);
    }
  };

  // Replace loading and error checks with just loading
  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Order Management
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Typography variant="h4" sx={{ mb: 2 }}>
        Order Management
      </Typography>

      {/* Hiển thị thông báo nếu không có dữ liệu */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Hiển thị các nút để tạo order hoặc payment */}
      <StyledButton
        variant="contained"
        startIcon={<Add />}
        onClick={handleAddOrder}
        sx={{ mb: 2 }}
      >
        Add Order
      </StyledButton>

      <StyledButton
        variant="contained"
        startIcon={<Payment />}
        onClick={handleOpenRemainingPaymentDialog}
        sx={{ mb: 2, ml: 2 }}
      >
        Process Payment
      </StyledButton>

      {/* Hiển thị bảng ngay cả khi không có dữ liệu */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>Order ID</StyledTableCell>
              <StyledTableCell>Customer</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Payment Method</StyledTableCell>
              <StyledTableCell>Payment Details</StyledTableCell>
              <StyledTableCell>Order Date</StyledTableCell>
              <StyledTableCell>Total Price</StyledTableCell>
              <StyledTableCell>Balance Payment</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filterOrders(currentOrders).length > 0 ? (
              filterOrders(currentOrders).map((order) => (
                <TableRow key={order.orderId} hover>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>{order.guestName}</TableCell>
                  <TableCell>{order.status || 'Pending'}</TableCell>
                  <TableCell>
                    {payments[order.orderId]?.method}
                  </TableCell>
                  <TableCell>{payments[order.orderId]?.paymentDetails}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>{order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}$</TableCell>
                  <TableCell>
                    {order.balancePayment ? (
                      <Typography
                        color={order.balancePayment > 0 ? "error" : "success"}
                        fontWeight="bold"
                      >
                        ${order.balancePayment.toFixed(2)}
                      </Typography>
                    ) : (
                      "$0.00"
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="View Details">
                      <IconButton onClick={() => handleViewDetails(order.orderId)} sx={{ color: "primary.main" }}>
                        <Visibility />
                      </IconButton>
                    </Tooltip>
                    {/* {order.balancePayment > 0 && (
                      <Tooltip title="Process Payment">
                        <IconButton 
                          onClick={() => handleCreatePayment(order)}
                          color="primary"
                        >
                          <Payment />
                        </IconButton>
                      </Tooltip>
                    )} */}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography variant="subtitle1" sx={{ py: 3 }}>
                    No orders found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Only show pagination if there are orders */}
      {sortedOrders.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          {Array.from({ length: Math.ceil(sortedOrders.length / ordersPerPage) }, (_, index) => (
            <Button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              variant={currentPage === index + 1 ? 'contained' : 'outlined'}
              sx={{ mx: 0.5 }}
            >
              {index + 1}
            </Button>
          ))}
        </Box>
      )}

      {/* Dialog for Order Details */}
      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          {orderDetails ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">Order ID: {orderDetails.orderId}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1"><strong>Customer:</strong> {orderDetails.guestName}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1"><strong>Status:</strong> {orderDetails.status || 'Pending'}</Typography>
              </Grid>
              {/* <Grid item xs={12}>
                <Typography variant="subtitle1"><strong>Payment ID:</strong> {orderDetails.paymentId || ""}</Typography>
              </Grid> */}
              <Grid item xs={12}>
                <Typography variant="subtitle1"><strong>Order Date:</strong> {new Date(orderDetails.orderDate).toLocaleDateString()}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1"><strong>Total Price:</strong> ${orderDetails.totalPrice.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1"><strong>Note:</strong> {orderDetails.note || ""}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2 }}>Order Details:</Typography>
                {orderDetails.orderDetails.map((detail, index) => (
                  <Card key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
                    <Typography variant="subtitle1"><strong>Product ID:</strong> {detail.productId}</Typography>
                    <Typography variant="body2"><strong>Quantity:</strong> {detail.quantity}</Typography>
                    <Typography variant="body2"><strong>Price:</strong> ${detail.price}</Typography>
                    {detail.product ? (
                      <>
                        <Typography variant="body2">
                          <strong>Fabric:</strong> {detail.product.fabricName}, <strong>Lining:</strong> {detail.product.liningName}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Style Options:</strong> {detail.product.styleOptions.map(option => option.optionValue).join(', ')}
                        </Typography>
                      </>
                    ) : (
                      <Typography color="error">Product details not available</Typography>
                    )}
                  </Card>
                ))}
              </Grid>
            </Grid>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Order Dialog */}
      <Dialog 
        open={open && !isEditMode} 
        onClose={handleCloseDialog}
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>Create New Order</DialogTitle>
        <DialogContent>
          {isCreatingOrder ? (
            <CircularProgress />
          ) : (
            <>
              <Autocomplete
                options={users.filter(user => user.roleId === 3)}
                getOptionLabel={(option) => 
                  option ? `${option.name || ''} (${option.email || ''})` : ''
                }
                onInputChange={(_, newValue) => {
                  console.log('Searching for:', newValue);
                  searchUsers(newValue);
                }}
                onChange={(_, newValue) => {
                  console.log('Selected user:', newValue);
                  setSelectedUser(newValue);
                  if (newValue) {
                    setCreateOrderForm(prev => ({
                      ...prev,
                      guestName: newValue.name || '',
                      guestEmail: newValue.email || '',
                      guestAddress: newValue.address || ''
                    }));
                    fetchUserMeasurements(newValue);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Customers"
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    helperText="Search for customers by name or email"
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...restProps } = props;
                  return (
                    <li key={key} {...restProps}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body1">{option.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {option.email}
                        </Typography>
                      </div>
                    </li>
                  );
                }}
                loading={users.length === 0}
                loadingText="Searching..."
                noOptionsText="No customers found"
                clearOnBlur={false}
                clearOnEscape
              />
              
              <TextField
                label="Guest Name"
                value={createOrderForm.guestName}
                onChange={(e) => handleCreateFormChange('guestName', e.target.value)}
                disabled={selectedUser !== null}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Guest Email"
                value={createOrderForm.guestEmail}
                onChange={(e) => handleCreateFormChange('guestEmail', e.target.value)}
                disabled={selectedUser !== null}
                fullWidth
                margin="normal"
              />
              {/* <TextField
                label="Guest Address"
                value={createOrderForm.guestAddress}
                onChange={(e) => handleCreateFormChange('guestAddress', e.target.value)}
                fullWidth
                margin="normal"
              /> */}
              {/* <Autocomplete
                options={stores}
                getOptionLabel={(option) => option.name || ''}
                value={stores.find(store => store.storeId === createOrderForm.storeId) || null}
                onChange={(_, newValue) => {
                  handleCreateFormChange('storeId', newValue ? newValue.storeId : 0);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Store"
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    helperText="Select a store from the list"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body1">{option.name}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {option.address}
                      </Typography>
                    </div>
                  </li>
                )}
                isOptionEqualToValue={(option, value) => option.storeId === value.storeId}
                loading={stores.length === 0}
                loadingText="Loading stores..."
                noOptionsText="No stores found"
              /> */}
             
              {/* <TextField
                label="Shipper Partner ID"
                type="number"
                value={createOrderForm.shipperPartnerId || ''}
                onChange={(e) => handleCreateFormChange('shipperPartnerId', e.target.value ? parseInt(e.target.value) : null)}
                fullWidth
                margin="normal"
              /> */}
              <TextField
                select
                label="Delivery Method"
                value={createOrderForm.deliveryMethod}
                onChange={handleDeliveryMethodChange}
                fullWidth
                margin="normal"
              >
                <MenuItem value="Pick up">Pick up</MenuItem>
                <MenuItem value="Delivery">Delivery</MenuItem>
              </TextField>

              {createOrderForm.deliveryMethod === 'Delivery' && (
                <>
                  <Autocomplete
                    options={stores}
                    getOptionLabel={(option) => option.name || ''}
                    value={nearestStore || null}
                    onChange={(_, newValue) => {
                      setNearestStore(newValue);
                      setCreateOrderForm(prev => ({
                        ...prev,
                        storeId: newValue ? newValue.storeId : 0
                      }));
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Nearest Store"
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        helperText="Select the nearest store"
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body1">{option.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {option.address}
                          </Typography>
                        </div>
                      </li>
                    )}
                    isOptionEqualToValue={(option, value) => option.storeId === value.storeId}
                    loading={stores.length === 0}
                    loadingText="Loading stores..."
                    noOptionsText="No stores found"
                  />

                  {nearestStore && (
                    <Paper sx={{ p: 2, mt: 2, mb: 2, bgcolor: 'background.default' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Selected Store:
                      </Typography>
                      <Typography><strong>{nearestStore.name}</strong></Typography>
                      <Typography>{nearestStore.address}</Typography>
                    </Paper>
                  )}

                  <Address
                    onAddressChange={async (address) => {
                      console.log('Address changed:', address);
                      setCreateOrderForm(prev => ({
                        ...prev,
                        guestAddress: address.fullAddress
                      }));
                      
                      findNearestStore(address);

                      if (address.wardCode && address.districtId && nearestStore) {
                        await calculateShippingFee({
                          wardCode: address.wardCode,
                          districtId: address.districtId
                        });
                      }
                    }}
                  />
                  
                  <TextField
                    label="Shipping Fee"
                    type="number"
                    value={createOrderForm.shippingFee || 0}
                    disabled
                    fullWidth
                    margin="normal"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                </>
              )}

              {createOrderForm.deliveryMethod === 'Pick up' && (
                <Autocomplete
                  options={stores}
                  getOptionLabel={(option) => option.name || ''}
                  value={nearestStore || null}
                  onChange={(_, newValue) => {
                    setNearestStore(newValue);
                    setCreateOrderForm(prev => ({
                      ...prev,
                      storeId: newValue ? newValue.storeId : 0
                    }));
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Nearest Store"
                      margin="normal"
                      variant="outlined"
                      fullWidth
                      helperText="Select the nearest store"
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body1">{option.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {option.address}
                        </Typography>
                      </div>
                    </li>
                  )}
                  isOptionEqualToValue={(option, value) => option.storeId === value.storeId}
                  loading={stores.length === 0}
                  loadingText="Loading stores..."
                  noOptionsText="No stores found"
                />
              )}
              <TextField
                label="Expected delivery date"
                type="date"
                value={createOrderForm.shippedDate}
                onChange={(e) => handleCreateFormChange('shippedDate', e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                error={!!validationErrors.shippedDate}
                helperText={validationErrors.shippedDate}
                required
                inputProps={{
                  min: new Date().toISOString().split('T')[0] // Set minimum date to today
                }}
              />
              <TextField
                label="Note"
                value={createOrderForm.note}
                onChange={(e) => handleCreateFormChange('note', e.target.value)}
                fullWidth
                margin="normal"
                multiline
                rows={2}
              />
              {/* Chỉ hiển thị checkbox deposit khi KHÔNG phải Home delivery */}
              {createOrderForm.deliveryMethod !== 'Delivery' && (
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isDeposit}
                        onChange={(e) => {
                          setIsDeposit(e.target.checked);
                          // Cập nhật paymentDetails dựa trên trạng thái checkbox
                          setPaymentDetails(e.target.checked ? "Make deposit 50%" : "Paid full");
                        }}
                      />
                    }
                    label="Pay 50% Deposit"
                    sx={{ mt: 2, mb: 1 }}
                  />

                  {/* Hiển thị số tiền deposit (chỉ để xem) */}
                  {/* <TextField
                    label="Deposit Amount"
                    value={createOrderForm.deposit || 0}
                    disabled
                    fullWidth
                    margin="normal"
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  /> */}
                </>
              )}

              {/* You might want to add more complex inputs for products and customProducts arrays */}
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenProductDialog(true)}
                startIcon={<Add />}
                sx={{ mt: 2, mb: 2 }}
              >
                Add Products
              </Button>

              {selectedProducts.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product Code</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Details</TableCell>
                        <TableCell>Note</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Regular Products */}
                      {selectedProducts.map((product, index) => (
                        <TableRow key={`regular-${index}`}>
                          <TableCell>{product.productCode}</TableCell>
                          <TableCell>Regular</TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.note}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>${product.price * product.quantity}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleRemoveProduct(index)}>
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Custom Products */}
                      {createOrderForm.customProducts.map((product, index) => {
                        const fabric = fabrics.find(f => f.fabricID === product.fabricID);
                        return (
                          <TableRow key={`custom-${index}`}>
                            <TableCell>{product.productCode}</TableCell>
                            <TableCell>Custom</TableCell>
                            <TableCell>
                              <div>
                                <strong>Fabric:</strong> {fabric?.fabricName}<br />
                                <strong>Style Options:</strong><br />
                                {product.pickedStyleOptions.map((option, i) => (
                                  <span key={i}>
                                    {styleOptions.find(so => so.styleOptionId === option.styleOptionID)?.optionValue}<br />
                                  </span>
                                ))}
                                {product.note && (
                                  <>
                                    <br />
                                    <strong>Note:</strong> {product.note}
                                  </>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{product.note}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>${product.price}</TableCell>
                            <TableCell>${product.price * product.quantity}</TableCell>
                            <TableCell>
                              <IconButton onClick={() => handleRemoveCustomProduct(index)}>
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Dialog để thêm sản phẩm */}
              <Dialog 
                open={openProductDialog} 
                onClose={() => setOpenProductDialog(false)}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle>Add Product</DialogTitle>
                <DialogContent>
                  <Autocomplete
                    options={products}
                    getOptionLabel={(option) => 
                      option ? `${option.productCode} - $${option.price}` : ''
                    }
                    value={selectedProduct}
                    onChange={(_, newValue) => {
                      console.log('Selected Product:', newValue);
                      setSelectedProduct(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Product"
                        margin="normal"
                        fullWidth
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <Typography variant="body1">
                            {option.productCode} - ${option.price}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {option.productName}
                          </Typography>
                        </div>
                      </li>
                    )}
                    isOptionEqualToValue={(option, value) => 
                      option.productID === value?.productID
                    }
                  />
                  
                  <TextField
                    label="Quantity"
                    type="number"
                    value={productQuantity}
                    onChange={handleQuantityChange}
                    fullWidth
                    margin="normal"
                    error={!!validationErrors.productQuantity}
                    helperText={validationErrors.productQuantity}
                    InputProps={{
                      inputProps: { min: 1 }
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenProductDialog(false)}>Cancel</Button>
                  <Button onClick={handleAddProduct} color="primary" variant="contained">
                    Add
                  </Button>
                </DialogActions>
              </Dialog>

              <Button
                variant="contained"
                color="secondary"
                onClick={() => setOpenCustomDialog(true)}
                startIcon={<Add />}
                sx={{ mt: 2, mb: 2, ml: 2 }}
              >
                Add Custom Product
              </Button>

              
              {createOrderForm.customProducts.length > 0 && (
                <TableContainer component={Paper} sx={{ mt: 2, mb: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Product Code</TableCell>
                        <TableCell>Fabric</TableCell>
                        <TableCell>Lining</TableCell>
                        <TableCell>Style Options</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {createOrderForm.customProducts.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.productCode}</TableCell>
                          <TableCell>
                            {fabrics.find(f => f.fabricID === product.fabricID)?.fabricName}
                          </TableCell>
                          <TableCell>
                            {linings.find(l => l.liningId === product.liningID)?.liningName}
                          </TableCell>
                          <TableCell>
                            {product.pickedStyleOptions.map(style => 
                              styleOptions.find(s => s.styleOptionId === style.styleOptionID)?.optionValue
                            ).join(', ')}
                          </TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                const newCustomProducts = createOrderForm.customProducts.filter((_, i) => i !== index);
                                setCreateOrderForm(prev => ({
                                  ...prev,
                                  customProducts: newCustomProducts
                                }));
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {/* Dialog cho custom product */}
              <Dialog 
                open={openCustomDialog} 
                onClose={() => setOpenCustomDialog(false)}
                maxWidth="md"
                fullWidth
              >
                <DialogTitle>Add Custom Product</DialogTitle>
                <DialogContent>
                  {/* Fabric Selection */}
                  <Autocomplete
                    options={fabrics}
                    getOptionLabel={(option) => 
                      option ? `${option.fabricName} - $${option.price}` : ''
                    }
                    value={selectedFabric}
                    onChange={(_, newValue) => setSelectedFabric(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Fabric"
                        margin="normal"
                        fullWidth
                        required
                      />
                    )}
                  />

                  {/* Lining Selection */}
                  <Autocomplete
                    options={Array.isArray(linings) ? linings.filter(lining => lining.status === "Available") : []}
                    getOptionLabel={(option) => 
                      option ? `${option.liningName}` : ''
                    }
                    value={selectedLining}
                    onChange={(_, newValue) => setSelectedLining(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Lining"
                        margin="normal"
                        fullWidth
                        required
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <img 
                            src={option.imageUrl}
                            alt={option.liningName}
                            style={{ width: '20px', height: '20px', objectFit: 'cover', marginRight: '8px' }}
                          />
                          <Typography variant="body1">
                            {option.liningName} 
                          </Typography>
                        </div>
                      </li>
                    )}
                    isOptionEqualToValue={(option, value) => 
                      option.liningId === value?.liningId
                    }
                  />

                  {/* Style Options Selection */}
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Style Options</Typography>
                    <Grid container spacing={2}>
                      {Object.entries(groupedStyleOptions).map(([optionType, options]) => (
                        <Grid item xs={12} md={6} key={optionType}>
                          <TextField
                            select
                            fullWidth
                            label={optionType}
                            value={selectedStyleOptions.find(selected => 
                              options.some(opt => opt.styleOptionId === selected.styleOptionId)
                            )?.styleOptionId || ''}
                            onChange={(e) => {
                              const selectedId = Number(e.target.value);
                              const selectedOption = options.find(opt => opt.styleOptionId === selectedId);
                              
                              setSelectedStyleOptions(prev => {
                                // Remove any existing option of the same type
                                const filtered = prev.filter(option => 
                                  styleOptions.find(so => so.styleOptionId === option.styleOptionId)?.optionType !== optionType
                                );
                                // Add the new selection
                                return [...filtered, selectedOption];
                              });
                            }}
                            size="small"
                          >
                            <MenuItem value="">
                              <em>Select {optionType}</em>
                            </MenuItem>
                            {options.map(option => (
                              <MenuItem key={option.styleOptionId} value={option.styleOptionId}>
                                {option.optionValue}
                                {option.price && ` (+$${option.price})`}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>

                  {/* Hiển thị thông tin người dùng */}
                  {selectedUser && (
                    <div className="user-info">
                      <h4>Measurement of customer:</h4>
                      <p><strong>Name:</strong> {selectedUser.name}</p>
                      <p><strong>Email:</strong> {selectedUser.email}</p>
                    </div>
                  )}

                  {/* Quantity */}
                  <TextField
                    label="Quantity"
                    type="number"
                    value={customQuantity}
                    onChange={handleCustomQuantityChange}
                    fullWidth
                    margin="normal"
                    error={!!validationErrors.customQuantity}
                    helperText={validationErrors.customQuantity}
                    required
                    InputProps={{
                      inputProps: { min: 1 }
                    }}
                  />

                  <Autocomplete
                    options={measurements}
                    getOptionLabel={(option) => {
                      const user = users.find(user => user.userId === option.userId);
                      return `${option.measurementId} (${user ? `${user.name} - ${user.email}` : 'Unknown User'})`;
                    }}
                    value={measurements.find(m => m.measurementId === measurementId) || null}
                    onChange={(_, newValue) => {
                      setMeasurementId(newValue?.measurementId || null);
                      handleCreateFormChange('measurementId', newValue?.measurementId || null);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Measurement ID"
                        margin="normal"
                        fullWidth
                      />
                    )}
                    renderOption={(props, option) => {
                      const user = users.find(user => user.userId === option.userId);
                      return (
                        <li {...props}>
                          <Typography>{`${option.measurementId} (${user ? `${user.name} - ${user.email}` : 'Unknown User'})`}</Typography>
                        </li>
                      );
                    }}
                    loading={measurements.length === 0}
                    loadingText="Loading measurements..."
                    noOptionsText="No measurements found"
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenCustomDialog(false)}>Cancel</Button>
                  <Button 
                    onClick={handleAddCustomProduct} 
                    color="primary" 
                    variant="contained"
                    disabled={!selectedFabric || !selectedLining || selectedStyleOptions.length === 0 || !measurementId || customQuantity < 1}
                  >
                    Add Custom Product
                  </Button>
                </DialogActions>
              </Dialog>

              {/* Thêm Summary Box sau khi có sản phẩm được thêm vào */}
              {(selectedProducts.length > 0 || createOrderForm.customProducts.length > 0) && (
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3, 
                    my: 3, 
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e0e0e0',
                    borderRadius: 2
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    Order Summary
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <List dense>
                        <ListItem>
                          <ListItemText 
                            primary="Products Total" 
                            secondary={`$${selectedProducts.reduce((sum, product) => 
                              sum + (product.price * product.quantity), 0).toFixed(2)}`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText 
                            primary="Custom Products Total" 
                            secondary={`$${createOrderForm.customProducts.reduce((sum, product) => 
                              sum + (product.price * product.quantity), 0).toFixed(2)}`}
                          />
                        </ListItem>
                        {createOrderForm.shippingFee > 0 && (
                          <ListItem>
                            <ListItemText 
                              primary="Shipping Fee" 
                              secondary={`$${createOrderForm.shippingFee.toFixed(2)}`}
                            />
                          </ListItem>
                        )}
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <List dense>
                        {createOrderForm.voucherId && (
                          <ListItem>
                            <ListItemText 
                              primary={
                                <Typography color="success.main">
                                  {(() => {
                                    const voucher = vouchers.find(v => v.voucherId === createOrderForm.voucherId);
                                    const discountText = voucher?.voucherCode?.includes('BIGSALE') 
                                      ? `${(voucher.discountNumber * 100).toFixed(0)}% Off`
                                      : voucher?.voucherCode?.includes('FREESHIP')
                                      ? 'Free Shipping'
                                      : '';
                                    return `Voucher Applied: ${voucher?.voucherCode} (${discountText})`;
                                  })()}
                                </Typography>
                              }
                              secondary={
                                <Typography color="success.main" variant="caption">
                                  {vouchers.find(v => v.voucherId === createOrderForm.voucherId)?.description}
                                </Typography>
                              }
                            />
                          </ListItem>
                        )}
                        <ListItem>
                          <ListItemText 
                            primary={
                              <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 'bold' }}>
                                Total Amount
                              </Typography>
                            }
                            secondary={
                              <Typography variant="h6" color="primary.main">
                                ${calculateTotalAmount().toFixed(2)}
                              </Typography>
                            }
                          />
                        </ListItem>
                        {createOrderForm.deliveryMethod !== 'Delivery' && isDeposit && (
                          <ListItem>
                            <ListItemText 
                              primary={
                                <Typography variant="subtitle1" color="secondary.main" sx={{ fontWeight: 'bold' }}>
                                  Deposit Amount (50%)
                                </Typography>
                              }
                              secondary={
                                <Typography variant="h6" color="secondary.main">
                                  ${(calculateTotalAmount() * 0.5).toFixed(2)}
                                </Typography>
                              }
                            />
                          </ListItem>
                        )}
                      </List>
                    </Grid>
                  </Grid>
                </Paper>
              )}
 <Autocomplete
                options={vouchers.filter(voucher => {
                  // For Pick up method, exclude FREESHIP vouchers
                  if (createOrderForm.deliveryMethod === 'Pick up') {
                    return voucher.status === "OnGoing" && !voucher.voucherCode.includes('FREESHIP');
                  }
                  // For Delivery method, show all valid vouchers
                  return voucher.status === "OnGoing";
                })}
                getOptionLabel={(option) => 
                  option ? `${option.voucherCode} - ${option.description} (${option.discountNumber * 100}% off)` : ''
                }
                value={vouchers.find(v => v.voucherId === createOrderForm.voucherId) || null}
                onChange={handleVoucherChange}
                freeSolo={false}
                disableClearable={false}
                selectOnFocus={false}
                clearOnBlur={true}
                handleHomeEndKeys={false}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Voucher"
                    margin="normal"
                    variant="outlined"
                    fullWidth
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="body1">
                        {option.voucherCode} ({option.discountNumber * 100}% off)
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {option.description}
                      </Typography>
                    </div>
                  </li>
                )}
                isOptionEqualToValue={(option, value) => option.voucherId === value?.voucherId}
                noOptionsText="No valid vouchers available"
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleCreateOrder}
                disabled={isCreatingOrder}
              >
                Next
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Payment</DialogTitle>
        <DialogContent>
          <form 
            onSubmit={(e) => {
              console.log('Form submitted'); // Debug log 6
              handlePaymentSubmit(e);
            }}
          >
            <TextField
              label="Order ID"
              value={createdOrderId || ''} 
              fullWidth
              margin="normal"
              disabled
            />
            <TextField
              label="User ID"
              value={userId || ''}
              fullWidth
              margin="normal"
              disabled 
            />
            <TextField
              label="Amount"
              value={amount.toFixed(2)} // Format to 2 decimal places
              fullWidth
              margin="normal"
              disabled // Make it read-only
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
            />
            <TextField
              label="Payment Method"
              select
              value={method}
              onChange={(e) => setMethod(e.target.value)} // Cập nhật method
              fullWidth
              margin="normal"
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Banking">Banking Payment</MenuItem>
            </TextField>
            {method === 'Banking' && (
              <div>
                <img src={BankingPayment} alt="Banking Payment" style={{ width: '50%', marginTop: '10px' }} />
              </div>
            )}
            <TextField
              label="Payment Date"
              type="date"
              value={paymentDate}
              onChange={(e) => {
                const dateError = validatePaymentDate(e.target.value);
                setValidationErrors(prev => ({
                  ...prev,
                  paymentDate: dateError
                }));
                setPaymentDate(e.target.value);
              }}
              fullWidth
              margin="normal"
              error={!!validationErrors.paymentDate}
              helperText={validationErrors.paymentDate}
              required
            />
            <TextField
              label="Payment Details"
              select
              value={paymentDetails}
              onChange={(e) => setPaymentDetails(e.target.value)} // Cập nhật paymentDetails
              fullWidth
              margin="normal"
              disabled // Thêm disabled để không cho phép thay đổi trực tiếp trong dialog
            >
              <MenuItem value="Paid full">Paid full</MenuItem>
              <MenuItem value="Make deposit 50%">Make deposit 50%</MenuItem>
            </TextField>
            <Button 
              type="submit"
              variant="contained" 
              color="primary"
              onClick={(e) => {
                console.log('Submit button clicked'); // Debug log 7
              }}
            >
              Create Payment
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Thêm Dialog cho danh sách thanh toán */}
      <Dialog 
        open={remainingPaymentDialog} 
        onClose={() => setRemainingPaymentDialog(false)}
        maxWidth="sm"
        fullWidth
        onEnter={() => {
          console.log('Dialog opened');
          console.log('Current unpaidDeposits:', unpaidDeposits);
        }}
      >
        <DialogTitle>Process Remaining Payment</DialogTitle>
        <DialogContent>
          {isLoadingDeposits ? (
            <CircularProgress />
          ) : (
            <TextField
              select
              label="Select Order"
              fullWidth
              margin="normal"
              value={selectedOrderForPayment?.orderId || ''}
              onChange={(e) => {
                const order = unpaidDeposits.find(o => o.orderId === e.target.value);
                setSelectedOrderForPayment(order);
              }}
            >
              {unpaidDeposits.map((order) => (
                <MenuItem key={order.orderId} value={order.orderId}>
                  Order #{order.orderId} - {order.guestName} - {order.guestEmail}
                </MenuItem>
              ))}
            </TextField>
          )}

          {selectedOrderForPayment && (
            <>
              <TextField
                label="Customer"
                value={selectedOrderForPayment.guestName}
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label="Remaining Amount"
                value={(selectedOrderForPayment.totalPrice - selectedOrderForPayment.deposit).toFixed(2)}
                fullWidth
                margin="normal"
                disabled
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              <TextField
                select
                label="Payment Method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                fullWidth
                margin="normal"
              >
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Banking">Banking Payment</MenuItem>
                <MenuItem value="Paypal">Visa Card</MenuItem>
              </TextField>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRemainingPaymentDialog(false)}>Cancel</Button>
          <Button 
            onClick={() => handleCreatePayment(selectedOrderForPayment)}
            variant="contained" 
            color="primary"
            disabled={!selectedOrderForPayment}
          >
            Process Payment
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
};

export default OrderList;