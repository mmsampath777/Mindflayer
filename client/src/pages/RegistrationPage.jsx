import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Ghost, User, Users, Phone } from 'lucide-react';
import api from '../utils/api';

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        teamName: '',
        teamLeader: '',
        teamCount: 2,
        mobile: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/teams/register', formData);
            if (response.data.success) {
                localStorage.setItem('userTeamId', response.data.teamId);
                navigate('/start-event');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative bg-horror-bg">
            <div className="scanline"></div>

            {/* Background Image / Atmosphere */}
            <div
                className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat grayscale brightness-50"
                style={{ backgroundImage: "url('https://wallpapers.com/images/hd/stranger-things-mind-flayer-8eaj0b64h7h3x6i4.jpg')" }}
            ></div>

            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,_#400000_0%,_transparent_50%)]"></div>
                <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,_#400000_0%,_transparent_50%)]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "backOut" }}
                className="horror-card p-10 w-full max-w-lg rounded-none relative z-10 border-t-4 border-t-neon-red"
            >
                <div className="text-center mb-10">
                    <Ghost size={48} className="text-neon-red mx-auto mb-4 animate-pulse" />
                    <h2 className="text-4xl font-black text-neon-red glow-text tracking-tighter uppercase italic glitch">
                        Team Registration
                    </h2>
                    <p className="text-gray-500 text-[10px] tracking-[0.4em] uppercase mt-2 font-mono"> Hawkins Information Technology</p>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-red-500 mb-6 bg-red-950/30 p-4 border-l-4 border-red-600 text-xs font-mono"
                    >
                        [ERROR]: {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="relative group">
                        <label className="block text-neon-red text-[10px] tracking-[0.3em] mb-2 uppercase font-mono font-bold">Team Name</label>
                        <div className="flex items-center">
                            <Users size={18} className="absolute left-3 text-red-900 group-focus-within:text-neon-red transition-colors" />
                            <input
                                type="text"
                                required
                                className="w-full bg-black/50 border-b-2 border-red-900 focus:border-neon-red text-white p-3 pl-10 outline-none transition-all placeholder:text-gray-800 font-mono text-sm"
                                placeholder="THE HELLFIRE CLUB"
                                value={formData.teamName}
                                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="block text-neon-red text-[10px] tracking-[0.3em] mb-2 uppercase font-mono font-bold">Team Leader</label>
                        <div className="flex items-center">
                            <User size={18} className="absolute left-3 text-red-900 group-focus-within:text-neon-red transition-colors" />
                            <input
                                type="text"
                                required
                                className="w-full bg-black/50 border-b-2 border-red-900 focus:border-neon-red text-white p-3 pl-10 outline-none transition-all placeholder:text-gray-800 font-mono text-sm"
                                placeholder="EDDIE MUNSON"
                                value={formData.teamLeader}
                                onChange={(e) => setFormData({ ...formData, teamLeader: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="relative group">
                            <label className="block text-neon-red text-[10px] tracking-[0.3em] mb-2 uppercase font-mono font-bold">Count</label>
                            <select
                                required
                                className="w-full bg-black/50 border-b-2 border-red-900 focus:border-neon-red text-white p-3 outline-none transition-all font-mono text-sm appearance-none"
                                value={formData.teamCount}
                                onChange={(e) => setFormData({ ...formData, teamCount: parseInt(e.target.value) })}
                            >
                                <option value="1" className="bg-black text-white">1 MEMBER</option>
                                <option value="2" className="bg-black text-white">2 MEMBERS</option>
                            </select>
                        </div>
                        <div className="relative group">
                            <label className="block text-neon-red text-[10px] tracking-[0.3em] mb-2 uppercase font-mono font-bold">Mobile</label>
                            <div className="flex items-center">
                                <Phone size={16} className="absolute left-3 text-red-900 group-focus-within:text-neon-red transition-colors" />
                                <input
                                    type="tel"
                                    required
                                    className="w-full bg-black/50 border-b-2 border-red-900 focus:border-neon-red text-white p-3 pl-10 outline-none transition-all placeholder:text-gray-800 font-mono text-sm"
                                    placeholder="91XXXXXXXX"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="horror-btn w-full mt-4 flex items-center justify-center group overflow-hidden"
                    >
                        <span className="relative z-10">{loading ? 'ENCRYPTING...' : 'ENTER THE VOID'}</span>
                        <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                </form>

                <div className="mt-8 text-[8px] text-gray-700 text-center font-mono tracking-widest uppercase">
                    SYSTEM STATUS: STABLE | LINK ESTABLISHED
                </div>
            </motion.div>
        </div>
    );
};

export default RegistrationPage;
