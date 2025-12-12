import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Award, Trophy, Package, UserStar, Menu, X, Search, Gem, Crown } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { items } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20); // Delay effect slightly
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
    setIsMobileMenuOpen(false); 
  };

  const navLinks = [
    { name: 'Menu', path: '/menu', icon: null },
    ...(isAuthenticated ? [
      { name: 'Orders', path: '/orders', icon: Package },
      { name: 'Rewards', path: '/rewards', icon: Gem },
      { name: 'Challenges', path: '/challenges', icon: Crown },
    ] : [])
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out',
        isScrolled 
          ? 'bg-black/20 backdrop-blur-md shadow-lg py-3' // Highly transparent glass on scroll
          : 'bg-transparent border-b border-transparent py-6' // Invisible at top
      )}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="relative">
              {/* Animated Glow - restored Premium feature */}
              <div className="absolute inset-0 bg-[#FFB800] rounded-full blur-[20px] opacity-20 group-hover:opacity-60 transition-opacity duration-500 animate-pulse"></div>
              
              <div className="relative w-12 h-12 bg-black/40 rounded-2xl flex items-center justify-center border border-[#FFB800]/30 overflow-hidden transform group-hover:rotate-12 transition-transform duration-500 ease-out backdrop-blur-sm">
                <img 
                  src="/logo.png"
                  alt="Logo" 
                  className="w-8 h-8 object-contain drop-shadow-lg"
                  onError={(e) => {
                     e.target.style.display = 'none';
                     e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden items-center justify-center w-full h-full text-[#FFB800] font-black text-lg">
                   BS
                </div>
                
                {/* Shine Effect */}
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shine" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-wider font-['Outfit'] drop-shadow-md">
                BURGER<span className="text-[#FFB800] drop-shadow-[0_0_15px_rgba(255,184,0,0.6)]">SHOP</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="items-center hidden gap-8 md:flex">
            {navLinks.map((item) => (
              <Link 
                key={item.name}
                to={item.path} 
                className="relative text-white/80 hover:text-[#FFB800] transition-colors duration-300 font-medium text-sm tracking-wide group/nav flex items-center gap-1.5 shadow-black/50 drop-shadow-sm"
              >
                {item.icon && <item.icon className="w-3.5 h-3.5 opacity-70 group-hover/nav:opacity-100" />}
                {item.name}
                <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-[#FFB800] group-hover/nav:w-full transition-all duration-300 shadow-[0_0_8px_#FFB800] rounded-full"></span>
              </Link>
            ))}
            
            {isAuthenticated && user?.role === 'admin' && (
               <Link 
                 to="/admin" 
                 className="relative px-3 py-1 rounded-full bg-[#FFB800]/20 border border-[#FFB800]/30 text-[#FFB800] font-bold hover:bg-[#FFB800] hover:text-black transition-all duration-300 text-xs tracking-wide uppercase hover:scale-105 backdrop-blur-md"
               >
                 Admin Panel
               </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link to="/cart">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-white/80 hover:text-[#FFB800] hover:bg-[#FFB800]/10 transition-all duration-300 group rounded-xl w-10 h-10"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 flex items-center justify-center min-w-[1.25rem] h-5 px-1 bg-[#FFB800] text-black font-bold text-[10px] rounded-full shadow-[0_0_10px_#FFB800] animate-bounce-short">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Auth / Profile */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="pl-2 pr-1 py-1 h-10 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/20 transition-all gap-2 group backdrop-blur-sm"
                  >
                     <div className="text-right hidden sm:block">
                        <p className="text-xs font-bold text-white group-hover:text-[#FFB800] transition-colors shadow-black/50">{user?.name?.split(' ')[0]}</p>
                     </div>
                     <div className="w-8 h-8 rounded-lg bg-[#18181b]/80 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-[#FFB800]/50 transition-colors">
                        <User className="w-4 h-4 text-gray-400 group-hover:text-[#FFB800]" />
                     </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-60 bg-[#09090b]/80 backdrop-blur-2xl border border-[#FFB800]/20 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.9)] text-gray-200 p-2 rounded-2xl mt-2"
                >
                  <div className="px-3 py-3 border-b border-white/10 mb-2 bg-white/5 rounded-xl">
                    <p className="font-bold text-white tracking-wide">{user?.name}</p>
                    <p className="text-xs text-[#FFB800]/80 font-mono mt-0.5">{user?.email}</p>
                  </div>
                  
                  <div className="space-y-1">
                    {['Profile', 'Orders', 'Rewards'].map((item) => (
                        <DropdownMenuItem key={item} asChild className="focus:bg-[#FFB800]/10 focus:text-[#FFB800] cursor-pointer rounded-lg px-3 py-2.5 font-medium transition-colors">
                          <Link to={`/${item.toLowerCase()}`} className="flex items-center gap-2">
                            {item === 'Profile' && <User size={16} />}
                            {item === 'Orders' && <Package size={16} />}
                            {item === 'Rewards' && <Gem size={16} />}
                            {item}
                          </Link>
                        </DropdownMenuItem>
                    ))}
                  </div>

                  <DropdownMenuItem 
                    onClick={handleLogout} 
                    className="text-red-400 focus:text-red-300 focus:bg-red-500/10 cursor-pointer mt-2 border-t border-white/10 pt-2 rounded-lg px-3 py-2.5 font-medium transition-colors hover:bg-red-500/5"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button className="h-10 px-6 bg-[#FFB800] hover:bg-[#FFD600] text-black font-extrabold rounded-xl shadow-[0_0_20px_-5px_rgba(255,184,0,0.3)] hover:shadow-[0_0_30px_-5px_rgba(255,184,0,0.5)] hover:-translate-y-0.5 transition-all duration-300 text-xs tracking-wider uppercase">
                  Join Now
                </Button>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden text-white/80 hover:text-[#FFB800] hover:bg-[#FFB800]/5 rounded-xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
               initial={{ height: 0, opacity: 0 }}
               animate={{ height: "auto", opacity: 1 }}
               exit={{ height: 0, opacity: 0 }}
               transition={{ duration: 0.3, ease: "easeInOut" }}
               className="md:hidden overflow-hidden border-t border-white/10 mt-2 rounded-2xl bg-[#09090b]/90 backdrop-blur-xl"
            >
              <div className="flex flex-col gap-1 p-4">
                {navLinks.map((item) => (
                   <Link 
                     key={item.name}
                     to={item.path} 
                     className="flex items-center gap-3 text-gray-300 hover:text-[#FFB800] hover:bg-[#FFB800]/5 py-3 px-4 rounded-xl font-bold transition-all"
                     onClick={() => setIsMobileMenuOpen(false)}
                   >
                     {item.icon && <item.icon className="w-5 h-5 text-[#FFB800]/70" />}
                     {item.name}
                   </Link>
                ))}
                
                {isAuthenticated && user?.role === 'admin' && (
                  <Link 
                    to="/admin" 
                    className="flex items-center gap-3 text-[#FFB800] bg-[#FFB800]/5 border border-[#FFB800]/20 py-3 px-4 rounded-xl font-bold mt-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserStar className="w-5 h-5" />
                    Admin Dashboard
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

export default Navbar;