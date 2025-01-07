import React, { useEffect, useState, useCallback } from "react";
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
} from "@mui/material";
import { Edit, Visibility, Add, Delete, FilterList } from "@mui/icons-material";
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

const BASE_URL = "https://localhost:7194/api"; // Update this to match your API URL
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

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [formState, setFormState] = useState({
    id: "",
    customerName: "",
    status: "pending",
    paymentId: "",
    storeId: "",
    voucherId: "",
    // shipperPartnerId: "4",
    orderDate: "",
    shippedDate: "",
    note: "",
    paid: "",
    totalPrice: "",
  });
  const [orderDetails, setOrderDetails] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [createOrderForm, setCreateOrderForm] = useState({
    storeId: 0,
    voucherId: 0,
    // shipperPartnerId: 0,
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
  const [method, setMethod] = useState(''); // State cho payment method
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
        setSnackbarMessage('Error loading vouchers');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
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
        setSnackbarMessage('Error loading products');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
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
        setSnackbarMessage('Error loading custom data');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
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
        setSnackbarMessage('Error searching users');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
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
        console.log("Retrieved userId from localStorage:", userId);

        if (!userId) {
          throw new Error("User ID not found");
        }
        const storeData = await fetchStoreByStaffId(userId);
        const ordersData = await fetchOrdersByStoreId(storeData.storeId);
        setOrders(
          Array.isArray(ordersData) ? ordersData : [ordersData]
        );
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
        setSnackbarMessage("Order updated successfully");
        setSnackbarSeverity("success");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSnackbarMessage("Failed to update order");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
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
        setSnackbarMessage("Failed to fetch order details");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleCreateOrder = async () => {
    setIsCreatingOrder(true);
    try {
      // Calculate total amount including shipping fee
      const totalOrderAmount = selectedProducts.reduce((sum, product) => 
        sum + (product.price * product.quantity), 0) + (createOrderForm.shippingFee || 0);

      // Calculate deposit based on payment details
      const depositAmount = totalOrderAmount; // This will be the same as the payment amount

      const formattedShippedDate = createOrderForm.shippedDate 
        ? new Date(createOrderForm.shippedDate).toISOString().split('T')[0]
        : null;
      console.log('Formatted Shipped Date:', formattedShippedDate);

      const formattedProducts = createOrderForm.products.map(product => {
        const formatted = {
          productID: product.productID,
          quantity: product.quantity,
          price: product.price || 0
        };
        console.log('Formatted Product:', formatted);
        return formatted;
      });

      const orderPayload = {
        userId: selectedUser?.userId || null,
        storeId: createOrderForm.storeId,
        voucherId: createOrderForm.voucherId || null,
        shippedDate: createOrderForm.shippedDate,
        note: createOrderForm.note || '',
        paid: createOrderForm.paid || false,
        guestName: createOrderForm.guestName,
        guestEmail: createOrderForm.guestEmail,
        guestAddress: createOrderForm.guestAddress,
        deposit: depositAmount, // Set deposit to match the payment amount
        shippingFee: createOrderForm.shippingFee || 0,
        deliveryMethod: createOrderForm.deliveryMethod,
        products: formattedProducts,
        customProducts: createOrderForm.customProducts || []
      };

      // Log payload for verification
      console.log('Final API Request Payload:', orderPayload);

      const response = await api.post('/Orders/staffcreateorder', orderPayload);
      console.log('API Response Success:', response.data);
      
      const orderId = response.data.orderId; // Lưu orderId
      setCreatedOrderId(orderId);
      localStorage.setItem('orderId', orderId);
      
      // Gọi hàm để lấy thông tin đơn hàng
      await fetchOrderDetails(orderId); // Đảm bảo orderId được truyền đúng
      
      // Mở dialog createPayment
      setOpenPaymentDialog(true);
      
      setSnackbarMessage('Order created successfully');
      setSnackbarSeverity('success');
      setOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error);
        console.error('Error Response:', error.response); // Thông tin phản hồi từ máy chủ
        console.error('Error Message:', error.message); // Thông điệp lỗi
      } else {
        console.error('Unexpected Error:', error); // Lỗi không phải từ Axios
      }
      
      setSnackbarMessage(
        error.response?.data?.message || 
        'Failed to create order'
      );
      setSnackbarSeverity('error');
    } finally {
      setIsCreatingOrder(false);
      setSnackbarOpen(true);
    }
  };

  const handleCreateFormChange = (field, value) => {
    if (field === 'shippedDate') {
      const dateError = validateShippedDate(value);
      setValidationErrors(prev => ({
        ...prev,
        shippedDate: dateError
      }));
      if (dateError) return; // Don't update if date is invalid
    }
    
    setCreateOrderForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const findNearestStore = (address) => {
    const nearest = stores.reduce((prev, curr) => {
      return prev;
    }, stores[0]);
    setNearestStore(nearest);
  };

  const calculateShippingFee = async (addressData) => {
    console.log('Calculating Shipping Fee with data:', addressData);
    
    if (!addressData?.wardCode || !addressData?.districtId || !nearestStore) {
        console.log('Missing required data:', {
            wardCode: addressData?.wardCode,
            districtId: addressData?.districtId,
            nearestStore: nearestStore
        });
        setCreateOrderForm(prev => ({
            ...prev,
            shippingFee: 2
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
            'https://localhost:7194/api/Shipping/calculate-fee',
            shippingPayload
        );

        if (response.data) {
            console.log('Shipping Fee Response (VND):', response.data.total);
            const shippingFeeVND = response.data.total || 0;
            const shippingFeeUSD = await convertVNDToUSD(shippingFeeVND);
            console.log('Shipping Fee (USD):', shippingFeeUSD);
            setCreateOrderForm(prev => ({
                ...prev,
                shippingFee: shippingFeeUSD
            }));
        }
    } catch (error) {
        console.error('Error calculating shipping fee:', error);
        setCreateOrderForm(prev => ({
            ...prev,
            shippingFee: 2
        }));
        setSnackbarOpen(true);
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
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleAddCustomProduct = () => {
    try {
      // Validate required fields
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

      // Create new custom product
      const newCustomProduct = {
        productCode: `CUSTOM-${Date.now()}`,
        categoryID: 5, // Assuming 5 is for custom products
        fabricID: selectedFabric.fabricID,
        liningID: selectedLining.liningId,
        measurementID: parseInt(measurementId),
        quantity: customQuantity,
        pickedStyleOptions: selectedStyleOptions.map(option => ({
          styleOptionID: option.styleOptionId
        }))
      };

      // Update form state
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
      setSnackbarMessage('Custom product added successfully');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);

    } catch (error) {
      console.error('Error adding custom product:', error);
      setSnackbarMessage(error.message);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
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
        setSnackbarMessage('Error loading stores');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
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
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await api.get('/Payments');
      console.log('Payments Data:', response.data); // Log the payments data
      const paymentsData = response.data;

      // Create a mapping of orderId to payment method
      const paymentMap = {};
      paymentsData.forEach(payment => {
        paymentMap[payment.orderId] = payment.method;
      });

      console.log('Payment Map:', paymentMap); // Log the payment map
      setPayments(paymentMap); // Store the mapping in state
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
    
    // Validate payment date
    const dateError = validatePaymentDate(paymentDate);
    if (dateError) {
      setValidationErrors(prev => ({
        ...prev,
        paymentDate: dateError
      }));
      setSnackbarMessage('Please fill in all required fields correctly');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // Calculate total amount including shipping fee
    const totalAmount = amount + (createOrderForm.shippingFee || 0);
    
    // Calculate deposit amount based on payment details
    const finalAmount = paymentDetails === "Make deposit 50%" ? totalAmount * 0.5 : totalAmount;

    const paymentPayload = {
        orderId: createdOrderId,
        userId: userId,
        method: method, 
        paymentDate: paymentDate,
        paymentDetails: paymentDetails,
        amount: finalAmount // Use the calculated amount
    };

    try {
        const response = await api.post('/Payments', paymentPayload);
        console.log('Payment created successfully:', response.data);
        setSnackbarMessage('Payment created successfully');
        setSnackbarSeverity('success');

        // Update order payment status if full payment
        if (paymentDetails === "Paid full") {
            await api.put(`/Orders/SetPaidTrue/${createdOrderId}`);
        }

        // Update payments state
        setPayments(prevPayments => ({
            ...prevPayments,
            [createdOrderId]: method
        }));
    } catch (error) {
        console.error('Error creating payment:', error);
        setSnackbarMessage('Failed to create payment');
        setSnackbarSeverity('error');
    }
    setSnackbarOpen(true);
    setOpenPaymentDialog(false); // Close the dialog after submission
  };

  // Call fetchUnpaidOrders in useEffect to load unpaid orders on component mount
  useEffect(() => {
    fetchUnpaidOrders();
  }, []);

  const fetchOrderDetails = async (orderId) => {
    try {
        const response = await api.get(`/Orders/${orderId}`);
        console.log('Order Details Response:', response.data); // Kiểm tra phản hồi
        const orderData = response.data;

        // Kiểm tra xem userId có tồn tại không
        if (orderData.userID) {
            setUserId(orderData.userID); // Lưu userId
        } else {
            console.error('userId not found in order data');
        }

        // Calculate total amount including shipping fee
        const totalAmount = orderData.totalPrice + (orderData.shippingFee || 0);
        setAmount(totalAmount);
    } catch (error) {
        console.error('Error fetching order details:', error);
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

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <div>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Order Management
      </Typography>

      {/* Chart Section */}
      

      {/* Enhanced Filter Section */}
      <Paper sx={{ p: 3, mb: 3, backgroundColor: "#f8f9fa" }}>
        <Typography
          variant="h6"
          sx={{ mb: 3, color: "primary.main", fontWeight: 600 }}
        >
          <FilterList sx={{ mr: 1, verticalAlign: "middle" }} />
          Filter Orders
        </Typography>

        <Grid container spacing={3}>
          {/* Date Filter Column */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: "white",
                borderRadius: 2,
                height: "100%",
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                Date Range
              </Typography>

              <Box sx={{ px: 2, pb: 2 }}>
                <TextField
                  select
                  label="Select Period"
                  value={dateFilter}
                  onChange={handleDateFilterChange}
                  fullWidth
                  sx={{ mb: 2 }}
                  size="small"
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="thisWeek">This Week</MenuItem>
                  <MenuItem value="thisMonth">This Month</MenuItem>
                  <MenuItem value="lastMonth">Last Month</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </TextField>

                {dateFilter === "custom" && (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={2}>
                      <DatePicker
                        label="Start Date"
                        value={customDateRange.startDate}
                        onChange={(newValue) => {
                          setCustomDateRange((prev) => ({
                            ...prev,
                            startDate: newValue,
                          }));
                        }}
                        slotProps={{ textField: { size: "small" } }}
                      />
                      <DatePicker
                        label="End Date"
                        value={customDateRange.endDate}
                        onChange={(newValue) => {
                          setCustomDateRange((prev) => ({
                            ...prev,
                            endDate: newValue,
                          }));
                        }}
                        minDate={customDateRange.startDate}
                        slotProps={{ textField: { size: "small" } }}
                      />
                    </Stack>
                  </LocalizationProvider>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Price Range Column */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor: "white",
                borderRadius: 2,
                height: "100%",
              }}
            >
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 500 }}>
                Price Range
              </Typography>

              <Box sx={{ px: 2, pb: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Select price range (USD)
                </Typography>
                <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
                  ${priceRange[0]} - ${priceRange[1]}
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10000}
                  sx={{
                    "& .MuiSlider-thumb": {
                      height: 24,
                      width: 24,
                      backgroundColor: "#fff",
                      border: "2px solid currentColor",
                      "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                        boxShadow: "inherit",
                      },
                    },
                    "& .MuiSlider-valueLabel": {
                      backgroundColor: "primary.main",
                    },
                  }}
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Active Filters Display */}
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {dateFilter !== "all" && (
              <Chip
                label={`Date: ${dateFilter}`}
                onDelete={() => setDateFilter("all")}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            {(priceRange[0] > 0 || priceRange[1] < 10000) && (
              <Chip
                label={`Price: $${priceRange[0]} - $${priceRange[1]}`}
                onDelete={() => setPriceRange([0, 10000])}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
          </Stack>
        </Box>
      </Paper>

      <StyledButton
        variant="contained"
        startIcon={<Add />}
        onClick={() => {
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
            totalPrice: "",
          });
          setOpen(true);
          setIsEditMode(false);
        }}
        sx={{ mb: 2 }}
      >
        Add Order
      </StyledButton>

      {/* <Button
        variant="contained"
        color="secondary"
        onClick={() => setOpenPaymentDialog(true)}
        sx={{ mb: 2, ml: 2 }}
      >
        Create Payment
      </Button> */}

      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <StyledTableHead>
            <TableRow>
              <StyledTableCell>Order ID</StyledTableCell>
              <StyledTableCell>Customer</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Payment Method</StyledTableCell>
              <StyledTableCell>Order Date</StyledTableCell>
              <StyledTableCell>Total Price</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {filterOrders(currentOrders).map((order) => (
              <TableRow key={order.orderId} hover>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.guestName}</TableCell>
                <TableCell>{order.status || 'Pending'}</TableCell>
                <TableCell>{payments[order.orderId] || 'N/A'}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>{order.totalPrice ? order.totalPrice.toFixed(2) : "0.00"}$</TableCell>
                <TableCell>
                  
                  <Tooltip title="View Details">
                    <IconButton onClick={() => handleViewDetails(order.orderId)} sx={{ color: "primary.main" }}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* <TablePagination
          rowsPerPageOptions={[10]}
          component="div"
          count={filterOrders(orders).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          sx={{
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              margin: '0',
            },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            '.MuiTablePagination-actions': {
              marginLeft: 'auto',
              marginRight: 'auto'
            }
          }}
        /> */}
      </TableContainer>

      {/* Pagination Controls */}
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

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Create Order Dialog */}
      <Dialog open={open && !isEditMode} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
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
              <Autocomplete
                options={vouchers.filter(voucher => voucher.status === "OnGoing")}
                getOptionLabel={(option) => `${option.voucherCode} - ${option.description}` || ''}
                value={vouchers.find(voucher => voucher.voucherId === createOrderForm.voucherId) || null}
                onChange={(_, newValue) => {
                  console.log('Selected Voucher:', newValue);
                  setCreateOrderForm(prev => {
                    const updatedForm = {
                      ...prev,
                      voucherId: newValue ? newValue.voucherId : null
                    };

                    // Tính toán lại shipping fee với voucher mới
                    if (prev.shippingFee) {
                      const newShippingFee = calculateFinalShippingFee(prev.shippingFee, newValue);
                      console.log('Original Shipping Fee:', prev.shippingFee);
                      console.log('New Shipping Fee:', newShippingFee);
                      updatedForm.shippingFee = newShippingFee;
                    }

                    return updatedForm;
                  });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Voucher"
                    margin="normal"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
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
                onChange={(e) => {
                  const method = e.target.value;
                  setCreateOrderForm(prev => ({
                    ...prev,
                    deliveryMethod: method,
                    shippedDate: method === 'Pick up' ? '' : prev.shippedDate,
                    shippingFee: method === 'Pick up' ? 0 : prev.shippingFee
                  }));
                }}
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
              {createOrderForm.deliveryMethod !== 'Delivery' && (
                <TextField
                    label="Deposit"
                    type="number"
                    value={createOrderForm.deposit}
                    onChange={handleDepositChange}
                    fullWidth
                    margin="normal"
                    error={!!validationErrors.deposit}
                    helperText={validationErrors.deposit}
                    InputProps={{
                      inputProps: { 
                        min: 0,
                        step: "0.01",
                        onKeyDown: (e) => {
                          if (e.key === '-') {
                            e.preventDefault();
                          }
                        }
                      },
                      startAdornment: <InputAdornment position="start">$</InputAdornment>
                    }}
                />
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
                        <TableCell>Quantity</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedProducts.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.productCode}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>${(product.price * product.quantity).toFixed(2)}</TableCell>
                          <TableCell>
                            <IconButton
                              onClick={() => {
                                const newProducts = selectedProducts.filter((_, i) => i !== index);
                                setSelectedProducts(newProducts);
                                setCreateOrderForm(prev => ({
                                  ...prev,
                                  products: newProducts
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
                  <Autocomplete
                    multiple
                    options={styleOptions}
                    getOptionLabel={(option) => option.optionValue}
                    value={selectedStyleOptions}
                    onChange={(_, newValue) => setSelectedStyleOptions(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Style Options"
                        margin="normal"
                        fullWidth
                        required
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props}>
                        <Typography>{option.optionValue}</Typography>
                      </li>
                    )}
                  />

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
          <form onSubmit={handlePaymentSubmit}>
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
            {method === 'Paypal' && (
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
            >
              <MenuItem value="Paid full">Paid full</MenuItem>
              <MenuItem value="Make deposit 50%">Make deposit 50%</MenuItem>
            </TextField>
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Create Payment
            </Button>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default OrderList;