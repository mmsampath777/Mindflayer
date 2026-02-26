import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Radiation, Zap } from 'lucide-react';
import api from '../utils/api';

const StartEventPage = () => {
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const teamId = localStorage.getItem('userTeamId');

    useEffect(() => {
        if (!teamId) {
            navigate('/register');
            return;
        }

        const fetchStatus = async () => {
            try {
                const response = await api.get(`/teams/status/${teamId}`);
                setTeam(response.data.data);
                if (response.data.data.hasStarted) {
                    navigate('/rounds');
                }
            } catch (err) {
                setError('Could not fetch team status');
            }
        };

        fetchStatus();
    }, [teamId, navigate]);

    const handleStart = async () => {
        setLoading(true);
        try {
            const response = await api.post('/teams/start', { teamId });
            if (response.data.success) {
                navigate('/rounds');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to start event');
        } finally {
            setLoading(false);
        }
    };

    if (!team && !error) return <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-mono tracking-widest animate-pulse">ESTABLISHING CONNECTION...</div>;

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-horror-bg">
            <div className="scanline"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="horror-card p-12 w-full max-w-2xl text-center border-2 border-red-900 overflow-hidden relative"
            >
                {/* Visual accents */}
                <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
                <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-red-900/10 to-transparent skew-x-12 animate-[shimmer_3s_infinite]"></div>

                <div className="flex justify-center mb-8 gap-4">
                    <Radiation size={48} className="text-red-600 animate-spin-slow" />
                    <AlertTriangle size={64} className="text-neon-red animate-pulse" />
                    <Zap size={48} className="text-red-800" />
                </div>

                <h2 className="text-6xl font-black text-neon-red glow-text mb-6 uppercase italic tracking-tight glitch">
                    INITIALIZE
                </h2>

                <div className="space-y-6 text-gray-300 mb-10">
                    <p className="text-lg font-mono tracking-wide leading-relaxed">
                        SUBJECT: <span className="text-neon-red font-bold uppercase">{team?.teamName}</span>
                    </p>
                    <div className="bg-red-950/20 p-6 border border-red-900/50">
                        <p className="text-sm uppercase tracking-[0.2em] text-red-400 font-bold mb-2">Protocol Warning</p>
                        <p className="text-xs font-mono leading-relaxed">
                            BY CLICKING "START EVENT", YOU ARE OFFICIALLY CROSSING THE THRESHOLD. THE TIMER WILL TRIGGER INDEFINITELY. DATA LOGGING COMMENCES INSTANTLY. NO RECURSION POSSIBLE.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <button
                        onClick={handleStart}
                        disabled={loading}
                        className="horror-btn w-full py-6 text-3xl font-black bg-red-950/30 hover:bg-neon-red hover:text-black transition-all border-neon-red relative group overflow-hidden"
                    >
                        <span className="relative z-10">{loading ? 'STABILIZING...' : 'START EVENT'}</span>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>

                    <div className="flex justify-between items-center px-4">
                        <span className="text-[8px] text-red-900 font-mono tracking-widest uppercase italic">Hawkins Lab v.2026.02</span>
                        <span className="text-[8px] text-red-900 font-mono tracking-widest uppercase animate-pulse">● SIGNAL DETECTED</span>
                    </div>
                </div>

                {error && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-white mt-6 text-xs bg-red-600 p-2 font-black uppercase"
                    >
                        [SYSTEM ERROR]: {error}
                    </motion.p>
                )}
            </motion.div>
        </div>
    );
};

export default StartEventPage;
