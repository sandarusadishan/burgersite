import React, { useMemo } from 'react';
import { Card } from './ui/card';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
    BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { TrendingUp, DollarSign, ShoppingBag, CreditCard, Box, Layers, PieChart as PieIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = [
  '#FF6B6B', // Red/Pink
  '#4ECDC4', // Teal
  '#FFE66D', // Yellow
  '#1A535C', // Dark Teal
  '#FF9F43', // Orange
  '#5F27CD', // Purple
  '#54A0FF', // Blue
  '#00D2D3', // Cyan
  '#FF6B6B'
];

const AdminReports = ({ orders = [], products = [] }) => {
    
    // --- Data Processing ---

    // 1. Calculate Total Revenue & Trends
    const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // 2. Prepare Data for Sales Trend Chart (Group by Date)
    const salesData = useMemo(() => {
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        return last7Days.map(date => {
            const dailyOrders = orders.filter(o => o.createdAt && o.createdAt.startsWith(date));
            const dailyRevenue = dailyOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
            return {
                date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
                sales: dailyRevenue,
                orders: dailyOrders.length
            };
        });
    }, [orders]);

    // 3. Prepare Data for Status Distribution
    const statusData = useMemo(() => {
        const counts = orders.reduce((acc, o) => {
            acc[o.status] = (acc[o.status] || 0) + 1;
            return acc;
        }, {});

        return [
            { name: 'Pending', value: counts['pending'] || 0, color: '#FFD93D' }, 
            { name: 'Preparing', value: counts['preparing'] || 0, color: '#FF9F43' },
            { name: 'On Way', value: counts['on-the-way'] || 0, color: '#54A0FF' },
            { name: 'Delivered', value: counts['delivered'] || 0, color: '#4ECDC4' },
        ].filter(item => item.value > 0);
    }, [orders]);

    // 4. Prepare Category Performance
    const categoryData = useMemo(() => {
        const counts = {};
        products.forEach(p => {
            if (p.category) {
                counts[p.category] = (counts[p.category] || 0) + 1; 
            }
        });
        
        return Object.keys(counts)
            .map((cat, index) => ({ 
                name: cat, 
                value: counts[cat],
                fill: COLORS[index % COLORS.length] // Assign unique color
            }))
            .sort((a, b) => b.value - a.value);
    }, [products]);


    // --- Custom Tooltips ---
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#09090b]/95 border border-white/10 p-4 rounded-xl backdrop-blur-md shadow-2xl">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill || '#fff' }}></div>
                            <span className="text-white font-bold text-sm">
                                {entry.name === 'sales' ? `LKR ${entry.value.toLocaleString()}` : entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-12 animate-in fade-in zoom-in duration-500 pb-12">
            
            {/* 📊 Section 1: Financial Overview */}
            <div>
                 <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                     <div className="p-1.5 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-lg border border-green-500/20">
                         <DollarSign className="w-5 h-5 text-green-400" />
                     </div>
                     Financial Insights
                 </h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Card className="p-5 bg-[#09090b]/60 border border-white/5 rounded-2xl relative overflow-hidden group">
                             <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B6B]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                             <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest relative z-10">Total Revenue</p>
                             <h3 className="text-3xl font-black text-white mt-1 relative z-10">LKR {totalRevenue.toLocaleString()}</h3>
                        </Card>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Card className="p-5 bg-[#09090b]/60 border border-white/5 rounded-2xl relative overflow-hidden group">
                             <div className="absolute inset-0 bg-gradient-to-br from-[#4ECDC4]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                             <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest relative z-10">Total Orders</p>
                             <h3 className="text-3xl font-black text-white mt-1 relative z-10">{orders.length}</h3>
                        </Card>
                    </motion.div>

                    <motion.div whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Card className="p-5 bg-[#09090b]/60 border border-white/5 rounded-2xl relative overflow-hidden group">
                             <div className="absolute inset-0 bg-gradient-to-br from-[#FFE66D]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                             <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest relative z-10">Avg Order Value</p>
                             <h3 className="text-3xl font-black text-white mt-1 relative z-10">LKR {averageOrderValue.toFixed(0)}</h3>
                        </Card>
                    </motion.div>
                </div>
            </div>

            {/* 📈 Section 2: Sales Performance (Full Width) */}
            <Card className="p-6 bg-[#09090b]/60 border border-white/5 rounded-[24px] backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                           <TrendingUp className="w-5 h-5 text-[#FF6B6B]" /> Sales Trends
                        </h3>
                        <p className="text-gray-500 text-xs mt-1">Revenue over the last 7 days</p>
                    </div>
                </div>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#FF6B6B" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#FF6B6B" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                            <XAxis dataKey="date" stroke="#666" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} dx={-10} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FF6B6B', strokeWidth: 1, strokeDasharray: '5 5' }} />
                            <Area 
                                type="monotone" 
                                dataKey="sales" 
                                stroke="#FF6B6B" 
                                strokeWidth={4}
                                fillOpacity={1} 
                                fill="url(#colorSales)" 
                                activeDot={{ r: 8, strokeWidth: 0, fill: '#fff' }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            {/* 🍕 Section 3: Detailed Breakdown (Split View) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Inventory Chart */}
                <Card className="p-8 bg-[#09090b]/60 border border-white/5 rounded-[32px] backdrop-blur-md">
                     <div className="mb-8">
                         <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Layers className="w-5 h-5 text-[#4ECDC4]" /> Inventory by Category
                         </h3>
                         <p className="text-gray-500 text-sm mt-1">Distribution of products across menu</p>
                     </div>
                     <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={categoryData} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" fontSize={10} tickLine={false} axisLine={false} dy={10} interval={0} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                                <Bar dataKey="value" radius={[8, 8, 8, 8]}>
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                     </div>
                </Card>

                {/* Status Pie Chart */}
                <Card className="p-8 bg-[#09090b]/60 border border-white/5 rounded-[32px] backdrop-blur-md">
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                           <PieIcon className="w-5 h-5 text-[#FFE66D]" /> Order Status
                        </h3>
                        <p className="text-gray-500 text-sm mt-1">Current status of all active orders</p>
                    </div>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                    cornerRadius={8}
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0)" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36} 
                                    iconType="circle"
                                    formatter={(value, entry) => <span className="text-gray-400 font-bold ml-2">{value}</span>} 
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

        </div>
    );
};

export default AdminReports;
