import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../contexts/AuthContext";
import { useToast } from "../hooks/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Clear fields on initial render/mount to prevent sticky values
  useEffect(() => {
    setEmail("");
    setPassword("");
    setName("");
  }, []);

  // Reset states when switching modes
  useEffect(() => {
    setEmail("");
    setPassword("");
    setName("");
    setShowPassword(false);
  }, [isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        setEmail(""); // Clear sensitive data
        setPassword("");
        toast({ title: "Welcome back!", duration: 2000 });
        navigate("/menu");
      } else {
        await register(email, password, name);
        toast({
          title: "Account Created!",
          description: "Your account has been created successfully. Please log in.",
          duration: 2000,
        });
        setIsLogin(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = (provider) => {
    toast({
      title: "Coming Soon",
      description: `${provider} login will be available shortly.`,
    });
  };

  // Dynamic Content Configuration
  const brandingData = {
    login: {
      image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop", // Dark Burger
      title: "Taste the Extraordinary",
      subtitle: "Welcome back. Your premium burger experience awaits.",
    },
    register: {
      image: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop", // Burger Feast
      title: "Join the Revolution",
      subtitle: "Create an account to unlock exclusive deals, lightning-fast delivery, and premium rewards.",
    }
  };

  const currentBranding = isLogin ? brandingData.login : brandingData.register;

  return (
    <div className="min-h-[100dvh] w-full flex bg-[#09090b] text-white overflow-hidden relative">
      {/* Navbar Overlay */}
      <div className="absolute top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <motion.div 
        layout
        className="flex w-full h-full flex-col lg:flex-row"
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
      >
        
        {/* PANEL 1: BRANDING (Swaps sides & Changes Content) */}
        <motion.div 
          layout
          className="hidden lg:flex w-1/2 relative bg-black items-center justify-center overflow-hidden h-screen"
        >
          {/* Image with overlay (Animate change) */}
          <div className="absolute inset-0 z-0">
            <AnimatePresence mode="wait">
              <motion.img 
                key={isLogin ? "login-img" : "register-img"}
                initial={{ scale: 1.1, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.1, opacity: 0 }}
                transition={{ duration: 0.8 }}
                src={currentBranding.image} 
                alt="Premium Food" 
                className="w-full h-full object-cover opacity-80"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>
          </div>

          {/* Branding Text Overlay */}
          <div className="relative z-10 max-w-xl px-12 mt-auto mb-24">
             <motion.div
               key={isLogin ? "login-text" : "register-text"}
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: -20, opacity: 0 }}
               transition={{ duration: 0.5 }}
             >
                <div className="flex items-center gap-3 mb-6">
                   {/* REAL LOGO */}
                   <div className="h-12 w-12 rounded-lg bg-[#FFB800] flex items-center justify-center shadow-[0_0_20px_rgba(255,184,0,0.5)] p-1">
                      <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                   </div>
                   <span className="text-3xl font-bold text-white tracking-wide">BurgerShop</span>
                </div>
                
                <h1 className="text-5xl font-extrabold leading-tight mb-4">
                  {currentBranding.title}
                </h1>
                
                <p className="text-gray-300 text-lg max-w-md leading-relaxed">
                  {currentBranding.subtitle}
                </p>
             </motion.div>
          </div>
        </motion.div>


        {/* PANEL 2: FORM (Mobile & Desktop) */}
        <motion.div 
           layout
           className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 bg-[#09090b] relative overflow-y-auto pt-28 pb-10 lg:pt-0 lg:pb-0"
        >
          {/* Mobile Background Image (Visible only on small screens) */}
          <div className="absolute inset-0 lg:hidden z-0">
               <img 
                 src={currentBranding.image} 
                 alt="Background" 
                 className="w-full h-full object-cover opacity-20" 
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/80 to-[#09090b]/40" />
               <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
          </div>
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFB800]/5 blur-[100px] rounded-full pointer-events-none"></div>

          {/* The "Glow" Card - EXTREME COMPACT MODE */}
          <motion.div 
             initial={{ scale: 0.95, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.5 }}
             className="relative w-full max-w-[420px] my-8 lg:my-0"
          >
             {/* Electric Border Animation */}
             <div className="absolute inset-[-2px] rounded-3xl overflow-hidden z-0">
               <motion.div 
                 className="absolute top-[50%] left-[50%] w-[150%] h-[150%] origin-center bg-[conic-gradient(from_0deg,transparent_0_300deg,#FFB800_360deg)]"
                 initial={{ x: "-50%", y: "-50%", rotate: 0 }}
                 animate={{ rotate: 360 }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               />
             </div>

             {/* Card Content */}
             <div className="relative z-10 p-6 sm:p-8 rounded-3xl bg-[#09090b] border border-[#FFB800]/20 shadow-[0_0_60px_-15px_rgba(255,184,0,0.15)] overflow-hidden">
                 {/* Card Top Highlight */}
                 <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FFB800]/50 to-transparent"></div>

             {/* Mobile Logo */}
             <div className="lg:hidden flex justify-center mb-5">
                <div className="h-10 w-10 rounded-lg bg-[#FFB800] flex items-center justify-center shadow-[0_0_15px_rgba(255,184,0,0.5)] p-1">
                    <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                </div>
             </div>

             <div className="text-center lg:text-left mb-6">
                <h2 className="text-xl font-bold text-white mb-1.5">
                   {isLogin ? "Welcome Back" : "One step away"}
                </h2>
                <p className="text-gray-400 text-xs text-muted-foreground">
                   {isLogin ? "Access your dashboard" : "Create your account instantly"}
                </p>
             </div>

             <AnimatePresence mode="wait">
               <motion.form
                 key={isLogin ? "login" : "register"}
                 initial={{ x: 20, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 exit={{ x: -20, opacity: 0 }}
                 transition={{ duration: 0.2 }}
                 onSubmit={handleSubmit}
                 className="space-y-3"
                 autoComplete="off"
               >
                 {!isLogin && (
                   <div className="space-y-1">
                     <Label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider ml-1">Full Name</Label>
                     <Input
                       value={name}
                       onChange={(e) => setName(e.target.value)}
                       required
                       className="bg-[#121214] border-white/5 focus:border-[#FFB800]/50 text-white rounded-xl h-9 px-3 shadow-inner text-xs"
                       placeholder="Name"
                       autoComplete="off"
                     />
                   </div>
                 )}

                 <div className="space-y-1">
                   <Label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider ml-1">Email Address</Label>
                   <Input
                     type="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                     className="bg-[#121214] border-white/5 focus:border-[#FFB800]/50 text-white rounded-xl h-9 px-3 shadow-inner text-xs"
                     placeholder="admin@burgershop.com"
                     autoComplete="off"
                   />
                 </div>

                 <div className="space-y-1">
                   <div className="flex items-center justify-between">
                     <Label className="text-[10px] uppercase font-bold text-gray-500 tracking-wider ml-1">Password</Label>
                   </div>
                   <div className="relative">
                     <Input
                       type={showPassword ? "text" : "password"}
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       required
                       className="bg-[#121214] border-white/5 focus:border-[#FFB800]/50 text-white rounded-xl h-9 px-3 shadow-inner pr-8 text-xs"
                       placeholder="••••••••"
                       autoComplete="new-password"
                     />
                     <button
                       type="button"
                       onClick={() => setShowPassword(!showPassword)}
                       className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                     >
                       {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                     </button>
                   </div>
                 </div>

                <div className="pt-2">
                   <Button 
                     type="submit" 
                     className="w-full h-10 bg-[#FFB800] hover:bg-[#E5A600] text-black font-bold text-xs rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(255,184,0,0.4)] hover:shadow-[0_0_25px_-5px_rgba(255,184,0,0.6)] hover:-translate-y-0.5"
                     disabled={isLoading}
                   >
                     {isLoading ? <Loader2 className="animate-spin" /> : (isLogin ? "SIGN IN" : "CREATE ACCOUNT")}
                   </Button>
                </div>
               </motion.form>
             </AnimatePresence>

             <div className="mt-5 text-center">
               <p className="text-[10px] text-gray-500">
                 {isLogin ? "Don't have an account?" : "Already have an account?"}
                 <button 
                   onClick={() => setIsLogin(!isLogin)}
                   className="ml-2 text-[#FFB800] font-semibold hover:underline"
                 >
                   {isLogin ? "Register" : "Sign In"}
                 </button>
               </p>
             </div>
             
             {/* Social Provider Text */}
             <div className="mt-5 pt-5 border-t border-white/5 flex flex-col gap-2">
                <p className="text-center text-[10px] text-gray-600 mb-1">OR CONTINUE WITH</p>
                <div className="grid grid-cols-2 gap-2">
                   <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => socialLogin('Google')}
                      className="bg-[#18181b] border-white/10 text-gray-300 hover:bg-[#27272a] hover:text-white h-8 text-[10px] font-medium"
                   >
                     <svg className="mr-2 h-3 w-3" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
                     Google
                   </Button>
                   <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => socialLogin('Facebook')}
                      className="bg-[#18181b] border-white/10 text-gray-300 hover:bg-[#27272a] hover:text-white h-8 text-[10px] font-medium"
                   >
                     <svg className="mr-2 h-3 w-3 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
                     Facebook
                   </Button>
                </div>
             </div>

             {/* Footer - Visible on right panel */}
             <div className="mt-5 text-center border-t border-white/5 pt-4">
                 <span className="text-xs text-zinc-600">© 2025 BurgerShop Inc. • Privacy • Terms</span>
             </div>

             </div> 
          </motion.div>
          
        </motion.div>
      </motion.div>

      {/* Help Link at bottom right (Fixed Position) */}
      <div className="hidden lg:block absolute bottom-6 right-8 z-50">
         <button className="h-12 w-12 rounded-full bg-[#FFB800] text-black shadow-lg flex items-center justify-center hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
         </button>
      </div>
    </div>
  );
};

export default Auth;