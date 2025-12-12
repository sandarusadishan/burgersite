import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Package, Truck, CheckCircle, Clock, ArrowLeft, Phone, ChevronDown, Utensils, Calendar, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar'; 
import { useAuth } from '../contexts/AuthContext';

const BASE_URL = 'https://grilmelt-burger.onrender.com';
const API_URL = `${BASE_URL}/api`;
const ADMIN_PHONE = '077 123 4567';

const OrderTracking = () => {
  const [orders, setOrders] = useState([]);
  // UI State for expanding orders (replacing Collapsible for smoother animation)
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const { user, isAuthenticated } = useAuth(); 

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated || !user || !user._id) {
        setOrders([]);
        return; 
      }

      try {
        const res = await fetch(`${API_URL}/orders/user/${user._id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`, 
          },
        });
        const data = await res.json();

        if (res.ok) {
          setOrders(data); 
        } else {
          console.error('Failed to fetch orders:', data.message);
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrders([]);
      }
    };

    fetchOrders();
  }, [isAuthenticated, user]);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { icon: <Clock className="w-5 h-5" />, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-white/10', text: 'Pending' };
      case 'preparing':
        return { icon: <Utensils className="w-5 h-5 animate-pulse" />, color: 'text-[#FFB800]', bg: 'bg-[#FFB800]/10', border: 'border-[#FFB800]/20', text: 'Preparing' };
      case 'on-the-way':
        return { icon: <Truck className="w-5 h-5 animate-bounce" />, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'On The Way' };
      case 'delivered':
        return { icon: <CheckCircle className="w-5 h-5" />, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'Delivered' };
      default:
        return { icon: <Package className="w-5 h-5" />, color: 'text-gray-400', bg: 'bg-gray-500/10', border: 'border-white/10', text: status };
    }
  };

  const isCancellable = (status) => status === 'pending' || status === 'preparing';

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FFB800] selection:text-black relative overflow-hidden">
      {/* 🌟 Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#FFB800]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <Navbar />
      <main className="container max-w-5xl px-4 pt-48 pb-20 mx-auto relative z-10">
        
        {/* ✨ Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 mt-8"
        >
          <div className="inline-block relative mb-4">
            <div className="absolute inset-0 bg-[#FFB800] blur-xl opacity-20 animate-pulse"></div>
            <Badge className="relative bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md shadow-[0_0_15px_-3px_rgba(255,184,0,0.3)]">
              Order History
            </Badge>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-4 relative z-10 drop-shadow-xl">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FFD600] to-yellow-600 drop-shadow-[0_0_35px_rgba(255,184,0,0.5)]">Orders</span>
          </h1>
          
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent mx-auto rounded-full mb-4 opacity-80 shadow-[0_0_10px_#FFB800]"></div>

          <p className="text-gray-400 max-w-lg mx-auto text-sm md:text-base font-medium leading-relaxed tracking-wide">
            Track your deliveries in real-time and review your past favorites.
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-24 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm relative overflow-hidden group"
          >
             <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
            
            <div className="w-20 h-20 bg-[#FFB800]/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_-10px_rgba(255,184,0,0.3)] group-hover:scale-110 transition-transform duration-500 relative z-10">
               <Package className="w-10 h-10 text-[#FFB800]" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-white relative z-10">No orders yet</h2>
            <p className="max-w-sm mb-8 text-gray-400 leading-relaxed relative z-10">Your culinary journey is just a click away. Start your first order now!</p>
            <Link to="/menu" className="relative z-10">
              <Button size="lg" className="h-12 px-8 bg-[#FFB800] text-black font-extrabold rounded-xl hover:bg-[#E5A600] tracking-wider uppercase shadow-[0_0_20px_-5px_rgba(255,184,0,0.4)] hover:shadow-[0_0_30px_-5px_rgba(255,184,0,0.6)] transition-all transform hover:-translate-y-1">
                Explore Menu
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-5">
            {orders.map((order, index) => {
              const status = getStatusInfo(order.status);
              const isExpanded = expandedOrderId === order._id;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={order._id}
                >
                  <Card className={`overflow-hidden border transition-all duration-300 relative ${isExpanded ? 'bg-[#09090b]/90 border-[#FFB800]/40 shadow-[0_0_50px_-10px_rgba(255,184,0,0.15)] scale-[1.01]' : 'bg-[#09090b]/40 border-white/5 hover:border-white/10 hover:bg-[#09090b]/60'}`}>
                    
                    {/* Active Border Gradient for Expanded */}
                    {isExpanded && <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#FFB800] to-transparent opacity-50" />}

                    {/* 🟢 Main Card Row */}
                    <div className="p-6 md:p-7 cursor-pointer" onClick={() => toggleExpand(order._id)}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            
                            {/* Left: Order Info */}
                            <div className="flex items-start gap-4">
                                <div className={`p-3 rounded-2xl ${status.bg} border ${status.border} hidden sm:flex shadow-lg backdrop-blur-md`}>
                                    {status.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1.5">
                                        <h3 className="text-xl font-bold text-white tracking-tight">
                                            Order <span className="text-[#FFB800] font-black font-mono tracking-wider">#{order._id.slice(-6).toUpperCase()}</span>
                                        </h3>
                                        {/* Mobile Status Badge */}
                                        <Badge className={`sm:hidden ${status.bg} ${status.color} border-0 text-[10px] uppercase font-bold px-2 py-0.5`}>
                                            {status.text}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                        <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Middle: Status Badge (Desktop) */}
                            <div className="hidden sm:flex items-center">
                                <Badge className={`${status.bg} ${status.color} border ${status.border} px-4 py-1.5 text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md`}>
                                    {status.text}
                                </Badge>
                            </div>

                            {/* Right: Price & Icon */}
                            <div className="flex items-center justify-between md:justify-end gap-6 min-w-[140px]">
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-0.5">Total</p>
                                    <p className="text-xl font-black text-white">
                                        <span className="text-[#FFB800] text-sm mr-1 font-bold">LKR</span>
                                        {order.totalAmount.toFixed(2)}
                                    </p>
                                </div>
                                <div className={`w-9 h-9 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${isExpanded ? 'bg-[#FFB800]/20 text-[#FFB800] rotate-180 border-[#FFB800]/30' : 'bg-transparent text-gray-400 group-hover:border-white/20'}`}>
                                    <ChevronDown className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 🟡 Expanded Section */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                <div className="px-6 md:px-8 pb-8 pt-2 relative">
                                    {/* Separator */}
                                    <div className="absolute top-0 left-6 right-6 h-[1px] bg-white/5" />
                                    
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
                                        
                                        {/* Column 1: Items */}
                                        <div className="lg:col-span-2 space-y-4">
                                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                                                <Utensils className="w-3.5 h-3.5 text-[#FFB800]" /> Purchased Items
                                            </h4>
                                            <div className="grid gap-3">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors group/item">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-[#09090b] flex items-center justify-center border border-white/10 text-[#FFB800] font-black text-xs shadow-inner group-hover/item:border-[#FFB800]/30 transition-colors">
                                                                {item.quantity}x
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-200 group-hover/item:text-white transition-colors">{item.name}</span>
                                                        </div>
                                                        <span className="text-sm font-bold text-white font-mono">LKR {(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Column 2: Details & Actions */}
                                        <div className="space-y-6">
                                            
                                            {/* Address Box */}
                                            <div>
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 mb-4">
                                                    <MapPin className="w-3.5 h-3.5 text-[#FFB800]" /> Delivery to
                                                </h4>
                                                <div className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 hover:border-white/20 transition-colors">
                                                    <p className="text-sm font-medium text-gray-300 leading-relaxed font-mono">
                                                        {order.address}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Cancel Action */}
                                            {isCancellable(order.status) && (
                                                <div className="pt-4 border-t border-white/5">
                                                     <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10 backdrop-blur-md space-y-4 hover:bg-red-500/10 transition-colors">
                                                        <div className="flex items-center gap-2 text-red-400">
                                                            <Phone className="w-4 h-4 animate-pulse" />
                                                            <span className="text-xs font-bold uppercase tracking-wider">Urgent Support</span>
                                                        </div>
                                                        <p className="text-[11px] text-gray-400 leading-relaxed">
                                                            Need to update or cancel? Please contact the admin immediately as preparation starts quickly.
                                                        </p>
                                                        <a href={`tel:${ADMIN_PHONE}`} className="block">
                                                            <Button variant="destructive" size="sm" className="w-full font-bold shadow-[0_4px_14px_0_rgba(239,68,68,0.39)] hover:shadow-[0_6px_20px_rgba(239,68,68,0.23)] hover:bg-red-600 transition-all rounded-xl h-10">
                                                                Call {ADMIN_PHONE}
                                                            </Button>
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderTracking;
