/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ShoppingCart, Search, Check, XCircle, Filter, ArrowUpDown, ChevronDown, Plus, Minus, Star, Flame, Droplets } from 'lucide-react'; 
import Navbar from '../components/Navbar';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import {
    RadioGroup,
    RadioGroupItem
} from "../components/ui/radio-group"
import { Label } from "../components/ui/label"
import { Checkbox } from "../components/ui/checkbox"

// 🎯 Backend Constants
const BASE_URL = "https://grilmelt-burger.onrender.com";
const API_URL = `${BASE_URL}/api`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }, 
  },
};
const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};


// 🍔 BurgerCard Component
const BurgerCard = ({ product, onClick }) => {
  return (
    <motion.div
    layout
    className="flex h-full [perspective:1000px] group/card cursor-pointer"
    variants={itemVariants}
    onClick={() => onClick(product)}
    >
    <Card className="relative flex flex-col w-full h-full overflow-hidden transition-all duration-500 bg-[#09090b] border border-white/5 hover:border-[#FFB800]/50 hover:[transform:rotateX(2deg)_rotateY(2deg)] shadow-lg hover:shadow-[0_0_40px_-10px_rgba(255,184,0,0.2)] rounded-3xl group-hover/card:z-10">
      <div className="relative overflow-hidden h-52 flex-shrink-0">
        <img
          src={`${BASE_URL}${product.image}`}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover/card:scale-110"
        />
        <div className="absolute top-3 right-3 z-20">
          <Badge className="bg-black/60 backdrop-blur-md text-[#FFB800] border border-[#FFB800]/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
            {product.category}
          </Badge>
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-80" />
      </div>

      <div className="flex flex-col flex-1 p-5 space-y-3 relative">
        <div className="space-y-1 flex-1">
            {/* Fixed height container for Title */}
            <div className="h-7 mb-1 flex items-center">
                <h3 className="text-lg font-bold text-white leading-tight group-hover/card:text-[#FFB800] transition-colors line-clamp-1">{product.name}</h3>
            </div>
            {/* Fixed height container for Description */}
            <div className="h-9">
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{product.description}</p>
            </div>
        </div>

        <div className="flex items-center justify-between pt-4 mt-auto border-t border-white/10">
          <span className="text-lg font-bold text-white tracking-tight">
            <span className="text-[#FFB800] text-xs align-top mr-1">LKR</span>
            {Number(product.price).toFixed(2)}
          </span>
          <Button
            size="sm"
            className="h-9 px-4 font-bold rounded-xl bg-[#FFB800] text-black hover:bg-[#E5A600] shadow-[0_0_20px_-5px_rgba(255,184,0,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,184,0,0.5)] hover:-translate-y-0.5 transition-all duration-300 text-xs"
          >
             <Plus className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>
      </div>
    </Card>
  </motion.div>
  );
};


