import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Award, Gift, Star, Crown, ChevronRight, CheckCircle, Sparkles, Lock, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const Rewards = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    
    // User data වෙතින් Points ලබා ගැනීම
    const points = user && user.loyaltyPoints ? user.loyaltyPoints : 0;
    
    // 🎯 ඔබට Reward එක Redeem කිරීමට අවශ්‍ය Points ගණන මෙහි සකසන්න
    const nextRewardPoints = 500;
    const progress = Math.min((points / nextRewardPoints) * 100, 100);

    // --- Static Data ---
    const badges = [
        { id: 1, name: 'First Order', icon: '🎉', requirement: 10 },
        { id: 2, name: 'Burger Lover', icon: '🍔', requirement: 50 },
        { id: 3, name: 'Regular Customer', icon: '⭐', requirement: 100 },
        { id: 4, name: 'Gold Member', icon: '👑', requirement: 500 },
        { id: 5, name: 'Legendary', icon: '🏆', requirement: 1000 },
    ];

    const rewards = [
        { points: 100, reward: 'Free Drink', icon: '🥤', code: 'FREE_DRINK100' },
        { points: 250, reward: 'Free Fries', icon: '🍟', code: 'FREE_FRIES250' },
        { points: 500, reward: 'Free Burger', icon: '🍔', code: 'FREE_BURGER500' },
        { points: 1000, reward: 'Free Meal Combo', icon: '🎁', code: 'FREE_MEAL1000' },
    ];

    // --- Action Logic ---
    const handleRedeem = (item) => {
        if (points < item.points) {
            toast({
                title: "❌ Insufficient Points",
                description: `You need ${item.points - points} more points to redeem this reward.`,
                variant: "destructive",
                duration: 2000,
            });
            return;
        }

        // Simulate successful redemption
        toast({
            title: `✅ Reward Redeemed!`,
            description: `You successfully redeemed a ${item.reward}! Use coupon code: ${item.code}`,
            duration: 8000,
            className: "bg-[#09090b] border-[#FFB800]/20 text-white"
        });
    };

    // --- UI Helpers ---
    const getMemberSinceDate = () => {
        if (user?.createdAt) {
            return new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
        }
        return 'N/A';
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FFB800] selection:text-black relative overflow-hidden">
            {/* 🌟 Background Ambient Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-[#FFB800]/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px] pointer-events-none" />
            
            <Navbar />
            
            <main className="container max-w-6xl px-4 pt-48 pb-20 mx-auto relative z-10">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-block relative mb-4">
                        <div className="absolute inset-0 bg-[#FFB800] blur-xl opacity-20 animate-pulse"></div>
                        <Badge className="relative bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/20 px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md shadow-[0_0_15px_-3px_rgba(255,184,0,0.3)]">
                           <Crown className="w-3 h-3 mr-2" /> Loyalty Program
                        </Badge>
                    </div>
                     <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-6 relative z-10 drop-shadow-xl">
                        Royal <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FFD600] to-yellow-600 drop-shadow-[0_0_35px_rgba(255,184,0,0.5)]">Rewards</span>
                    </h1>
                     <p className="text-gray-400 max-w-xl mx-auto text-lg font-medium leading-relaxed tracking-wide">
                        Earn points with every bite and unlock exclusive treasures.
                    </p>
                </motion.div>

                {/* 💳 Hero Cards Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {/* Points Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#FFB800]/10 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <Card className="relative h-full overflow-hidden bg-gradient-to-br from-[#1a1a1a] to-black border border-[#FFB800]/20 p-8 md:p-10 rounded-3xl shadow-[0_0_50px_-20px_rgba(0,0,0,0.5)] flex flex-col justify-between">
                             {/* Card Texture */}
                             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #FFB800 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                             
                             <div className="relative z-10 flex justify-between items-start mb-8">
                                 <div>
                                     <h2 className="text-sm font-bold text-[#FFB800] uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                         <Sparkles className="w-4 h-4" /> Current Balance
                                     </h2>
                                     <div className="flex items-baseline gap-2">
                                         <span className="text-7xl font-black text-white tracking-tighter drop-shadow-lg">{points}</span>
                                         <span className="text-xl font-bold text-gray-500">PTS</span>
                                     </div>
                                 </div>
                                 <div className="w-16 h-16 rounded-full bg-[#FFB800]/10 border border-[#FFB800]/20 flex items-center justify-center animate-pulse-slow">
                                     <Crown className="w-8 h-8 text-[#FFB800]" />
                                 </div>
                             </div>

                            <div className="relative z-10 space-y-4">
                                <div className="flex justify-between text-sm font-bold tracking-wide">
                                    <span className="text-gray-400">Next Unlock</span>
                                    <span className="text-[#FFB800]">{Math.floor(progress)}% Complete</span>
                                </div>
                                <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="absolute h-full bg-gradient-to-r from-[#FFB800] to-[#cb9200] shadow-[0_0_20px_#FFB800]"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 font-mono mt-2">Member since {getMemberSinceDate()} • ID: {user?._id?.slice(-8).toUpperCase()}</p>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Status Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                         <Card className="h-full bg-[#09090b]/50 border border-white/5 p-8 rounded-3xl flex flex-col justify-center items-center text-center backdrop-blur-sm relative overflow-hidden group hover:border-[#FFB800]/30 transition-colors">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-b from-[#FFB800]/20 to-transparent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                                <Star className="w-10 h-10 text-[#FFB800] fill-[#FFB800]" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Gold Tier</h3>
                            <p className="text-sm text-gray-400 leading-relaxed mb-6">You are in the top 5% of customers. Enjoy priority delivery and exclusive offers.</p>
                             <Button variant="outline" className="border-[#FFB800]/30 text-[#FFB800] hover:bg-[#FFB800] hover:text-black font-bold tracking-wide rounded-xl">
                                 View Benefits
                             </Button>
                         </Card>
                    </motion.div>
                </div>

                {/* 🎁 Rewards Grid */}
                <div className="mb-20">
                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-[#FFB800]/10 flex items-center justify-center border border-[#FFB800]/20">
                            <Gift className="w-5 h-5 text-[#FFB800]" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Available Rewards</h2>
                     </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {rewards.map((item, index) => {
                            const canRedeem = points >= item.points;
                            return (
                                <motion.div
                                    key={item.points}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + (index * 0.1) }}
                                >
                                    <Card className={`relative h-full p-1 rounded-3xl transition-all duration-300 group ${canRedeem ? 'bg-gradient-to-b from-white/10 to-transparent hover:-translate-y-2' : 'opacity-60 grayscale'}`}>
                                        <div className="h-full bg-[#09090b] rounded-[22px] p-6 flex flex-col items-center text-center relative overflow-hidden">
                                            {/* Glow Effect */}
                                            {canRedeem && <div className="absolute inset-0 bg-[#FFB800]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />}
                                            
                                            <div className="w-16 h-16 text-4xl mb-4 bg-white/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 relative z-10">
                                                {item.icon}
                                            </div>
                                            
                                            <div className="mb-6 relative z-10">
                                                <h3 className="font-bold text-white text-lg mb-1">{item.reward}</h3>
                                                <p className="text-xs font-bold text-[#FFB800] uppercase tracking-widest">{item.points} PTS</p>
                                            </div>

                                            <Button
                                                className={`w-full mt-auto font-bold rounded-xl transition-all relative z-10 ${
                                                    canRedeem 
                                                    ? 'bg-[#FFB800] text-black hover:bg-[#FFD600] shadow-[0_0_20px_-5px_rgba(255,184,0,0.4)]' 
                                                    : 'bg-white/5 text-gray-500 hover:bg-white/10'
                                                }`}
                                                onClick={() => canRedeem && handleRedeem(item)}
                                                disabled={!canRedeem}
                                            >
                                                {canRedeem ? (
                                                    <span className="flex items-center gap-2">Redeem <ChevronRight className="w-4 h-4" /></span>
                                                ) : (
                                                    <span className="flex items-center gap-2"><Lock className="w-3 h-3" /> Locked</span>
                                                )}
                                            </Button>
                                        </div>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* 🏆 Badges Grid */}
                <div>
                     <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                            <Award className="w-5 h-5 text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Achievements</h2>
                     </div>

                     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {badges.map((badge, index) => {
                            const isUnlocked = points >= badge.requirement;
                            return (
                                <motion.div
                                    key={badge.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.6 + (index * 0.05) }}
                                >
                                    <div className={`aspect-square rounded-3xl border ${isUnlocked ? 'bg-[#FFB800]/10 border-[#FFB800]/30' : 'bg-white/5 border-white/5'} p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:scale-105 group relative overflow-hidden`}>
                                         {isUnlocked && <div className="absolute inset-0 bg-[#FFB800]/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />}
                                         
                                         <div className={`text-4xl mb-3 ${isUnlocked ? 'scale-110 drop-shadow-[0_0_10px_rgba(255,184,0,0.5)]' : 'grayscale opacity-50'}`}>
                                             {badge.icon}
                                         </div>
                                         <h3 className={`text-sm font-bold mb-1 ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>{badge.name}</h3>
                                         
                                         {isUnlocked ? (
                                             <Badge variant="outline" className="bg-[#FFB800]/20 text-[#FFB800] border-0 text-[10px] px-2 py-0.5"><CheckCircle className="w-3 h-3 mr-1" /> Unlocked</Badge>
                                         ) : (
                                             <span className="text-[10px] text-gray-600 font-mono">{badge.requirement} PTS</span>
                                         )}
                                    </div>
                                </motion.div>
                            );
                        })}
                     </div>
                </div>

            </main>
        </div>
    );
};

export default Rewards;