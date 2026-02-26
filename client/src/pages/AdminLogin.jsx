import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldAlert, Key, Lock, Eye, EyeOff } from 'lucide-react';
import api from '../utils/api';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/admin/login', { password });
            if (response.data.success) {
                localStorage.setItem('adminToken', response.data.token);
                navigate('/admin/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Authorization Revoked by System');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-horror-bg">
            <div className="scanline"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="horror-card p-10 w-full max-w-md rounded-none border-b-4 border-b-red-600 relative overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute top-2 right-2 flex gap-1">
                    <div className="w-1 h-1 bg-red-600 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-red-900 rounded-full"></div>
                </div>

                <div className="flex flex-col items-center mb-10">
                    <div className="p-4 bg-red-950/20 border border-red-600 mb-4 shadow-[0_0_15px_rgba(255,0,0,0.2)]">
                        <ShieldAlert size={40} className="text-neon-red animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-black text-neon-red glow-text tracking-tighter uppercase italic glitch">
                        Command Access
                    </h2>
                    <div className="w-16 h-0.5 bg-red-900 mt-2"></div>
                </div>

                {error && (
                    <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-red-500 mb-8 bg-red-950/40 p-4 border-l-2 border-red-600 text-[10px] font-mono uppercase tracking-widest leading-relaxed"
                    >
                        <span className="font-bold mr-2">[ACCESS_DENIED]:</span> {error}
                    </motion.div>
                )}

                <form onSubmit={handleLogin} className="space-y-8">
                    <div className="relative group">
                        <label className="block text-red-500 text-[9px] tracking-[0.4em] mb-3 uppercase font-mono font-bold">Secure Access Key</label>
                        <div className="relative flex items-center">
                            <Key size={18} className="absolute left-3 text-red-900 group-focus-within:text-neon-red transition-colors" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full bg-black/40 border border-red-900 focus:border-neon-red text-white p-4 pl-12 pr-12 outline-none transition-all placeholder:text-gray-900 font-mono text-sm tracking-widest"
                                placeholder="****************"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 text-red-900 hover:text-neon-red transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="horror-btn w-full flex items-center justify-center gap-3 font-black text-xs group relative overflow-hidden py-4"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            {loading ? 'AUTHENTICATING...' : <><Lock size={14} /> BYPASS FIREWALL</>}
                        </span>
                        <div className="absolute inset-x-0 bottom-0 h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                    </button>
                </form>

                <div className="mt-12 space-y-2">
                    <p className="text-[8px] text-gray-800 text-center uppercase tracking-[0.4em] font-mono italic">
                        Warning: All attempts are being logged by Hawkins Lab
                    </p>
                    <div className="flex justify-center gap-4">
                        <div className="h-0.5 w-4 bg-red-950"></div>
                        <div className="h-0.5 w-4 bg-red-950"></div>
                        <div className="h-0.5 w-4 bg-red-950"></div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
