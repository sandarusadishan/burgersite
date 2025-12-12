import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Mail, Award, Package, Edit, Save, X, Upload, Loader2, Key, Trash2, ShoppingBag, Shield } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { useToast } from '../hooks/use-toast';
import { Label } from '../components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_URL = "https://grilmelt-burger.onrender.com";
const API_URL = `${BASE_URL}/api`;

const Profile = () => {
  const { user, setUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [userOrders, setUserOrders] = useState([]); 
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (user) setFormData({ name: user.name, email: user.email });
  }, [user]);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (!user || !user._id || !user.token) return;
      try {
        const res = await fetch(`${API_URL}/orders/user/${user._id}`, {
          headers: { 'Authorization': `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setUserOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } else {
          setUserOrders([]);
        }
      } catch (error) {
        console.error('Error fetching order history:', error);
        setUserOrders([]);
      }
    };
    if (user && user.token) fetchOrderHistory();
  }, [user]);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else setPreviewUrl(null);
  }, [selectedFile]);

  // --- Profile Update Logic ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user || loading) return;

    setLoading(true);
    const updateFormData = new FormData();
    updateFormData.append('name', formData.name);
    updateFormData.append('email', formData.email);
    if (user.role) updateFormData.append('role', user.role);
    if (selectedFile) updateFormData.append('profilePic', selectedFile);

    try {
      const res = await fetch(`${API_URL}/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${user.token}` }, 
        body: updateFormData,
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: '✅ Profile Updated!', description: 'Saved successfully.', duration: 2000, className: "bg-[#09090b] text-white" });
        if (setUser) {
          const updatedUser = data.user;
          setUser((prev) => ({
            ...prev,
            ...updatedUser,
            profileImage: updatedUser.profileImage || prev.profileImage,
          }));
        }
        setIsEditing(false);
        setSelectedFile(null);
      } else throw new Error(data.message || 'Failed throughout update profile.');
    } catch (error) {
      toast({ title: '❌ Update Failed', description: error.message, variant: 'destructive', duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!user || loading || !user.profileImage) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/${user._id}/profile-image`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: '🗑️ Photo Removed!', description: 'Your profile picture has been removed.', duration: 2000 });
        setUser((prev) => ({ ...prev, profileImage: data.user.profileImage }));
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        throw new Error(data.message || 'Failed to remove photo.');
      }
    } catch (error) {
       toast({ title: '❌ Error', description: error.message, variant: 'destructive', duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!user || loading) return;
    if (passwordData.newPassword.length < 6)
      return toast({ title: 'Password too short', description: 'Min 6 characters.', variant: 'destructive', duration: 2000 });
    if (passwordData.newPassword !== passwordData.confirmNewPassword)
      return toast({ title: 'Mismatch', description: 'Passwords no match.', variant: 'destructive', duration: 2000 });

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/users/change-password/${user._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: '✅ Success', description: 'Password changed.', duration: 2000 });
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setIsChangingPassword(false);
      } else throw new Error(data.message || 'Failed to change password.');
    } catch (error) {
      toast({ title: '❌ Error', description: error.message, variant: 'destructive', duration: 2000 });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setFormData({ name: user.name, email: user.email });
    setSelectedFile(null);
  };

  const handleCancelPasswordChange = () => {
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  if (!user) return <div className="text-center py-20 text-white">Please log in to view your profile.</div>;

  const timestamp = new Date().getTime();
  const displayImage = previewUrl ? previewUrl : user.profileImage ? `${BASE_URL}${user.profileImage}?t=${timestamp}` : 'placeholder';

  const stats = [
    { label: 'Loyalty Points', value: user.loyaltyPoints || 0, icon: Award, color: 'text-[#FFB800]', border: 'border-[#FFB800]/20' },
    { label: 'Total Orders', value: userOrders.length, icon: Package, color: 'text-blue-400', border: 'border-blue-500/20' }, 
    { label: 'Joined', value: user.memberSince ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A', icon: User, color: 'text-purple-400', border: 'border-purple-500/20' },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#FFB800] selection:text-black relative overflow-x-hidden">
      {/* 🌟 Ambient Background */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#FFB800]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="container px-4 pt-32 pb-20 mx-auto relative z-10">
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white drop-shadow-xl text-center md:text-left">
               My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] to-yellow-600">Profile</span>
            </h1>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Main Profile Card */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-6">
            <Card className="p-8 bg-[#09090b]/60 border border-white/5 rounded-[32px] backdrop-blur-md relative overflow-hidden">
               <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent opacity-50" />
               <div className="absolute inset-0 bg-gradient-to-br from-[#FFB800]/5 to-transparent pointer-events-none" />
               
               <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
                 
                 {/* Profile Image with Glow */}
                 <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-br from-[#FFB800] to-blue-500 rounded-full opacity-30 blur-md group-hover:opacity-50 transition-opacity" />
                    <div className="w-32 h-32 rounded-full bg-[#050505] p-1 relative overflow-hidden border border-white/10">
                       {displayImage === 'placeholder' ? (
                          <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center">
                             <User className="w-12 h-12 text-gray-500" />
                          </div>
                       ) : (
                          <img src={displayImage} alt="Profile" className="w-full h-full object-cover rounded-full" />
                       )}
                    </div>
                    {isEditing && (
                        <label className="absolute bottom-0 right-0 p-2 bg-[#FFB800] rounded-full text-black cursor-pointer hover:bg-[#FFD600] transition-colors shadow-lg">
                           <Upload className="w-4 h-4" />
                           <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="hidden" />
                        </label>
                    )}
                 </div>

                 <div className="flex-1 text-center md:text-left">
                    {isEditing ? (
                        <div className="space-y-4 max-w-sm">
                           <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-10 text-sm bg-black/40 border-white/10 focus:border-[#FFB800] rounded-xl font-bold" placeholder="Your Name" />
                           <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-10 text-sm bg-black/40 border-white/10 focus:border-[#FFB800] rounded-xl text-gray-400" placeholder="Your Email" />
                        </div>
                    ) : (
                        <div>
                           <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                              <h2 className="text-3xl font-bold text-white tracking-tight">{user.name}</h2>
                              <Badge className={`border-0 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 ${user.role === 'admin' ? 'bg-[#FFB800] text-black' : 'bg-blue-500/20 text-blue-400'}`}>{user.role}</Badge>
                           </div>
                           <p className="text-gray-400 flex items-center justify-center md:justify-start gap-2 mb-4 font-mono text-sm">
                              <Mail className="w-4 h-4 text-[#FFB800]" /> {user.email}
                           </p>
                        </div>
                    )}
                 </div>
               </div>

               {/* Stats Grid */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                 {stats.map((stat, i) => (
                    <div key={i} className={`p-4 rounded-2xl bg-[#050505]/50 border ${stat.border} flex flex-col items-center justify-center relative overflow-hidden group`}>
                       <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color.split('-')[1]}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                       <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                       <p className="text-2xl font-black text-white tracking-tight">{stat.value}</p>
                       <p className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">{stat.label}</p>
                    </div>
                 ))}
               </div>
            </Card>

            {/* Actions & Settings */}
            <Card className="p-8 bg-[#09090b]/60 border border-white/5 rounded-[32px] backdrop-blur-md">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                   <Shield className="w-5 h-5 text-[#FFB800]" /> Account Settings
                </h3>

                {isEditing ? (
                   <div className="p-6 rounded-2xl bg-[#050505]/30 border border-white/5 space-y-4">
                       <div className="flex gap-4">
                          <Button onClick={handleUpdateProfile} disabled={loading} className="flex-1 bg-[#FFB800] text-black hover:bg-[#FFD600] font-bold rounded-xl h-10 text-sm">
                             {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Changes
                          </Button>
                          <Button onClick={handleCancelEdit} variant="outline" className="flex-1 border-white/10 hover:bg-white/10 rounded-xl h-10 text-sm">Cancel</Button>
                       </div>
                       {user.profileImage && (
                          <Button onClick={handleRemovePhoto} variant="destructive" className="w-full bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 rounded-xl h-10 text-sm">
                              Remove Profile Photo
                          </Button>
                       )}
                   </div>
                ) : isChangingPassword ? (
                   <form onSubmit={handlePasswordChange} className="p-6 rounded-2xl bg-[#050505]/30 border border-white/5 space-y-4">
                       <Input type="password" placeholder="Current Password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} className="h-10 text-sm bg-black/40 border-white/10 rounded-xl" required />
                       <div className="grid grid-cols-2 gap-4">
                          <Input type="password" placeholder="New Password" value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} className="h-10 text-sm bg-black/40 border-white/10 rounded-xl" required />
                          <Input type="password" placeholder="Confirm Password" value={passwordData.confirmNewPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })} className="h-10 text-sm bg-black/40 border-white/10 rounded-xl" required />
                       </div>
                       <div className="flex gap-4">
                          <Button type="submit" disabled={loading} className="flex-1 bg-red-500 text-white hover:bg-red-600 font-bold rounded-xl h-10 text-sm">Update Password</Button>
                          <Button type="button" onClick={handleCancelPasswordChange} variant="outline" className="flex-1 border-white/10 hover:bg-white/10 rounded-xl h-10 text-sm">Cancel</Button>
                       </div>
                   </form>
                ) : (
                    <div className="space-y-3">
                        <Button variant="outline" onClick={() => setIsEditing(true)} className="w-full justify-start h-12 rounded-xl border-white/5 bg-[#050505]/30 hover:bg-white/5 hover:border-[#FFB800]/30 text-gray-300 hover:text-white transition-all group">
                            <Edit className="w-4 h-4 mr-3 text-gray-500 group-hover:text-[#FFB800]" /> Edit Profile
                        </Button>
                        <Button variant="outline" onClick={() => setIsChangingPassword(true)} className="w-full justify-start h-12 rounded-xl border-white/5 bg-[#050505]/30 hover:bg-white/5 hover:border-red-500/30 text-gray-300 hover:text-white transition-all group">
                            <Key className="w-4 h-4 mr-3 text-gray-500 group-hover:text-red-500" /> Change Password
                        </Button>
                        <Button variant="outline" className="w-full justify-start h-12 rounded-xl border-white/5 bg-[#050505]/30 hover:bg-white/5 text-gray-500 hover:text-gray-300 transition-all opacity-50 cursor-not-allowed">
                            Notification Preferences (Coming Soon)
                        </Button>
                    </div>
                )}
            </Card>
          </motion.div>

          {/* Sidebar: Recent Activity */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
             <Card className="p-8 bg-[#09090b]/60 border border-white/5 rounded-[32px] backdrop-blur-md sticky top-32">
                 <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-blue-400" /> Recent Activity
                 </h3>
                 
                 {userOrders.length > 0 ? (
                    <div className="relative border-l border-white/10 ml-3 space-y-6">
                       {userOrders.slice(0, 5).map((order, i) => (
                          <div key={order._id} className="relative pl-6">
                             <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#050505] border border-white/20" />
                             <div className="p-4 rounded-2xl bg-[#050505]/30 border border-white/5 hover:border-[#FFB800]/20 transition-colors group cursor-pointer">
                                <div className="flex justify-between items-start mb-1">
                                   <span className="text-xs font-bold text-white group-hover:text-[#FFB800] transition-colors">Order #{order._id.slice(-6)}</span>
                                   <span className="text-xs font-mono text-[#FFB800]">LKR {(order.totalAmount || 0).toFixed(0)}</span>
                                </div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString()}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 ) : (
                    <div className="text-center py-12 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">No recent activity.</p>
                    </div>
                 )}
             </Card>
          </motion.div>

        </div>
      </main>
    </div>
  );
};

export default Profile;