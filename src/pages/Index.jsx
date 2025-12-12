/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Star, Zap, Award, Facebook, Instagram, Youtube, ChevronRight, Clock, MapPin, Phone } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { mockBurgers } from '../data/mockData';
import Navbar from "../components/Navbar";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } }
};

const floatingAnimation = {
  y: [-10, 10, -10],
  rotate: [0, 2, -2, 0],
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" }
};

// ------------------ Hero Section ------------------
const HeroSection = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <section className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden bg-[#050505]">
            {/* Background Ambience */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FFB800]/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />

            <div className="container relative z-10 px-4 mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    
                    {/* Text Content */}
                    <motion.div 
                        className="space-y-6 lg:space-y-8 text-center lg:text-left order-2 lg:order-1"
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/20 backdrop-blur-md mx-auto lg:mx-0">
                            <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse" />
                            <span className="text-[#FFB800] text-[11px] font-bold uppercase tracking-[0.2em]">The Ultimate Taste</span>
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-none">
                            <span className="block text-white mb-2">Taste The</span>
                            <span className="text-transparent bg-gradient-to-r from-[#FFB800] via-yellow-400 to-[#FFB800] bg-clip-text filter drop-shadow-[0_0_25px_rgba(255,184,0,0.3)]">
                                Perfection
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-base md:text-lg text-gray-400 font-light max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            Experience the crunch, the juice, and the flavor explosion. We define what a premium burger should taste like.
                        </motion.p>
                        
                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                            <Link to="/menu">
                                <Button size="lg" className="h-14 px-8 bg-[#FFB800] text-black hover:bg-white hover:text-black font-black text-xs rounded-2xl shadow-[0_0_30px_rgba(255,184,0,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all duration-300 uppercase tracking-widest w-full sm:w-auto">
                                    Order Now 
                                </Button>
                            </Link>
                            <Link to="/menu">
                                <Button variant="outline" size="lg" className="h-14 px-8 border-white/10 text-white hover:bg-white/5 font-bold text-xs rounded-2xl uppercase tracking-widest w-full sm:w-auto">
                                    View Full Menu
                                </Button>
                            </Link>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="flex items-center justify-center lg:justify-start gap-8 pt-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                            {[
                                { label: '30m Delivery', icon: Clock },
                                { label: 'Fresh Meat', icon: Award },
                                { label: 'Free Returns', icon: Zap }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <item.icon className="w-4 h-4 text-[#FFB800]" />
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Hero Visual */}
                    <motion.div 
                        className="relative order-1 lg:order-2 flex justify-center"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        style={{ y: y2 }}
                    >
                        <motion.div animate={floatingAnimation} className="relative z-10 w-[85%] sm:w-[70%] lg:w-full max-w-[500px] aspect-square mx-auto">
                            {/* Glow from behind */}
                            <div className="absolute inset-0 bg-[#FFB800]/20 blur-[100px] rounded-full animate-pulse" />
                            
                            {/* Creative Image Container */}
                            <div className="relative w-full h-full rounded-full border-2 border-[#FFB800]/20 p-2 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm">
                                <div className="w-full h-full rounded-full overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent z-10 mix-blend-multiply" />
                                    <img 
                                        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80"
                                        alt="Premium Burger" 
                                        className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-700" 
                                    />
                                </div>
                                
                                {/* Orbiting Elements */}
                                <div className="absolute -inset-4 border border-[#FFB800]/10 rounded-full border-dashed animate-spin-slow pointer-events-none" style={{ animationDuration: '20s' }} />
                            </div>

                            {/* Floating Tags */}
                            <motion.div 
                                animate={{ y: [10, -10, 10] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute top-0 right-0 bg-[#09090b]/80 backdrop-blur-xl border border-[#FFB800]/40 p-3 rounded-2xl shadow-xl z-20"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="bg-[#FFB800] p-1.5 rounded-lg">
                                        <Star className="w-4 h-4 text-black fill-black" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider leading-none mb-1">Rating</p>
                                        <p className="text-base font-black text-white leading-none">4.9/5</p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div 
                                animate={{ y: [-15, 15, -15] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                                className="absolute bottom-10 -left-4 bg-[#09090b]/80 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-xl z-20"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-500/20 p-1.5 rounded-lg">
                                        <Zap className="w-4 h-4 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider leading-none mb-1">Fresh</p>
                                        <p className="text-base font-black text-white leading-none">100%</p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

// ------------------ Asymmetrical Features Section ------------------
const FeaturesSection = () => (
  <section className="relative z-10 py-24 bg-[#050505]">
    <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-6 flex flex-col justify-center">
                 <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight leading-tight">
                     Why We Are <br/> <span className="text-[#FFB800]">Different</span>
                 </h2>
                 <p className="text-gray-400 leading-relaxed text-sm">
                     We don't believe in fast food. We believe in good food, served fast. Every ingredient is hand-picked, every patty is hand-smashed.
                 </p>
                 <Link to="/about">
                    <Button variant="link" className="text-[#FFB800] uppercase tracking-widest font-bold text-xs p-0 justify-start hover:text-white transition-colors">
                        Read Our Story <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                 </Link>
            </div>

            <motion.div 
                className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
            >
                 {[
                     { title: "Artisan Buns", desc: "Baked fresh every single morning.", icon: Star, color: "bg-orange-500/10 text-orange-500" },
                     { title: "Local Meat", desc: "100% grass-fed beef from local farms.", icon: Award, color: "bg-red-500/10 text-red-500" },
                     { title: "Secret Sauce", desc: "Our signature blend of 12 spices.", icon: Zap, color: "bg-yellow-500/10 text-yellow-500" },
                     { title: "Eco Box", desc: "100% biodegradable packaging.", icon: MapPin, color: "bg-green-500/10 text-green-500" }
                 ].map((item, idx) => (
                     <motion.div key={idx} variants={fadeInUp} className="group p-6 rounded-3xl bg-[#09090b] border border-white/5 hover:border-[#FFB800]/30 transition-all duration-300 hover:-translate-y-1">
                          <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                              <item.icon size={20} />
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                     </motion.div>
                 ))}
            </motion.div>
        </div>
    </div>
  </section>
);

// ------------------ Infinite Scroll Menu ------------------
const FeaturedBurgersSection = () => {
    // Duplicate data for seamless infinite scroll
    const marqueeBurgers = [...mockBurgers, ...mockBurgers, ...mockBurgers]; 

    return (
        <section className="py-32 bg-[#050505] overflow-hidden">
            <div className="container px-4 mx-auto mb-16 flex justify-between items-end">
                <div>
                     <span className="text-[#FFB800] font-bold text-[10px] uppercase tracking-[0.3em] mb-2 block">Our Masterpieces</span>
                     <h2 className="text-2xl md:text-3xl font-bold text-white uppercase tracking-tight leading-tight">Fan Favorites</h2>
                </div>
                {/* Visual Indicator for Scrolling */}
                <div className="hidden md:flex items-center gap-2 text-gray-500 text-xs font-bold uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-[#FFB800] animate-pulse" />
                    Live Gallery
                </div>
            </div>
            
            <div className="relative w-full overflow-hidden">
                {/* Gradient Masks for smooth fade out at edges */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050505] to-transparent z-10" />
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050505] to-transparent z-10" />

                <motion.div 
                    className="flex gap-8"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ 
                        repeat: Infinity, 
                        ease: "linear", 
                        duration: 30, // Slow smooth scroll
                        repeatType: "loop"
                    }}
                    style={{ width: "fit-content" }}
                >
                     {marqueeBurgers.map((burger, index) => (
                         <div 
                            key={`${burger.id}-${index}`} 
                            className="shrink-0 w-[320px] group relative"
                         >
                             <div className="relative h-[420px] rounded-[2.5rem] bg-[#09090b] border border-white/5 overflow-hidden group-hover:border-[#FFB800]/30 transition-all duration-500">
                                 {/* Image Area */}
                                 <div className="h-[250px] p-8 flex items-center justify-center relative bg-[#121214]">
                                     <div className="absolute inset-0 bg-radial-gradient from-[#FFB800]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                     <img 
                                        src={burger.image} 
                                        alt={burger.name} 
                                        className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500" 
                                     />
                                     <Button size="icon" className="absolute top-4 right-4 rounded-full bg-white/10 backdrop-blur-md hover:bg-[#FFB800] hover:text-black text-white border border-white/10 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                                         <Star className="w-4 h-4" />
                                     </Button>
                                 </div>
                                 
                                 {/* Info Area */}
                                 <div className="p-6">
                                     <h3 className="text-xl font-black text-white uppercase mb-2 group-hover:text-[#FFB800] transition-colors">{burger.name}</h3>
                                     <p className="text-sm text-gray-500 line-clamp-2 mb-4">{burger.description}</p>
                                     <div className="flex items-center justify-between">
                                         <span className="text-lg font-bold text-white">LKR {burger.price}</span>
                                         <Link to="/menu">
                                             <Button size="sm" className="rounded-xl bg-white/5 hover:bg-[#FFB800] hover:text-black text-white font-bold uppercase text-[10px] tracking-widest transition-all">
                                                 Add to Cart
                                             </Button>
                                         </Link>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     ))}
                </motion.div>
            </div>
        </section>
    );
};

// ------------------ Creative CTA Section ------------------
const CTASection = () => (
    <section className="relative py-32 overflow-hidden">
        {/* Creative Background */}
        <div className="absolute inset-0 bg-black">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2071&auto=format&fit=crop')] bg-cover bg-center bg-fixed opacity-40" />
             <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
             <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505]" />
        </div>

        {/* Floating Particles/Decor */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
             <div className="absolute top-10 left-[10%] w-32 h-32 bg-[#FFB800]/10 rounded-full blur-[50px] animate-pulse" />
             <div className="absolute bottom-10 right-[10%] w-64 h-64 bg-red-600/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container relative z-10 px-4 mx-auto text-center">
             <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl mx-auto space-y-8"
             >
                <div className="inline-block relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#FFB800] to-yellow-600 rounded-full blur opacity-50" />
                    <span className="relative px-6 py-2 bg-black rounded-full border border-[#FFB800]/50 text-[#FFB800] text-xs font-bold uppercase tracking-[0.3em]">
                        Join The Revolution
                    </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-bold text-white uppercase tracking-tight leading-none drop-shadow-2xl">
                    Ready to <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-yellow-400 to-[#FFB800] animate-gradient-x">
                        Taste Better?
                    </span>
                </h2>

                <p className="text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
                    Join over 10,000 satisfied burger lovers who have upgraded their standards. 
                    Life is too short for average food.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                     <Link to="/menu">
                        <Button size="lg" className="h-16 px-12 bg-[#FFB800] text-black hover:bg-white hover:text-black font-black text-sm rounded-full shadow-[0_0_40px_rgba(255,184,0,0.4)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all duration-300 uppercase tracking-widest group">
                             Order Now <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                     </Link>
                     <Link to="/contact">
                        <Button variant="outline" size="lg" className="h-16 px-12 border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white hover:text-black font-bold text-sm rounded-full uppercase tracking-widest group">
                             Contact Us
                        </Button>
                     </Link>
                </div>
             </motion.div>
        </div>
    </section>
);

// ------------------ Refined Footer (Same as previous but verified) ------------------
const Footer = () => (
  <footer className="relative bg-[#050505] pt-24 pb-12 border-t border-[#FFB800]/30 shadow-[0_-1px_10px_rgba(255,184,0,0.1)] overflow-hidden font-sans">
    <div className="container px-4 mx-auto relative z-10">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="space-y-6">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative">
                        {/* Animated Glow */}
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
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                    Elevating the art of the burger. Experience taste without compromise, delivered straight to your door.
                </p>
            </div>

            {/* Quick Links */}
            <div>
                <h4 className="text-sm font-bold text-white mb-6">Explore</h4>
                <ul className="space-y-3">
                    {['Home', 'Menu', 'Rewards', 'Challenges'].map(item => (
                        <li key={item}>
                            <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-sm text-gray-400 hover:text-[#FFB800] transition-colors">
                                {item}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Support */}
            <div>
                <h4 className="text-sm font-bold text-white mb-6">Support</h4>
                <ul className="space-y-3">
                    <li><Link to="/about" className="text-sm text-gray-400 hover:text-[#FFB800] transition-colors">About Us</Link></li>
                    <li><Link to="/contact" className="text-sm text-gray-400 hover:text-[#FFB800] transition-colors">Contact</Link></li>
                    <li><Link to="/privacy" className="text-sm text-gray-400 hover:text-[#FFB800] transition-colors">Privacy Policy</Link></li>
                    <li><Link to="/terms" className="text-sm text-gray-400 hover:text-[#FFB800] transition-colors">Terms of Service</Link></li>
                </ul>
            </div>

            {/* Contact Details & Social */}
            <div>
                <h4 className="text-sm font-bold text-white mb-6">Get In Touch</h4>
                <ul className="space-y-4 mb-8">
                    <li className="flex items-start gap-3 text-sm font-medium text-gray-400">
                        <MapPin className="w-5 h-5 text-[#FFB800] shrink-0" />
                        <span className="leading-tight">616/A ,<br/>Makola Road, Kiribathgoda.</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm font-medium text-gray-400">
                        <Phone className="w-5 h-5 text-[#FFB800] shrink-0" />
                        <span>+94 75 423 3902</span>
                    </li>
                </ul>
                
                <h4 className="text-sm font-bold text-white mb-4">Follow Us</h4>
                <div className="flex gap-3">
                    {[Facebook, Instagram, Youtube].map((Icon, i) => (
                        <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#FFB800] hover:text-black transition-all border border-white/5">
                            <Icon size={18} />
                        </a>
                    ))}
                </div>
            </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-600 font-bold uppercase tracking-widest pt-8 border-t border-white/5">
            <p>&copy; {new Date().getFullYear()} BurgerShop Inc. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
                <span>Developed by  <a href="https://sandaru-sadishan.vercel.app/">Sandaru Sadishan</a></span>
            </div>
        </div>
    </div>
  </footer>
);

// ------------------ Index Page ------------------
const Index = () => {
    return (
        <div className="text-foreground bg-[#050505] min-h-screen selection:bg-[#FFB800] selection:text-black">
            <Navbar />
            <main>
                <HeroSection />
                <FeaturedBurgersSection />
                <FeaturesSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
};

export default Index;
export { Footer };
