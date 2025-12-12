import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { Badge } from '../components/ui/badge'; 
import {
  Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Loader2, Receipt, Tag, X, CreditCard, Banknote, Landmark, ShieldCheck, Sparkles, MapPin, Wallet 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';
import BankDepositInfoDialog from '../components/BankDepositInfoDialog'; 
import { motion, AnimatePresence } from 'framer-motion';

// PDF Libraries 
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const DELIVERY_FEE = 350.0;
const BASE_URL = 'https://grilmelt-burger.onrender.com';
const API_URL = `${BASE_URL}/api`;
const LOGO_URL = `/logo.png`; 

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const { user, isAuthenticated } = useAuth(); 
  const { toast } = useToast();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState('cash'); 
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0); 
  const [appliedCoupon, setAppliedCoupon] = useState(null); 
  const [isApplying, setIsApplying] = useState(false);

  const [isBankInfoOpen, setIsBankInfoOpen] = useState(false);
  const [completedOrderInfo, setCompletedOrderInfo] = useState(null);

  // --- PDF Logic ---
  const generateBill = async (order, customer) => { 
    setIsDownloading(true);
    const invoiceElement = document.getElementById('invoice-content');

    // Dynamic Data Populate
    document.getElementById('invoice-order-id').textContent = `#${order.id.slice(-6)}`;
    document.getElementById('invoice-customer-name').textContent = customer.name;
    document.getElementById('invoice-customer-email').textContent = customer.email;
    document.getElementById('invoice-address').textContent = order.address;
    document.getElementById('invoice-date').textContent = new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    
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

    // Summary totals set
    document.getElementById('invoice-subtotal').textContent = `LKR ${total.toFixed(2)}`;
    document.getElementById('invoice-delivery').textContent = `LKR ${DELIVERY_FEE.toFixed(2)}`;
    document.getElementById('invoice-discount').textContent = `- LKR ${discountAmount.toFixed(2)}`; 
    document.getElementById('invoice-total').textContent = `LKR ${order.total.toFixed(2)}`;
    
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
        pdf.save(`Order_Invoice_${order.id.slice(-6)}.pdf`);
        
        toast({ title: '📥 Download Complete', description: 'Your invoice has been downloaded.', duration: 2000, className: "bg-[#09090b] text-white" });
    } catch (error) {
        console.error("PDF Generation Error:", error);
        toast({ title: '❌ Download Failed', description: 'Could not generate PDF invoice.', variant: 'destructive', duration: 2000 });
    } finally {
        setIsDownloading(false);
    }
  };


  // --- Coupon Apply Logic ---
  const handleApplyCoupon = async () => {
    if (!isAuthenticated || !user?.token) {
        toast({ title: 'Login Required', description: 'Please log in to use a coupon.', variant: 'destructive', duration: 2000 });
        return;
    }
    if (!couponCode.trim()) {
        toast({ title: 'Missing Code', description: 'Please enter a coupon code.', variant: 'destructive', duration: 2000 });
        return;
    }
    
    setIsApplying(true);

    try {
        const res = await fetch(`${API_URL}/orders/apply-coupon`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({ 
                code: couponCode.trim().toUpperCase(),
                cartTotal: total 
            }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
            setDiscountAmount(data.discount);
            setAppliedCoupon({ id: data.couponId, code: couponCode.trim().toUpperCase(), amount: data.discount, prizeName: data.prizeName });
            
            toast({ 
                title: `🎉 Coupon Applied!`, 
                description: `${data.prizeName} applied successfully! Discount: LKR ${data.discount.toFixed(2)}`,
                duration: 5000,
                className: "bg-[#09090b] text-white"
            });
        } else {
            setDiscountAmount(0);
            setAppliedCoupon(null);
            toast({ title: '❌ Invalid Code', description: data.message || 'Coupon could not be applied.', variant: 'destructive', duration: 2000 });
        }
    } catch (error) {
        setDiscountAmount(0);
        setAppliedCoupon(null);
        toast({ title: 'Network Error', description: 'Could not connect to server.', variant: 'destructive', duration: 2000 });
    } finally {
        setIsApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
      setCouponCode('');
      setDiscountAmount(0);
      setAppliedCoupon(null);
      toast({ title: 'Coupon Removed', description: 'Discount has been reverted.', duration: 2000 });
  }

  // --- Checkout Logic ---
  const handleCheckout = async () => {
    setIsCheckingOut(true);
    
    if (!isAuthenticated) { 
        toast({ title: 'Login Required', description: 'Please log in to place an order.', variant: 'destructive', duration: 2000 });
        navigate('/auth');
        setIsCheckingOut(false);
        return;
    }
    if (!address.trim()) { 
        toast({ title: 'Please enter delivery address', variant: 'destructive', duration: 2000 });
        setIsCheckingOut(false);
        return;
    }

    if (paymentMethod === 'card') {
        toast({ title: 'Coming Soon!', description: 'Card payment functionality is not yet implemented.', variant: 'secondary', duration: 3000 });
        setIsCheckingOut(false);
        return;
    }


    const finalTotal = total + DELIVERY_FEE - discountAmount;

    const orderData = {
      items: items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      total: finalTotal,
      userId: user._id, 
      address,
      paymentMethod: paymentMethod, 
      couponId: appliedCoupon ? appliedCoupon.id : null, 
    };

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`, 
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order.');
      }

      const createdOrder = {
        id: data.orderId,
        items: orderData.items,
        total: orderData.total,
        address: orderData.address,
        createdAt: new Date().toISOString(),
      };
      
      await generateBill(createdOrder, user); 

      if (paymentMethod === 'deposit') {
        setCompletedOrderInfo({ orderId: data.orderId, totalAmount: finalTotal });
        setIsBankInfoOpen(true);
      } else { 
        clearCart();
        setDiscountAmount(0); 
        setAppliedCoupon(null);
        setCouponCode(''); 
        toast({ title: '🎉 Order placed successfully!', description: `Order ID: ${data.orderId.slice(-6)}`, duration: 2000, className: "bg-[#09090b] text-white" });
      }

      if (paymentMethod !== 'deposit') navigate('/orders');
      
    } catch (error) {
      console.error('Checkout error:', error);
      toast({ title: '❌ Checkout Failed', description: error.message, variant: 'destructive', duration: 2000 });
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleBankDialogClose = () => {
    setIsBankInfoOpen(false);
    clearCart();
    setDiscountAmount(0);
    setAppliedCoupon(null);
    setCouponCode('');
    navigate('/orders');
  }


  // 🛒 Empty cart UI
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FFB800] selection:text-black">
        <Navbar />
        <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-10 mx-auto text-center">
            
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
              <div className="p-8 bg-[#09090b] rounded-full border border-white/5 mb-6 relative group">
                  <div className="absolute inset-0 bg-[#FFB800]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <ShoppingBag className="w-16 h-16 text-gray-600 group-hover:text-[#FFB800] transition-colors" />
              </div>
              <h2 className="mb-2 text-3xl font-bold text-white tracking-tight">Your cart is empty</h2>
              <p className="max-w-sm mb-8 text-sm text-gray-500">Looks like you haven't added any burgers yet. Let's find something delicious.</p>
              <Button
                onClick={() => navigate('/menu')}
                size="lg"
                className="bg-[#FFB800] text-black hover:bg-[#FFD600] font-bold rounded-lg px-8"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Menu
              </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // 🧾 Cart UI
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FFB800] selection:text-black relative overflow-x-hidden">
      {/* 🌟 Ambient Background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FFB800]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />
      
      <main className="container px-4 pt-32 pb-20 mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
           <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white drop-shadow-xl mb-1">
             Shopping <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] to-yellow-600">Cart</span>
           </h1>
           <p className="text-gray-400 text-sm">Review your selected items</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
          
          {/* 🧍 Cart Items (Clean & Compact) */}
          <div className="space-y-4 lg:col-span-2">
            <AnimatePresence>
                {items.map((item, index) => (
                <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: index * 0.05 }}
                >
                    <div className="bg-[#09090b]/80 border border-white/5 hover:border-[#FFB800]/30 rounded-2xl p-3 flex items-center gap-4 group transition-all duration-300">
                        
                        {/* Compact Image */}
                        <div className="w-20 h-20 bg-[#121214] rounded-xl overflow-hidden shrink-0 border border-white/5 relative">
                             <img src={`${BASE_URL}${item.image}`} alt={item.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-white uppercase truncate">{item.name}</h3>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">Light Meal</p>
                            <p className="text-[#FFB800] font-mono text-xs font-bold mt-1">LKR {item.price}</p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-3">
                             <div className="flex items-center gap-2 bg-black/40 rounded-lg p-1 border border-white/5">
                                 <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-gray-400 transition-colors">
                                     <Minus className="w-3 h-3"/>
                                 </button>
                                 <span className="w-4 text-center text-xs font-mono font-bold text-white">{item.quantity}</span>
                                 <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-gray-400 transition-colors">
                                     <Plus className="w-3 h-3"/>
                                 </button>
                             </div>
                             
                             <div className="text-right min-w-[80px]">
                                 <p className="text-sm font-black text-white font-mono">LKR {(item.price * item.quantity).toFixed(0)}</p>
                             </div>

                             <button onClick={() => removeItem(item.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                                 <Trash2 className="w-4 h-4"/>
                             </button>
                        </div>
                    </div>
                </motion.div>
                ))}
            </AnimatePresence>
          </div>

          {/* 💳 Order Summary - Clean Glass Panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <Card className="sticky top-24 p-6 bg-[#09090b]/80 border border-white/5 rounded-3xl backdrop-blur-md">
              <h2 className="text-base font-bold text-white flex items-center gap-2 mb-6 uppercase tracking-wider">
                 <ShieldCheck className="w-4 h-4 text-[#FFB800]" /> Order Summary
              </h2>

              {/* Coupon */}
              <div className="mb-6 space-y-2">
                 <div className="flex gap-2">
                     <Input 
                        placeholder="ENTER COUPON..." 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="bg-black/40 border-white/10 text-xs h-9 focus:border-[#FFB800]/50 font-mono uppercase rounded-lg"
                        disabled={!!appliedCoupon}
                     />
                     {appliedCoupon ? (
                         <Button onClick={handleRemoveCoupon} size="icon" variant="destructive" className="h-9 w-9 rounded-lg"><X className="w-4 h-4"/></Button>
                     ) : (
                         <Button onClick={handleApplyCoupon} size="sm" className="h-9 bg-white/5 hover:bg-white/10 text-white border border-white/5 rounded-lg text-xs font-bold">APPLY</Button>
                     )}
                 </div>
                 {appliedCoupon && <p className="text-[10px] text-green-400 text-center">Coupon Applied: -LKR {discountAmount}</p>}
              </div>
              
              {/* Calculations */}
              <div className="space-y-3 py-4 border-t border-white/5 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-mono text-white">LKR {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery</span>
                  <span className="font-mono text-white">LKR {DELIVERY_FEE.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                    <div className="flex justify-between text-[#FFB800]">
                        <span>Discount</span>
                        <span className="font-mono">- LKR {discountAmount.toFixed(2)}</span>
                    </div>
                )}
                
                <div className="flex justify-between pt-4 mt-2 border-t border-white/5 items-end">
                  <span className="text-sm font-bold text-white">Total</span>
                  <span className="text-xl font-black text-[#FFB800] font-mono">
                    LKR {(total + DELIVERY_FEE - discountAmount).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Address */}
              <div className="mt-6 mb-8">
                <Label className="text-[10px] uppercase font-bold text-gray-500 mb-2 flex items-center gap-1.5 ml-1">
                    <MapPin className="w-3 h-3 text-[#FFB800]"/> Delivery Address
                </Label>
                <Input
                  placeholder="Street address, Layout..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="bg-black/40 border-white/10 focus:border-[#FFB800]/50 h-10 text-xs rounded-xl text-white px-4 transition-all hover:border-white/20"
                />
              </div>

              {/* Separator */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />
              
              {/* Payment Method - Clean Tiles */}
              <div className="space-y-4">
                <Label className="text-[10px] uppercase font-bold text-gray-500 mb-2 flex items-center gap-1.5 ml-1">
                    <Wallet className="w-3 h-3 text-[#FFB800]"/> Payment Method
                </Label>
                <RadioGroup defaultValue="cash" value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-3 gap-2">
                   {['cash', 'card', 'deposit'].map((method) => (
                       <Label key={method} className={`cursor-pointer rounded-xl border p-2 flex flex-col items-center justify-center gap-1 transition-all duration-200 ${paymentMethod === method ? 'bg-white/10 border-[#FFB800] text-white' : 'bg-black/20 border-white/5 text-gray-500 hover:bg-white/5'}`}>
                           <RadioGroupItem value={method} id={method} className="hidden" />
                           {method === 'cash' && <Banknote className="w-4 h-4" />}
                           {method === 'card' && <CreditCard className="w-4 h-4" />}
                           {method === 'deposit' && <Landmark className="w-4 h-4" />}
                           <span className="text-[9px] uppercase font-bold tracking-wider">{method}</span>
                       </Label>
                   ))}
                </RadioGroup>

                 <AnimatePresence>
                    {paymentMethod === 'card' && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }} 
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-3 mt-2 bg-black/40 border border-white/5 rounded-xl space-y-2">
                                <Input placeholder="Card Number" className="bg-black border-white/10 h-8 text-[10px] rounded-lg text-white font-mono" />
                                <div className="grid grid-cols-2 gap-2">
                                    <Input placeholder="MM/YY" className="bg-black border-white/10 h-8 text-[10px] rounded-lg text-white text-center font-mono" />
                                    <Input placeholder="CVC" className="bg-black border-white/10 h-8 text-[10px] rounded-lg text-white text-center font-mono" />
                                </div>
                                <Input placeholder="Cardholder Name" className="bg-black border-white/10 h-8 text-[10px] rounded-lg text-white uppercase" />
                            </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full mt-6 bg-[#FFB800] text-black hover:bg-[#FFD600] font-bold rounded-xl h-10 text-xs shadow-lg shadow-[#FFB800]/20"
                disabled={isCheckingOut || items.length === 0 || isDownloading}
              >
                {isCheckingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : 'CHECKOUT NOW'}
              </Button>
            </Card>
          </motion.div>
        </div>
      </main>

      {/* ✅ Bank Deposit Info Dialog */}
      {completedOrderInfo && (
        <BankDepositInfoDialog 
          isOpen={isBankInfoOpen}
          onOpenChange={handleBankDialogClose}
          {...completedOrderInfo}
        />
      )}

      {/* 🛑 Hidden Invoice Content for PDF Generation 🛑 */}
      <div 
        id="invoice-content"
        style={{
            position: 'absolute',
            left: '-9999px',
            top: '0',
            width: '800px', 
            backgroundColor: '#ffffff',
            color: '#333333',
            padding: '40px',
            fontFamily: 'Arial, sans-serif',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}
      >
        {/* Invoice Header (Logo and Title) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '4px solid #f97316', paddingBottom: '15px', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img id="invoice-logo" src={LOGO_URL} alt="BurgerShop Logo" style={{ height: '60px', marginRight: '15px', objectFit: 'contain' }} crossOrigin="anonymous" />
                <span style={{ fontSize: '36px', fontWeight: 'bold', color: '#f97316' }}>BURGER SHOP</span>
            </div>
            <h1 style={{ fontSize: '32px', color: '#666', fontWeight: '300' }}>SALES INVOICE</h1>
        </div>
        
        {/* Customer & Order Details */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
            <div style={{ lineHeight: '1.8', fontSize: '14px' }}>
                <p style={{ fontWeight: 'bold', color: '#f97316', marginBottom: '5px' }}>BILL TO:</p>
                <p style={{ fontWeight: 'bold' }}><span id="invoice-customer-name"></span></p>
                <p><span id="invoice-customer-email"></span></p>
                <p>Delivery Address: <span id="invoice-address"></span></p>
            </div>
            <div style={{ lineHeight: '1.8', fontSize: '14px', textAlign: 'right' }}>
                <p style={{ fontSize: '16px' }}><strong>Invoice #:</strong> <span id="invoice-order-id"></span></p>
                <p style={{ fontSize: '16px' }}><strong>Invoice Date:</strong> <span id="invoice-date"></span></p>
                <p style={{ marginTop: '10px', fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>STATUS: PENDING</p>
            </div>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '40px', fontSize: '14px' }}>
            <thead>
                <tr style={{ backgroundColor: '#f97316', color: '#ffffff' }}>
                    <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', border: 'none' }}>ITEM DESCRIPTION</th>
                    <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', border: 'none' }}>QTY</th>
                    <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', border: 'none' }}>UNIT PRICE</th>
                    <th style={{ padding: '12px 15px', textAlign: 'left', fontWeight: 'bold', border: 'none' }}>AMOUNT</th>
                </tr>
            </thead>
            <tbody id="invoice-item-body" style={{ color: '#333' }}>
                {/* Rows are dynamically inserted by generateBill() */}
            </tbody>
        </table>
        
        {/* Totals Section */}
        <div style={{ float: 'right', width: '50%', fontSize: '16px', lineHeight: '2' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                <span>Subtotal:</span>
                <span id="invoice-subtotal" style={{ fontWeight: 'bold' }}></span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                <span>Delivery Fee:</span>
                <span id="invoice-delivery" style={{ fontWeight: 'bold' }}></span>
            </div>
             {/* ✅ Discount Line Added to PDF */}
             <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: '#eab308' }}>
                <span>Coupon Discount:</span>
                <span id="invoice-discount" style={{ fontWeight: 'bold' }}></span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderTop: '2px solid #333', marginTop: '15px', fontSize: '22px', fontWeight: 'bolder' }}>
                <span>GRAND TOTAL (LKR):</span>
                <span id="invoice-total" style={{ color: '#f97316' }}></span>
            </div>
        </div>
        
        {/* Footer Note */}
        <div style={{ clear: 'both', paddingTop: '60px', textAlign: 'center', fontSize: '12px', color: '#666', borderTop: '1px solid #eee', marginTop: '40px' }}>
            <p>Payment due upon receipt. Thank you for choosing BurgerShop!</p>
        </div>
      </div>
    </div>
  );
};

export default Cart;