import React from 'react';
import Navbar from '../components/Navbar';
import { Card } from '../components/ui/card';
import { ChefHat, Globe, Trophy, Heart, Star, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from '../pages/Index';

const featureVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

const About = () => {
  return (
    <div className="min-h-screen flex flex-col font-inter bg-[#050505] text-white overflow-hidden">
      <Navbar />
      <main className="flex-grow py-24 relative">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFB800]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center mb-20"
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/20 text-[#FFB800] text-[10px] font-bold uppercase tracking-[0.2em] mb-6 backdrop-blur-md">
                Our Journey
            </span>
            <h1 className="text-3xl md:text-5xl font-bold uppercase tracking-tight text-white drop-shadow-2xl mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] to-yellow-600">BurgerShop</span>
            </h1>
            <p className="max-w-2xl mx-auto text-gray-400 font-light leading-relaxed text-sm md:text-base">
                Redefining the burger experience since 2025. Where passion meets perfection in every bite.
            </p>
          </motion.div>

          <Card className="p-10 lg:p-16 bg-[#09090b]/60 border border-white/5 backdrop-blur-md mb-24 rounded-[3rem] shadow-2xl relative overflow-hidden group hover:border-[#FFB800]/30 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="absolute top-0 right-0 p-10 opacity-10">
                <ChefHat className="w-64 h-64 text-white rotate-12" />
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl font-black uppercase tracking-tight text-white flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-[#FFB800]" /> Our Story
                    </h2>
                    <p className="text-gray-400 leading-relaxed font-light">
                    Founded in 2025 with a simple yet ambitious goal: to create the <span className="text-white font-bold">perfect burger</span>. We believe that great food starts with great ingredients. That's why we <span className="text-[#FFB800] font-bold">hand-select every component</span>, from prime cuts of meat to fresh, locally-sourced vegetables and freshly baked buns.
                    </p>
                    <p className="text-gray-400 leading-relaxed font-light">
                    More than just a restaurant, BurgerShop is a place where quality meets passion. We're committed to giving you a delightful, satisfying, and memorable experience with every bite.
                    </p>
                </div>
                <div className="relative h-80 rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#FFB800]/30 transition-all duration-500 shadow-xl">
                    <img 
                        src="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1965&auto=format&fit=crop" 
                        alt="Our Kitchen" 
                        className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                         <div className="flex items-center gap-2">
                             <div className="flex -space-x-2">
                                 {[1,2,3].map(i => (
                                     <div key={i} className="w-8 h-8 rounded-full bg-gray-800 border border-black" />
                                 ))}
                             </div>
                             <span className="text-xs font-bold uppercase tracking-wide text-white pl-2">Master Chefs</span>
                         </div>
                    </div>
                </div>
            </div>
          </Card>

          <div className="text-center mb-16">
             <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-4">Core Values</h2>
             <div className="w-24 h-1 bg-[#FFB800] mx-auto rounded-full" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[{
              icon: Star,
              title: 'Uncompromising Quality',
              description: 'We never settle for less than the best ingredients available.'
            },{
              icon: Globe,
              title: 'Sustainable Sourcing',
              description: 'Supporting local farms and eco-friendly practices is central to our mission.'
            },{
              icon: Heart,
              title: 'Customer Happiness',
              description: 'Your satisfaction is our biggest achievement and priority.'
            }].map((feature, index) => (
              <motion.div 
                key={index}
                variants={featureVariants} 
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, amount: 0.5 }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="p-8 text-center bg-[#09090b]/40 border border-white/5 hover:border-[#FFB800]/50 h-full rounded-[2rem] shadow-lg hover:shadow-[0_0_30px_rgba(255,184,0,0.1)] transition-all duration-300 group relative overflow-hidden">
                   <div className="absolute inset-0 bg-gradient-to-b from-[#FFB800]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                   
                   <div className="relative z-10">
                        <div className="w-16 h-16 mx-auto mb-6 bg-[#121214] rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-300 group-hover:border-[#FFB800]/50">
                             <feature.icon className="w-8 h-8 text-gray-400 group-hover:text-[#FFB800] transition-colors" />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-wide text-white mb-3 group-hover:text-[#FFB800] transition-colors">{feature.title}</h3>
                        <p className="text-sm text-gray-500 font-light leading-relaxed group-hover:text-gray-400 transition-colors">{feature.description}</p>
                   </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
