import React, { useState, useEffect, useMemo } from "react";
import io from "socket.io-client"; 
import { Card } from "../components/ui/card";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"; 
import jsPDF from 'jspdf'; 
import html2canvas from 'html2canvas'; 
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom"; 
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Package,
  Users,
  DollarSign,
  TrendingUp,
  Settings,
  Trash2,
  Plus,
  Edit,
  Save,
  X,
  Upload,
  Loader2,
  Bell, 
  ChevronDown, 
  Receipt, 
  Search,
  Sparkles,
  LayoutDashboard,
  Filter,
  ShoppingCart
} from "lucide-react";
import Navbar from "../components/Navbar";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import RewardDashboard from "../components/RewardDashboard";
import AdminReports from "../components/AdminReports";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";
import EditUserDialog from "../components/EditUserDialog"; 
import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog"; 
import { motion, AnimatePresence } from "framer-motion";

// Define the base URLs
const BASE_URL = "https://grilmelt-burger.onrender.com";
const API_URL = `${BASE_URL}/api`;
const LOGO_URL = `/logo.png`; 

const FIXED_CATEGORIES = [
  "classic",
  "premium",
  "veggie",
  "spicy",
  "side",
  "drink",
  "burgers",
  "dessert",
  "specials",
  "submarines",
  "pizza",
  "pasta"
];