// 🍔 Main Menu Page
const Menu = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [modifiers, setModifiers] = useState({}); // { extraCheese: true, size: 'large' }
  
  // 🔘 Tabbed Navigation State (Defaults to 'Premium')
  const [activeCategory, setActiveCategory] = useState('Premium');

  const { addItem } = useCart();
  const { toast } = useToast();

  // 🎯 Fetch Data from Backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        if (!res.ok) {
          throw new Error("Failed to fetch menu items from server.");
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Failed to load menu. Please check the backend server.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Open Modal Handler
  const openProductModal = (product) => {
    setSelectedProduct(product);
    setQuantity(1);
    // Initialize default modifiers based on category
    if (product.category.toLowerCase().includes('drink')) {
        setModifiers({ size: 'regular' });
    } else {
        setModifiers({});
    }
    setIsModalOpen(true);
  };

  // Add to Cart Logic
  const handleAddToCart = () => {
    if (!selectedProduct) return;

    // Calculate total price with modifiers
    let finalPrice = Number(selectedProduct.price);
    let description = selectedProduct.name;

    // Apply modifier costs
    if (modifiers.extraCheese) {
        finalPrice += 150;
        description += " + Extra Cheese";
    }
    if (modifiers.size === '1l') {
        finalPrice += 200;
        description += " (1L)";
    }
    if (modifiers.size === '2l') {
        finalPrice += 350;
        description += " (2L)";
    }
     if (modifiers.size === 'regular') {
        description += " (Regular)";
    }


    addItem({
      id: selectedProduct._id,
      name: description,
      price: finalPrice,
      image: selectedProduct.image,
      quantity: quantity
    });

    toast({ 
        title: "Added to Order",
        description: `${description} x${quantity} added to cart.`,
        duration: 2000,
        className: "bg-[#09090b] border border-[#FFB800]/20 text-white"
    });
    setIsModalOpen(false);
  };


  // Group Products by Category
  const groupedProducts = products.reduce((acc, product) => {
    // Normalize Category Name
    let cat = product.category || 'Other';
    // Capitalize
    cat = cat.charAt(0).toUpperCase() + cat.slice(1);
    
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {});
  
  // 🏆 Create "Premium" Category (Top items by price/quality)
  const premiumProducts = [...products]
    .sort((a, b) => Number(b.price) - Number(a.price))
    .slice(0, 8); // Top 8 most expensive items

  // Add 'Premium' to groupedProducts
  const finalGroupedProducts = { ...groupedProducts, 'Premium': premiumProducts };

  // Sort categories: Premium first, then Burgers, etc.
  const categoryOrder = ['Premium', 'Burgers', 'Submarines', 'Drinks', 'Sides'];
  const sortedCategories = Object.keys(finalGroupedProducts).sort((a, b) => {
      const indexA = categoryOrder.indexOf(a);
      const indexB = categoryOrder.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
  });

  const SkeletonCard = () => (
    <div className="p-4 space-y-4 rounded-xl bg-[#09090b] border border-white/5 h-[400px] flex flex-col">
      <div className="w-full h-48 rounded-lg bg-white/5 animate-pulse"></div>
      <div className="space-y-2 flex-1">
         <div className="w-3/4 h-6 rounded bg-white/5 animate-pulse"></div>
         <div className="w-full h-4 rounded bg-white/5 animate-pulse"></div>
         <div className="w-1/2 h-4 rounded bg-white/5 animate-pulse"></div>
      </div>
      <div className="flex items-center justify-between pt-4">
        <div className="w-20 h-8 rounded bg-white/5 animate-pulse"></div>
        <div className="w-24 h-10 rounded bg-white/5 animate-pulse"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <Navbar />
        <main className="container px-4 py-28 mx-auto">
          <div className="w-full h-32 mb-12 rounded-2xl bg-white/5 animate-pulse"></div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </main>
      </div>
    );
  }

  // Define categories that have matching products
  const availableCategories = sortedCategories;

  // Determine what to display: Look at Search OR Active Tab
  let displayCategory = activeCategory;
  let displayProducts = finalGroupedProducts[activeCategory] || [];

  // If search is active, we ignore tabs and show ALL matches
  const isSearching = search.length > 0;
  let searchResults = [];
  if (isSearching) {
      searchResults = products.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase()) || 
          p.description.toLowerCase().includes(search.toLowerCase())
      );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FFB800] selection:text-black">
      <Navbar />
      <main className="container px-4 pt-28 pb-16 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10"
        >
          <div className="mb-8 text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white drop-shadow-xl relative z-10">
              Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] to-yellow-600 drop-shadow-[0_0_20px_rgba(255,184,0,0.3)]">Menu</span>
            </h1>
            
            {/* 🔍 Simple Centered Search */}
            <div className="max-w-md mx-auto relative group mt-8 text-left">
                <Search className="absolute w-5 h-5 transform -translate-y-1/2 left-4 top-1/2 text-gray-500 group-focus-within:text-[#FFB800] transition-colors" />
                <Input
                  placeholder="Search for your cravings..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#FFB800]/50 focus:bg-white/10 rounded-full transition-all shadow-lg text-base"
                />
            </div>
            
            {/* 📍 Tabbed Navigation Pills (Hidden if searching) */}
            {!isSearching && (
                <div className="sticky top-[80px] z-40 py-4 flex items-center justify-center gap-2 flex-wrap bg-[#050505]/80 backdrop-blur-xl border-b border-white/5 -mx-4 px-4 shadow-[0_4px_30px_-5px_rgba(0,0,0,0.5)]">
                    {availableCategories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 ${
                                activeCategory === category
                                    ? 'bg-[#FFB800] text-black shadow-[0_0_20px_-5px_rgba(255,184,0,0.5)] border border-[#FFB800]'
                                    : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            {category === 'Premium' && <Star className="w-3 h-3 fill-current" />}
                            {category}
                        </button>
                    ))}
                </div>
            )}
          </div>
        </motion.div>

        {/* 🍔 Product Grid Area */}
        <div className="min-h-[400px]">
            {/* CASE 1: SEARCH RESULTS */}
            {isSearching ? (
                <div>
                     <motion.h2 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="text-2xl font-bold text-white mb-6 flex items-center gap-2"
                     >
                        <Search className="w-6 h-6 text-[#FFB800]" />
                        Search Results ({searchResults.length})
                     </motion.h2>
                    
                     {searchResults.length > 0 ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            key="search-grid"
                            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            <AnimatePresence>
                                {searchResults.map((product) => (
                                    <BurgerCard key={product._id} product={product} onClick={openProductModal}/>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                     ) : (
                        <div className="text-center py-20">
                             <p className="text-gray-400 text-lg">No matches found for "{search}"</p>
                             <Button variant="link" onClick={() => setSearch('')} className="text-[#FFB800] mt-2">Clear Search</Button>
                        </div>
                     )}
                </div>
            ) : (
                /* CASE 2: TABBED CATEGORY VIEW */
                <motion.div
                    key={activeCategory} // Key change triggers animation
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, type: 'tween', ease: 'easeOut' }}
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#FFB800]/50 to-transparent opacity-50"></div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-wider drop-shadow-lg flex items-center gap-3">
                            {activeCategory === 'Premium' && <Star className="w-8 h-8 text-[#FFB800] fill-current" />}
                            {activeCategory === 'Burgers' && <Flame className="w-8 h-8 text-[#FFB800]" />}
                            {activeCategory === 'Drinks' && <Droplets className="w-8 h-8 text-blue-400" />}
                            {activeCategory}
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#FFB800]/50 to-transparent opacity-50"></div>
                    </div>

                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    >
                        <AnimatePresence mode='popLayout'>
                            {displayProducts.map((product) => (
                                <BurgerCard key={product._id} product={product} onClick={openProductModal}/>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </div>

        {/* 🛒 Product Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="bg-[#09090b]/95 backdrop-blur-3xl border border-white/10 text-white p-0 gap-0 overflow-hidden max-w-4xl w-[95vw] rounded-3xl shadow-[0_0_100px_-20px_rgba(255,184,0,0.2)]">
                {selectedProduct && (
                    <div className="flex flex-col md:flex-row h-full max-h-[85vh] md:max-h-[600px]">
                        {/* Left: Image Side */}
                        <div className="w-full md:w-1/2 relative bg-black/50 overflow-hidden group">
                             <img 
                                src={`${BASE_URL}${selectedProduct.image}`} 
                                alt={selectedProduct.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent"></div>
                             <div className="absolute bottom-4 left-4">
                                <Badge className="bg-[#FFB800] text-black font-extrabold text-xs px-3 py-1 mb-2">
                                    {selectedProduct.category}
                                </Badge>
                             </div>
                        </div>

                        {/* Right: Details & Customization */}
                        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col h-full overflow-y-auto custom-scrollbar">
                             <DialogHeader className="mb-4">
                                <DialogTitle className="text-3xl md:text-4xl font-black text-white uppercase leading-none tracking-tight mb-2">
                                    {selectedProduct.name}
                                </DialogTitle>
                                <p className="text-sm text-gray-400 leading-relaxed">
                                    {selectedProduct.description}
                                </p>
                             </DialogHeader>

                             {/* Customization Options */}
                             <div className="flex-1 space-y-6 py-4">
                                
                                {/* 🧀 Extra Cheese: APPLIES TO EVERYTHING EXCEPT DRINKS */}
                                {!selectedProduct.category.toLowerCase().includes('drink') && (
                                    <div className="space-y-3">
                                        <Label className="text-[#FFB800] text-xs font-bold uppercase tracking-widest">Customize</Label>
                                        <div className="flex items-center space-x-2 bg-white/5 p-3 rounded-xl border border-white/5 hover:border-[#FFB800]/30 transition-colors cursor-pointer" onClick={() => setModifiers(prev => ({ ...prev, extraCheese: !prev.extraCheese }))}>
                                            <Checkbox 
                                                id="cheese" 
                                                checked={modifiers.extraCheese || false}
                                                onCheckedChange={(checked) => setModifiers(prev => ({ ...prev, extraCheese: checked }))}
                                                className="border-white/20 data-[state=checked]:bg-[#FFB800] data-[state=checked]:text-black"
                                            />
                                            <div className="flex-1">
                                                <label htmlFor="cheese" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-white cursor-pointer select-none">
                                                    Extra Cheese
                                                </label>
                                                <p className="text-xs text-gray-500 mt-1">Add a slice of cheddar cheese</p>
                                            </div>
                                            <span className="text-xs font-bold text-[#FFB800]">+ LKR 150</span>
                                        </div>
                                    </div>
                                )}

                                {/* 🥤 Drink Sizes */}
                                {selectedProduct.category.toLowerCase().includes('drink') && (
                                    <div className="space-y-4">
                                        <Label className="text-[#FFB800] text-xs font-bold uppercase tracking-widest">Select Size</Label>
                                        <RadioGroup 
                                            value={modifiers.size || 'regular'} 
                                            onValueChange={(val) => setModifiers(prev => ({ ...prev, size: val }))}
                                            className="grid grid-cols-3 gap-3"
                                        >
                                            {/* Regular */}
                                            <div>
                                                <RadioGroupItem value="regular" id="r-regular" className="peer sr-only" />
                                                <Label
                                                    htmlFor="r-regular"
                                                    className="flex flex-col items-center justify-between rounded-xl border-2 border-white/10 bg-white/5 p-3 hover:bg-white/10 peer-data-[state=checked]:border-[#FFB800] peer-data-[state=checked]:text-[#FFB800] [&:has([data-state=checked])]:border-[#FFB800] cursor-pointer transition-all h-full"
                                                >
                                                    <span className="text-xs font-bold mb-1">Standard</span>
                                                    <span className="text-[10px] text-gray-400">Regular</span>
                                                </Label>
                                            </div>
                                            {/* 1L */}
                                            <div>
                                                <RadioGroupItem value="1l" id="r-1l" className="peer sr-only" />
                                                <Label
                                                    htmlFor="r-1l"
                                                    className="flex flex-col items-center justify-between rounded-xl border-2 border-white/10 bg-white/5 p-3 hover:bg-white/10 peer-data-[state=checked]:border-[#FFB800] peer-data-[state=checked]:text-[#FFB800] [&:has([data-state=checked])]:border-[#FFB800] cursor-pointer transition-all h-full"
                                                >
                                                    <span className="text-xs font-bold mb-1">Large</span>
                                                    <span className="text-[10px] text-gray-400">1 Liter</span>
                                                    <span className="text-[10px] text-[#FFB800] mt-1">+200</span>
                                                </Label>
                                            </div>
                                            {/* 2L */}
                                            <div>
                                                <RadioGroupItem value="2l" id="r-2l" className="peer sr-only" />
                                                <Label
                                                    htmlFor="r-2l"
                                                    className="flex flex-col items-center justify-between rounded-xl border-2 border-white/10 bg-white/5 p-3 hover:bg-white/10 peer-data-[state=checked]:border-[#FFB800] peer-data-[state=checked]:text-[#FFB800] [&:has([data-state=checked])]:border-[#FFB800] cursor-pointer transition-all h-full"
                                                >
                                                    <span className="text-xs font-bold mb-1">Mega</span>
                                                    <span className="text-[10px] text-gray-400">2 Liter</span>
                                                    <span className="text-[10px] text-[#FFB800] mt-1">+350</span>
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                )}
                             </div>

                             {/* Footer: Price & Add Button */}
                             <div className="mt-auto pt-6 border-t border-white/10">
                                <div className="flex items-center justify-between mb-4">
                                     <div className="flex items-center gap-3 bg-white/5 rounded-full p-1 border border-white/10">
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10 text-white" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                            <Minus className="w-3 h-3" />
                                        </Button>
                                        <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10 text-white" onClick={() => setQuantity(quantity + 1)}>
                                            <Plus className="w-3 h-3" />
                                        </Button>
                                     </div>
                                     <div className="text-right">
                                        <p className="text-[10px] text-gray-400 uppercase tracking-widest">Total Price</p>
                                        <p className="text-2xl font-black text-white">
                                            <span className="text-[#FFB800] text-sm mr-1">LKR</span>
                                            {((Number(selectedProduct.price) + (modifiers.extraCheese ? 150 : 0) + (modifiers.size === '1l' ? 200 : 0) + (modifiers.size === '2l' ? 350 : 0)) * quantity).toFixed(2)}
                                        </p>
                                     </div>
                                </div>
                                <Button className="w-full h-12 bg-[#FFB800] text-black font-extrabold rounded-xl hover:bg-[#E5A600] text-sm tracking-widest uppercase shadow-[0_0_30px_-5px_rgba(255,184,0,0.4)] hover:shadow-[0_0_40px_-5px_rgba(255,184,0,0.6)] transition-all" onClick={handleAddToCart}>
                                    Add To Order
                                </Button>
                             </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>

      </main>
    </div>
  );
};

export default Menu;