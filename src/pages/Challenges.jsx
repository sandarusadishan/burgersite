import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Trophy, Target, Calendar, ArrowLeft, Gift, RotateCw, Loader2, Sparkles, Crown, Zap, Flame } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/use-toast';
import { mockChallenges, mockLeaderboard } from '../data/mockData';
import Navbar from "../components/Navbar"; 
import { useAuth } from "../contexts/AuthContext"; 

// --- Configuration: Must match backend configuration ---
const PRIZES = [
  { name: 'LKR 100 OFF', type: 'win', description: 'A small boost for your next meal!' },
  { name: 'FREE DRINK', type: 'win', description: 'Enjoy a free drink on us!' },
  { name: '5% OFF', type: 'win', description: 'Get 5% off your next order!' },
  { name: 'TRY AGAIN', type: 'lose', description: 'Better luck tomorrow!' },
];

const DailyInstantReward = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [canPlay, setCanPlay] = useState(false); 
  const [result, setResult] = useState(null); 
  const [loading, setLoading] = useState(true); 
  
  const API_URL = 'https://grilmelt-burger.onrender.com/api/rewards';

  useEffect(() => {
      const fetchStatus = async () => {
          if (!user || !user.token) {
              setCanPlay(false);
              setLoading(false);
              return;
          }
          
          try {
              const response = await fetch(`${API_URL}/status`, {
                  headers: { 'Authorization': `Bearer ${user.token}` }
              });
              const data = await response.json();
              
              if (response.ok) {
                  setCanPlay(data.canPlay);
                  if (data.lastResult) {
                      const lastPrize = PRIZES.find(p => p.name === data.lastResult) || { 
                          name: data.lastResult, 
                          type: data.lastResult === 'TRY AGAIN' ? 'lose' : 'win', 
                          code: 'SAVED',
                          description: 'You already claimed your prize for today.' 
                      };
                      setResult(lastPrize);
                  }
              } else {
                  console.error(data.message);
              }
          } catch (error) {
              console.error("Failed to fetch daily play status:", error);
          } finally {
              setLoading(false);
          }
      };
      fetchStatus();
  }, [user]);

  const handlePlayClick = async () => {
      if (!user || loading || !canPlay) return;

      setLoading(true);
      try {
          const response = await fetch(`${API_URL}/play`, {
              method: 'POST',
              headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${user.token}` 
              },
              body: JSON.stringify({})
          });
          const data = await response.json();

          if (response.ok && data.success) {
              const finalResult = data.prize;
              setResult(finalResult);
              setCanPlay(false); 

              if (finalResult.type === 'win') {
                  toast({
                      title: `🎉 Instant Win!`,
                      description: `You won ${finalResult.name}!`,
                      className: "bg-[#09090b] border-[#FFB800]/20 text-white"
                  });
              } else {
                  toast({
                      title: 'Better luck next time!',
                      description: finalResult.description,
                      variant: 'default',
                  });
              }
          } else {
              toast({ title: 'Error', description: data.message, variant: 'destructive' });
              setCanPlay(false); 
          }
      } catch (error) {
          toast({ title: 'Network Error', description: 'Could not connect to server.', variant: 'destructive' });
      } finally {
          setLoading(false);
      }
  };
  
  if (!user) {
    return (
        <Card className="p-8 text-center bg-[#09090b]/40 border border-[#FFB800]/20 rounded-3xl backdrop-blur-md relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#FFB800]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <h2 className="mb-3 text-2xl font-bold text-white relative z-10">Login to Play</h2>
            <p className="mb-6 text-gray-400 relative z-10">Sign in to unlock your daily chance to win exclusive rewards.</p>
            <Button onClick={() => navigate('/auth')} className="bg-[#FFB800] text-black hover:bg-[#FFD600] font-bold rounded-xl relative z-10">
                Log In Now
            </Button>
        </Card>
    );
  }

  const isPlayedToday = result && !canPlay;

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-[#1a1a1a] to-black rounded-3xl p-1">
        {/* Animated Border Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFB800] via-[#FFD600] to-[#FFB800] opacity-20 animate-pulse" />
        
        <div className="relative bg-[#09090b] rounded-[22px] p-8 md:p-10 overflow-hidden">
             {/* Background Effects */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFB800]/10 rounded-full blur-[80px] pointer-events-none" />
             
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="text-center md:text-left">
                     <Badge className="mb-3 bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/20 hover:bg-[#FFB800]/20 transition-colors uppercase tracking-widest font-bold text-[10px] px-3 py-1">
                         Daily Quest
                     </Badge>
                     <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tight mb-2">
                         DAILY <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] to-yellow-500">LOOT</span>
                     </h2>
                     <p className="text-gray-400 max-w-sm">Open your daily mystery box to win free food, discounts, and points.</p>
                 </div>

                 <div className="flex-1 w-full max-w-md bg-white/5 rounded-2xl p-6 border border-white/10 backdrop-blur-sm">
                     {loading ? (
                        <div className="flex flex-col items-center justify-center py-4">
                            <Loader2 className='w-8 h-8 text-[#FFB800] animate-spin mb-3' />
                            <span className="text-sm font-bold text-gray-400">Loading magic...</span>
                        </div>
                     ) : isPlayedToday ? (
                        <div className="text-center">
                            <div className="inline-flex p-3 rounded-full bg-white/5 mb-3 border border-white/10">
                                {result.type === 'win' ? <Gift className="w-6 h-6 text-[#FFB800]" /> : <RotateCw className="w-6 h-6 text-gray-400" />}
                            </div>
                            <h4 className={`text-xl font-bold mb-1 ${result.type === 'win' ? 'text-[#FFB800]' : 'text-gray-300'}`}>
                                {result.type === 'win' ? result.name : "Come Back Tomorrow!"}
                            </h4>
                            <p className="text-sm text-gray-500 mb-2">{result.description}</p>
                            {result.code && (
                                <div className="bg-black/50 p-2 rounded-lg border border-[#FFB800]/20 inline-block">
                                    <code className="text-[#FFB800] font-mono font-bold tracking-widest">{result.code}</code>
                                </div>
                            )}
                        </div>
                     ) : (
                        <div className="text-center">
                            <Button 
                                onClick={handlePlayClick} 
                                size="lg" 
                                className="w-full bg-gradient-to-r from-[#FFB800] to-[#FF9900] text-black font-black text-lg uppercase tracking-wider py-6 rounded-xl shadow-[0_0_30px_-5px_rgba(255,184,0,0.4)] hover:shadow-[0_0_50px_-10px_rgba(255,184,0,0.6)] hover:scale-[1.02] transition-all"
                            >
                                <Gift className="w-5 h-5 mr-3 animate-bounce" /> Open Mystery Box
                            </Button>
                        </div>
                     )}
                 </div>
             </div>
        </div>
    </Card>
  );
};

const Challenges = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FFB800] selection:text-black relative overflow-hidden">
      {/* 🌟 Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#FFB800]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

      <Navbar /> 
      
      <main className="container max-w-6xl px-4 pt-48 pb-20 mx-auto relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block relative mb-4">
            <div className="absolute inset-0 bg-[#FFB800] blur-xl opacity-20 animate-pulse"></div>
            <Badge className="relative bg-[#FFB800]/10 text-[#FFB800] border-[#FFB800]/20 px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md shadow-[0_0_15px_-3px_rgba(255,184,0,0.3)]">
               <Target className="w-3 h-3 mr-2" /> Daily Quests
            </Badge>
          </div>
          
           {/* FONT SIZE STRICTLY MATCHED: text-4xl md:text-5xl */}
          <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-white mb-6 relative z-10 drop-shadow-xl">
             Challenges & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FFD600] to-yellow-600 drop-shadow-[0_0_35px_rgba(255,184,0,0.5)]">Rewards</span>
          </h1>
          
          <p className="text-gray-400 max-w-xl mx-auto text-lg font-medium leading-relaxed tracking-wide">
            Complete daily missions, climb the leaderboard, and unlock legendary prizes.
          </p>
        </motion.div>

        {/* Daily Reward Section */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-16 max-w-4xl mx-auto"
        >
          <DailyInstantReward /> 
        </motion.div>

          <div className="grid gap-8 lg:grid-cols-3 items-start">
            {/* Active Challenges List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                   <div className="bg-[#FFB800]/10 p-2 rounded-lg border border-[#FFB800]/20">
                       <Flame className="w-5 h-5 text-[#FFB800]" />
                   </div>
                   <h2 className="text-2xl font-bold text-white">Active Challenges</h2>
              </div>
              
              {mockChallenges.map((challenge, index) => (
                <motion.div 
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (index * 0.1) }}
                >
                    <Card className="group relative overflow-hidden bg-[#09090b]/60 border border-white/5 hover:border-[#FFB800]/30 transition-all duration-300 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                      <div className="flex items-start justify-between gap-6 mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold text-white group-hover:text-[#FFB800] transition-colors">{challenge.name}</h3>
                            <Badge variant="outline" className="text-[10px] bg-white/5 border-white/10 text-gray-400">
                                <Calendar className="w-3 h-3 mr-1" /> {challenge.expiresAt}
                            </Badge>
                          </div>
                          <p className="text-gray-400 leading-relaxed text-sm mb-4">{challenge.description}</p>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-[#FFB800]/10 border border-[#FFB800]/20 rounded-xl p-3 min-w-[80px]">
                            <span className="text-[#FFB800] font-black text-xl">+{challenge.reward}</span>
                            <span className="text-[10px] font-bold text-[#FFB800]/70 uppercase">PTS</span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-gray-500">
                          <span>Progress</span>
                          <span className={challenge.progress === challenge.total ? "text-green-400" : "text-gray-300"}>
                            {challenge.progress} / {challenge.total}
                          </span>
                        </div>
                        <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(challenge.progress / challenge.total) * 100}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-[#FFB800] to-yellow-600 rounded-full shadow-[0_0_10px_#FFB800]"
                           />
                        </div>
                      </div>
                    </Card>
                </motion.div>
              ))}
            </div>

            {/* Leaderboard Panel */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="lg:col-span-1"
            >
              <Card className="sticky top-32 bg-[#09090b]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
                  <div className="bg-purple-500/10 p-2 rounded-lg border border-purple-500/20">
                      <Trophy className="w-5 h-5 text-purple-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Top Players</h2>
                </div>
                
                <div className="space-y-2">
                  {mockLeaderboard.map((entry, index) => (
                    <div 
                      key={entry.rank}
                      className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                        index < 3 ? 'bg-gradient-to-r from-white/5 to-transparent border border-white/5 hover:border-white/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-black text-xs border ${
                        entry.rank === 1 ? 'bg-[#FFB800] text-black border-[#FFB800] shadow-[0_0_10px_#FFB800]' :
                        entry.rank === 2 ? 'bg-gray-300 text-black border-gray-300' :
                        entry.rank === 3 ? 'bg-amber-700 text-white border-amber-700' :
                        'bg-white/5 text-gray-500 border-transparent'
                      }`}>
                        {entry.rank}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm truncate ${index < 3 ? 'text-white' : 'text-gray-400'}`}>{entry.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                             {entry.badges.slice(0, 3).map((badge, idx) => (
                                <span key={idx} className="text-xs bg-black/30 rounded px-1">{badge}</span>
                             ))}
                        </div>
                      </div>
                      
                      <div className="text-right">
                         <span className="block font-black text-[#FFB800] text-sm">{entry.points}</span>
                         <span className="text-[10px] text-gray-600 font-bold uppercase">PTS</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                    <Button variant="ghost" className="text-xs text-gray-500 hover:text-white hover:bg-white/5 w-full">
                        View Full Leaderboard
                    </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        
      </main>
    </div>
  );
};

export default Challenges;