const Collapsible = CollapsiblePrimitive.Root;
const CollapsibleTrigger = CollapsiblePrimitive.Trigger;
const CollapsibleContent = CollapsiblePrimitive.Content;

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false); 
  const [errors, setErrors] = useState({}); 

  // Search States
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  const { user } = useAuth();
  const { toast } = useToast();

  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDot, setShowNotificationDot] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);

  useEffect(() => {
    if (user && user.token && user.role === "admin") {
      fetchProducts();
      fetchUsers();
      fetchOrders();

      const socket = io(BASE_URL);
      socket.emit("join_admin_room");

      socket.on("new_order", (notification) => {
        toast({
          title: "🔔 New Order Received!",
          description: `Order #${notification.orderId.slice(-6)} for LKR ${notification.totalAmount.toFixed(2)}`,
          duration: 5000,
          className: "bg-[#09090b] border-[#FFB800]/20 text-white"
        });
        setNotifications((prev) => [notification, ...prev]);
        setShowNotificationDot(true);
        fetchOrders();
      });

      return () => socket.disconnect(); 
    }
  }, [user]);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setImagePreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setImagePreviewUrl(null);
    }
  }, [selectedFile]);

  // --- Data Fetching Functions ---
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
      else setProducts([]);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const fetchUsers = async () => {
    const token = user?.token;
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setUsers(data);
      else setUsers([]);
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    }
  };

  const fetchOrders = async () => {
    const token = user?.token;
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data)) setOrders(data);
      else setOrders([]);
    } catch (error) {
      console.error("Error loading orders:", error);
      setOrders([]);
    }
  };

  // --- Product Management Functions ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const validateProduct = (isUpdating = false) => {
    const newErrors = {};
    if (!newProduct.name.trim()) newErrors.name = "Product name is required.";
    if (!newProduct.price) newErrors.price = "Price is required.";
    else if (isNaN(newProduct.price) || Number(newProduct.price) <= 0) newErrors.price = "Enter valid price.";
    if (!newProduct.category) newErrors.category = "Category is required.";
    if (!isUpdating && !selectedFile) newErrors.image = "Product image is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addProduct = async () => {
    if (!validateProduct()) return;
    setIsSaving(true);
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description || "");
    formData.append("category", newProduct.category);
    formData.append("imageFile", selectedFile);

    try {
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "✅ Success!", description: "Product added successfully.", duration: 2000, className: "bg-[#09090b] text-white" });
        setNewProduct({ name: "", price: "", description: "", category: "" });
        setSelectedFile(null);
        setImagePreviewUrl(null);
        setErrors({}); 
        fetchProducts();
      } else {
        toast({ title: "❌ Error", description: data.message, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Server Error", description: "Could not connect.", variant: "destructive" });
    }
    setIsSaving(false);
  };

  const startEditing = (product) => {
    setEditingProduct(product._id);
    setNewProduct({
      name: product.name,
      price: product.price,
      image: product.image || "",
      description: product.description,
      category: product.category,
    });
    setSelectedFile(null);
    setImagePreviewUrl(null);
  };

  const updateProduct = async () => {
    if (!validateProduct(true)) return;
    setIsSaving(true);
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("price", newProduct.price);
    formData.append("description", newProduct.description);
    formData.append("category", newProduct.category);
    if (selectedFile) formData.append("imageFile", selectedFile);

    try {
      const res = await fetch(`${API_URL}/products/${editingProduct}`, {
        method: "PUT",
        body: formData,
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        toast({ title: "✅ Success!", description: "Product updated.", duration: 2000, className: "bg-[#09090b] text-white" });
        cancelEdit();
        setErrors({}); 
        fetchProducts();
      } else {
        toast({ title: "❌ Error", description: "Update failed", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Server Error", description: "Connection failed.", variant: "destructive" });
    }
    setIsSaving(false);
  };

  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        toast({ title: "🗑️ Deleted!", description: "Product deleted.", duration: 2000 });
        fetchProducts();
      } else {
        toast({ title: "❌ Error", description: "Delete failed", variant: "destructive" });
      }
    } catch (error) { console.error(error); }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setNewProduct({ name: "", price: "", image: "", description: "", category: "" });
    setSelectedFile(null);
    setImagePreviewUrl(null);
    setErrors({});
  };

  // --- User Management ---
  const handleUpdateUser = async (userId, userData) => {
    setIsSaving(true);
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify(userData)
      });
      if (res.ok) {
        toast({ title: "✅ User Updated", description: "Saved successfully.", className: "bg-[#09090b] text-white" });
        fetchUsers();
      } else {
        throw new Error("Update failed.");
      }
    } catch (error) {
      toast({ title: "❌ Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (userId === user._id) {
      toast({ title: "Action Not Allowed", description: "Cannot delete own account.", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch(`${API_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user?.token}` }
      });
      if (res.ok) {
        toast({ title: "🗑️ User Deleted", description: "Removed successfully." });
        fetchUsers();
      } else {
        throw new Error("Delete failed.");
      }
    } catch (error) {
      toast({ title: "❌ Error", description: error.message, variant: "destructive" });
    }
  };

  // --- Order Status ---
  const updateOrderStatus = async (orderId, newStatus) => {
    if (!window.confirm(`Update order status to ${newStatus}?`)) return;
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ newStatus }),
      });
      if (res.ok) {
        toast({ title: "✅ Updated", description: `Status: ${newStatus}`, duration: 2000, className: "bg-[#09090b] text-white" });
        fetchOrders();
      } else {
        toast({ title: "❌ Error", description: "Update failed", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Server Error", description: "Connection failed.", variant: "destructive" });
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      if (res.ok) {
        toast({ title: "🗑️ Deleted!", description: "Order deleted.", duration: 2000 });
        fetchOrders();
      } else {
        toast({ title: "❌ Error", description: "Delete failed", variant: "destructive" });
      }
    } catch (error) { console.error(error); }
  };

  // --- Bill Generation ---
  const generateBillForOrder = async (order) => {
    if (!order || !order.userId) return;
    setIsDownloading(true);
    const invoiceElement = document.getElementById('invoice-content');

    const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 350.00; 
    const discount = subtotal + deliveryFee - order.totalAmount;

    document.getElementById('invoice-order-id').textContent = `#${order._id.slice(-6)}`;
    document.getElementById('invoice-customer-name').textContent = order.userId.name;
    document.getElementById('invoice-customer-email').textContent = order.userId.email;
    document.getElementById('invoice-address').textContent = order.address;
    document.getElementById('invoice-date').textContent = new Date(order.createdAt).toLocaleDateString();
    
    const itemBody = document.getElementById('invoice-item-body');
    itemBody.innerHTML = '';
    order.items.forEach((item, index) => {
        const row = itemBody.insertRow(index);
        row.style.height = '40px';
        row.style.backgroundColor = index % 2 === 0 ? '#fafafa' : '#ffffff';
        row.insertCell(0).textContent = item.name;
        row.insertCell(1).textContent = item.quantity;
        row.insertCell(2).textContent = `LKR ${item.price.toFixed(2)}`;
        row.insertCell(3).textContent = `LKR ${(item.price * item.quantity).toFixed(2)}`;
    });

    document.getElementById('invoice-subtotal').textContent = `LKR ${subtotal.toFixed(2)}`;
    document.getElementById('invoice-delivery').textContent = `LKR ${deliveryFee.toFixed(2)}`;
    document.getElementById('invoice-discount').textContent = `- LKR ${discount.toFixed(2)}`; 
    document.getElementById('invoice-total').textContent = `LKR ${order.totalAmount.toFixed(2)}`;
    document.getElementById('invoice-logo').src = LOGO_URL; 

    try {
        const canvas = await html2canvas(invoiceElement, {
            scale: 1.5, logging: false, useCORS: true, windowWidth: 800, windowHeight: invoiceElement.scrollHeight
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); 
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Order_Invoice_${order._id.slice(-6)}.pdf`);
        toast({ title: '📥 Download Complete', description: 'Invoice PDF generated.', duration: 2000, className: "bg-[#09090b] text-white" });
    } catch (error) {
        toast({ title: '❌ Download Failed', description: 'Could not generate PDF.', variant: 'destructive' });
    } finally {
        setIsDownloading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      case "preparing": return "bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/20";
      case "on-the-way": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "delivered": return "bg-green-500/10 text-green-400 border-green-500/20";
      default: return "bg-white/5 text-gray-400 border-white/10";
    }
  };

  const totalRevenue = useMemo(() => {
    return orders
      .filter((order) => order.status === "delivered")
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
  }, [orders]);

  const stats = [
    { label: "Total Products", value: products.length, icon: Package, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Total Orders", value: orders.length, icon: ShoppingCart, color: "text-[#FFB800]", bg: "bg-[#FFB800]/10", border: "border-[#FFB800]/20" },
    { label: "Total Users", value: users.length, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "Total Revenue", value: `LKR ${totalRevenue.toFixed(2)}`, icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
  ];

  const filteredProducts = useMemo(() => products.filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase())), [products, productSearch]);
  const filteredOrders = useMemo(() => orders.filter(o => o._id.toLowerCase().includes(orderSearch.toLowerCase())), [orders, orderSearch]);
  const filteredUsers = useMemo(() => users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase())), [users, userSearch]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FFB800] selection:text-black relative overflow-x-hidden">
      {/* 🌟 Background Ambient Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FFB800]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <Navbar />

      <main className="container px-4 pt-32 pb-20 mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-3 mb-1">
                 <div className="p-1.5 bg-[#FFB800]/10 rounded-lg border border-[#FFB800]/20">
                    <LayoutDashboard className="w-5 h-5 text-[#FFB800]" />
                 </div>
                 <span className="text-xs font-bold text-[#FFB800] uppercase tracking-widest">Admin Panel</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white drop-shadow-xl">
                Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] to-yellow-600">Overview</span>
              </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            {/* Notification Bell */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative w-12 h-12 rounded-full border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#FFB800]/50 transition-all">
                  <Bell className="w-5 h-5 text-gray-300" />
                  {notifications.length > 0 && (
                    <Badge className="absolute flex items-center justify-center w-5 h-5 p-0 -top-1 -right-1 bg-red-500 text-white border-2 border-[#050505] animate-pulse">
                      {notifications.length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80 bg-[#09090b]/95 backdrop-blur-xl border-white/10 text-white">
                <div className="p-3 font-bold border-b border-white/10 flex justify-between items-center">
                  <span>Notifications</span>
                  <Badge variant="outline" className="text-xs">{notifications.length}</Badge>
                </div>
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((n, i) => (
                    <DropdownMenuItem key={i} className="flex flex-col items-start gap-1 p-3 hover:bg-white/5 cursor-pointer focus:bg-white/5 focus:text-white">
                      <p className="font-semibold text-sm text-[#FFB800]">{n.message}</p>
                      <p className="text-xs text-gray-400">{new Date(n.timestamp).toLocaleTimeString()}</p>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <p className="p-4 text-sm text-center text-gray-500">No new notifications.</p>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/profile">
              <Button variant="outline" className="gap-2 h-12 rounded-full border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#FFB800]/50 text-gray-300 hover:text-white transition-all">
                <Settings className="w-4 h-4" /> <span className="hidden md:inline">Settings</span>
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
            >
                <Card className={`p-6 border ${stat.border} ${stat.bg} backdrop-blur-sm relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center justify-between mb-3 relative z-10">
                    <div className={`p-2 rounded-lg bg-[#050505]/50 border border-white/5`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    {index === 3 && <Sparkles className="w-3 h-3 text-[#FFB800] animate-pulse" />}
                  </div>
                  <div className="relative z-10">
                      <p className="text-2xl font-black text-white tracking-tight mb-0.5">{stat.value}</p>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{stat.label}</p>
                  </div>
                </Card>
            </motion.div>
          ))}
        </div>

          {/* Main Content Tabs */}
        <Tabs defaultValue="products" className="space-y-8">
          <TabsList className="p-1 bg-[#09090b]/80 border border-white/5 rounded-full inline-flex backdrop-blur-md">
            {['products', 'orders', 'users', 'challenges', 'reports'].map((tab) => (
                <TabsTrigger 
                    key={tab} 
                    value={tab}
                    className="rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wide data-[state=active]:bg-[#FFB800] data-[state=active]:text-black data-[state=active]:shadow-lg transition-all"
                >
                    {tab}
                </TabsTrigger>
            ))}
          </TabsList>

          {/* ---------------- PRODUCTS TAB ---------------- */}
          <TabsContent value="products" className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                {/* Add Product Form */}
                <Card className="p-8 bg-[#09090b]/60 border border-white/5 rounded-3xl backdrop-blur-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                    <div className="mb-6 relative z-10 flex items-center justify-between">
                         <h3 className="text-xl font-bold flex items-center gap-2">
                             {editingProduct ? <Edit className="w-5 h-5 text-[#FFB800]" /> : <Plus className="w-5 h-5 text-[#FFB800]" />} 
                             {editingProduct ? "Edit Product" : "Add New Product"}
                         </h3>
                         {editingProduct && <Badge variant="outline" className="border-[#FFB800] text-[#FFB800]">Editing Mode</Badge>}
                    </div>

                    <div className="grid gap-6 md:grid-cols-3 relative z-10">
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-wider">Product Name</label>
                           <Input placeholder="e.g. Double Cheese Burger" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className={`bg-black/40 border-white/10 focus:border-[#FFB800]/50 h-10 text-sm rounded-lg ${errors.name ? "border-red-500" : ""}`} />
                           {errors.name && <p className="text-xs text-red-500 pl-1">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-wider">Price (LKR)</label>
                           <div className="relative">
                               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">LKR</span>
                               <Input type="number" placeholder="0.00" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className={`pl-10 bg-black/40 border-white/10 focus:border-[#FFB800]/50 h-10 text-sm rounded-lg ${errors.price ? "border-red-500" : ""}`} />
                           </div>
                           {errors.price && <p className="text-xs text-red-500 pl-1">{errors.price}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-wider">Image</label>
                            <label className={`flex items-center gap-3 px-3 h-10 rounded-lg bg-black/40 border border-white/10 cursor-pointer hover:bg-white/5 transition-colors ${errors.image ? "border-red-500" : ""}`}>
                                <Upload className="w-4 h-4 text-[#FFB800]" />
                                <span className="text-xs text-gray-400 truncate">{selectedFile ? selectedFile.name : (newProduct.image && editingProduct ? "Change Image" : "Upload Image")}</span>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                            {errors.image && <p className="text-xs text-red-500 pl-1">{errors.image}</p>}
                        </div>
                    </div>
                    
                    <div className="grid gap-6 md:grid-cols-2 mt-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-wider">Description</label>
                            <Input placeholder="Short description..." value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="bg-black/40 border-white/10 focus:border-[#FFB800]/50 h-10 text-sm rounded-lg" />
                        </div>
                        <div className="space-y-2">
                             <label className="text-[10px] font-bold text-gray-500 uppercase ml-1 tracking-wider">Category</label>
                             <Select value={newProduct.category} onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}>
                                <SelectTrigger className={`bg-black/40 border-white/10 focus:border-[#FFB800]/50 h-10 text-sm rounded-lg ${errors.category ? "border-red-500" : ""}`}>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#09090b] border-white/10 text-white">
                                    {FIXED_CATEGORIES.map((cat) => (
                                        <SelectItem key={cat} value={cat} className="focus:bg-white/10 focus:text-white capitalize">{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                             </Select>
                             {errors.category && <p className="text-xs text-red-500 pl-1">{errors.category}</p>}
                        </div>
                    </div>

                    {/* Previews */}
                    {(imagePreviewUrl || (editingProduct && newProduct.image)) && (
                        <div className="mt-6 p-4 rounded-2xl bg-black/30 w-fit flex gap-6 items-center border border-white/5">
                            {editingProduct && newProduct.image && (
                                <div className="text-center">
                                    <p className="text-[10px] uppercase text-gray-500 mb-2">Current</p>
                                    <img src={`${BASE_URL}${newProduct.image}`} alt="Current" className="w-20 h-20 object-cover rounded-xl border border-white/10" />
                                </div>
                            )}
                            {imagePreviewUrl && (
                                <div className="text-center">
                                    <p className="text-[10px] uppercase text-[#FFB800] mb-2">New</p>
                                    <img src={imagePreviewUrl} alt="Preview" className="w-20 h-20 object-cover rounded-xl border border-[#FFB800]/30 shadow-[0_0_15px_rgba(255,184,0,0.2)]" />
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex gap-4 mt-8 relative z-10">
                        {editingProduct ? (
                            <>
                                <Button onClick={updateProduct} disabled={isSaving} className="bg-[#FFB800] text-black hover:bg-[#FFD600] font-bold rounded-xl h-11 px-6">
                                    {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Changes
                                </Button>
                                <Button variant="outline" onClick={cancelEdit} disabled={isSaving} className="border-white/10 hover:bg-white/10 rounded-xl h-11 px-6">
                                     Cancel
                                </Button>
                            </>
                        ) : (
                            <Button onClick={addProduct} disabled={isSaving} className="bg-[#FFB800] text-black hover:bg-[#FFD600] font-bold rounded-xl h-11 px-8">
                                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />} Add Product
                            </Button>
                        )}
                    </div>
                </Card>

                {/* Products List */}
                <div className="mt-12">
                     <div className="flex items-center justify-between mb-6">
                         <h3 className="text-2xl font-bold flex items-center gap-2">Inventory <Badge className="bg-white/10 hover:bg-white/10 text-white ml-2">{filteredProducts.length}</Badge></h3>
                         <div className="relative">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                              <Input placeholder="Search products..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="pl-10 bg-[#09090b]/40 border-white/10 rounded-full w-64 focus:w-80 transition-all duration-300" />
                         </div>
                     </div>
                     
                     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                         {filteredProducts.map((p) => (
                             <motion.div key={p._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                 <Card className="group p-4 bg-[#09090b]/40 border border-white/5 hover:border-[#FFB800]/30 transition-all duration-300 rounded-2xl relative overflow-hidden">
                                     <div className="flex items-center gap-4">
                                         <div className="w-16 h-16 rounded-xl bg-white/5 overflow-hidden flex-shrink-0 border border-white/5 group-hover:scale-105 transition-transform">
                                             {p.image ? (
                                                 <img src={`${BASE_URL}${p.image}`} alt={p.name} className="w-full h-full object-cover" />
                                             ) : (
                                                 <div className="w-full h-full flex items-center justify-center text-gray-600"><Package className="w-6 h-6" /></div>
                                             )}
                                         </div>
                                         <div className="flex-1 min-w-0">
                                             <h4 className="font-bold text-white truncate">{p.name}</h4>
                                             <p className="text-[#FFB800] font-mono text-sm">LKR {p.price}</p>
                                             <Badge variant="outline" className="mt-1 text-[10px] border-white/10 text-gray-400 capitalize bg-white/5">{p.category}</Badge>
                                         </div>
                                     </div>
                                     <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
                                          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-[#FFB800] hover:text-black rounded-lg" onClick={() => startEditing(p)}>
                                              <Edit className="w-4 h-4" />
                                          </Button>
                                          <ConfirmDeleteDialog orderId={p._id} orderSlice={p.name} onConfirm={deleteProduct} />
                                     </div>
                                 </Card>
                             </motion.div>
                         ))}
                     </div>
                     {filteredProducts.length === 0 && <div className="text-center py-12 text-gray-500">No products found matching your search.</div>}
                </div>
            </motion.div>
          </TabsContent>

          {/* ---------------- ORDERS TAB ---------------- */}
          <TabsContent value="orders">
             <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-bold">Manage Orders</h3>
                 <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input placeholder="Search Order ID..." value={orderSearch} onChange={(e) => setOrderSearch(e.target.value)} className="pl-10 bg-[#09090b]/40 border-white/10 rounded-full w-64" />
                 </div>
             </div>
             
             {filteredOrders.length === 0 ? (
                 <div className="text-center py-20 bg-[#09090b]/40 rounded-3xl border border-white/5">
                     <Package className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                     <p className="text-gray-500 text-lg">No active orders found.</p>
                 </div>
             ) : (
                 <div className="space-y-4">
                     {filteredOrders.map((o) => (
                         <Collapsible key={o._id} asChild>
                             <Card className="bg-[#09090b]/60 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-sm transition-all hover:border-[#FFB800]/20">
                                 <div className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                     <div className="flex-1">
                                         <div className="flex items-center gap-3 mb-2">
                                             <h4 className="text-xl font-bold font-mono text-white">#{o._id.slice(-6).toUpperCase()}</h4>
                                             <Badge className={`uppercase text-[10px] tracking-wider border-0 ${getStatusColor(o.status)}`}>{o.status.replace('-', ' ')}</Badge>
                                         </div>
                                         <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400">
                                             <span className="flex items-center gap-2"><DollarSign className="w-3 h-3 text-[#FFB800]" /> <span className="text-white font-bold">LKR {o.totalAmount?.toFixed(2)}</span></span>
                                             <span className="flex items-center gap-2"><Users className="w-3 h-3" /> {o.userId?.name || "Guest"}</span>
                                             <span className="flex items-center gap-2 text-xs opacity-60 ml-auto lg:ml-0">{new Date(o.createdAt).toLocaleString()}</span>
                                         </div>
                                     </div>
                                     
                                     <div className="flex items-center gap-3 flex-wrap">
                                         <Select value={o.status} onValueChange={(val) => updateOrderStatus(o._id, val)}>
                                            <SelectTrigger className="w-[160px] bg-black/40 border-white/10 focus:border-[#FFB800]/50 h-10 rounded-lg">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#09090b] border-white/10 text-white">
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="preparing">Preparing</SelectItem>
                                                <SelectItem value="on-the-way">On The Way</SelectItem>
                                                <SelectItem value="delivered">Delivered</SelectItem>
                                            </SelectContent>
                                         </Select>
                                         
                                         <div className="h-8 w-[1px] bg-white/10 hidden lg:block mx-1"></div>
                                         
                                         <CollapsibleTrigger asChild>
                                             <Button variant="outline" size="sm" className="h-10 border-white/10 hover:bg-white/5 rounded-lg">
                                                 Details <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                                             </Button>
                                         </CollapsibleTrigger>
                                         
                                         <Button size="sm" variant="ghost" className="h-10 w-10 p-0 rounded-lg hover:bg-red-500/10 hover:text-red-500" onClick={() => {if(window.confirm('Delete order?')) deleteOrder(o._id)}}>
                                             <Trash2 className="w-4 h-4" />
                                         </Button>
                                     </div>
                                 </div>
                                 
                                 <CollapsibleContent>
                                     <div className="px-6 pb-6 pt-0">
                                         <div className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-4">
                                              <div className="flex flex-col md:flex-row justify-between gap-4">
                                                  <div className="flex-1 space-y-2">
                                                      <h6 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Order Items</h6>
                                                      {o.items.map((item, idx) => (
                                                          <div key={idx} className="flex justify-between text-sm py-1 border-b border-white/5 last:border-0">
                                                              <div className="flex items-center gap-2">
                                                                  <Badge variant="outline" className="h-5 w-5 p-0 flex items-center justify-center border-white/20 text-xs bg-black/40 text-gray-400">{item.quantity}</Badge>
                                                                  <span className="text-gray-300">{item.name}</span>
                                                              </div>
                                                              <span className="font-mono text-gray-500">LKR {(item.price * item.quantity).toFixed(2)}</span>
                                                          </div>
                                                      ))}
                                                  </div>
                                                  <div className="w-full md:w-64 space-y-2">
                                                      <h6 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Delivery Details</h6>
                                                      <p className="text-sm text-gray-400 bg-black/20 p-3 rounded-lg border border-white/5">{o.address}</p>
                                                      <Button variant="outline" className="w-full border-[#FFB800]/30 text-[#FFB800] hover:bg-[#FFB800] hover:text-black mt-2" onClick={() => generateBillForOrder(o)} disabled={isDownloading}>
                                                          {isDownloading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Receipt className="w-4 h-4 mr-2" />} Bill Invoice
                                                      </Button>
                                                  </div>
                                              </div>
                                         </div>
                                     </div>
                                 </CollapsibleContent>
                             </Card>
                         </Collapsible>
                     ))}
                 </div>
             )}
          </TabsContent>

          {/* ---------------- REPORTS TAB ---------------- */}
          <TabsContent value="reports" className="space-y-8">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-2 bg-[#FFB800]/10 rounded-lg border border-[#FFB800]/20">
                    <TrendingUp className="w-6 h-6 text-[#FFB800]" />
                 </div>
                 <h3 className="text-2xl font-bold text-white">Analytics & Reports</h3>
              </div>
              <AdminReports orders={orders} products={products} />
          </TabsContent>

          {/* ---------------- USERS TAB ---------------- */}
          <TabsContent value="users">
             <div className="flex items-center justify-between mb-8">
                 <h3 className="text-2xl font-bold">User Database</h3>
                 <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <Input placeholder="Search Users..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="pl-10 bg-[#09090b]/40 border-white/10 rounded-full w-64" />
                 </div>
             </div>
             
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 {filteredUsers.map((u) => (
                     <motion.div key={u._id} layout>
                         <Card className="p-4 bg-[#09090b]/40 border border-white/5 flex items-center gap-4 rounded-2xl hover:border-[#FFB800]/20 transition-all">
                             <div className="relative">
                                 <img 
                                     src={u.profileImage ? `${BASE_URL}${u.profileImage}` : `https://api.dicebear.com/8.x/initials/svg?seed=${u.name}`} 
                                     alt="avatar" 
                                     className="w-14 h-14 rounded-full object-cover border-2 border-white/10"
                                 />
                                 {u.role === 'admin' && <div className="absolute -bottom-1 -right-1 bg-[#FFB800] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-[#09090b]">ADMIN</div>}
                             </div>
                             <div className="flex-1 min-w-0">
                                 <h4 className="font-bold text-white truncate">{u.name}</h4>
                                 <p className="text-xs text-gray-500 truncate">{u.email}</p>
                             </div>
                             <div className="flex flex-col gap-2">
                                 <EditUserDialog user={u} onUpdate={handleUpdateUser} isSaving={isSaving} />
                                 <ConfirmDeleteDialog orderId={u._id} orderSlice="user" onConfirm={handleDeleteUser} />
                             </div>
                         </Card>
                     </motion.div>
                 ))}
             </div>
          </TabsContent>

          {/* ---------------- REWARDS TAB ---------------- */}
          <TabsContent value="challenges">
              <RewardDashboard />
          </TabsContent>

        </Tabs>

      </main>

      {/* Hidden Invoice Template */}
      <div id="invoice-content" style={{ position: 'absolute', left: '-9999px', top: '0', width: '800px', backgroundColor: '#ffffff', color: '#333333', padding: '40px', fontFamily: 'Arial, sans-serif' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '4px solid #f97316', paddingBottom: '15px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img id="invoice-logo" src={LOGO_URL} style={{ height: '60px', marginRight: '15px' }} crossOrigin="anonymous" />
                <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#f97316' }}>BURGER SHOP</span>
            </div>
            <h1 style={{ fontSize: '32px', color: '#666' }}>INVOICE</h1>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
            <div>
                <p style={{ fontWeight: 'bold', color: '#f97316' }}>BILL TO:</p>
                <p style={{ fontWeight: 'bold' }}><span id="invoice-customer-name"></span></p>
                <p><span id="invoice-customer-email"></span></p>
                <p><span id="invoice-address"></span></p>
            </div>
            <div style={{ textAlign: 'right' }}>
                <p><strong>Invoice #:</strong> <span id="invoice-order-id"></span></p>
                <p><strong>Date:</strong> <span id="invoice-date"></span></p>
                <p style={{ marginTop: '10px', fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>PAID</p>
            </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px' }}>
            <thead>
                <tr style={{ backgroundColor: '#f97316', color: '#ffffff' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>ITEM</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>QTY</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>PRICE</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>TOTAL</th>
                </tr>
            </thead>
            <tbody id="invoice-item-body"></tbody>
        </table>
        <div style={{ float: 'right', width: '50%', fontSize: '16px', lineHeight: '2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal:</span><span id="invoice-subtotal" style={{ fontWeight: 'bold' }}></span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Delivery:</span><span id="invoice-delivery" style={{ fontWeight: 'bold' }}></span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#eab308' }}><span>Discount:</span><span id="invoice-discount" style={{ fontWeight: 'bold' }}></span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #333', marginTop: '10px', paddingTop: '10px', fontSize: '20px', fontWeight: 'bold' }}><span>TOTAL:</span><span id="invoice-total" style={{ color: '#f97316' }}></span></div>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
