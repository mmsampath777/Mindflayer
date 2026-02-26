import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, FileText, ExternalLink, Timer, ChevronRight, Activity } from 'lucide-react';
import api from '../utils/api';

const RoundsPage = () => {
    const [team, setTeam] = useState(null);
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
                if (!response.data.data.hasStarted) {
                    navigate('/start-event');
                }
            } catch (err) {
                setError('Session expired or team not found');
            }
        };

        const interval = setInterval(fetchStatus, 30000); // Poll every 30s
        fetchStatus();
        return () => clearInterval(interval);
    }, [teamId, navigate]);

    const rounds = [
        {
            id: 1,
            title: 'The Gate',
            description: 'Signal manipulation detected at Hawkins Lab. Decode the rift vector using the provided telemetry.',
            pdf: 'round1_instructions.pdf',
            form: 'https://forms.gle/gBC6RcgHGKQFfyEy7'
        },
        {
            id: 2,
            title: 'The Mind Flayer',
            description: 'The hive mind is spreading. Locate the shadow nodes within the local network infrastructure.',
            pdf: 'round2_instructions.pdf',
            form: 'https://forms.gle/1DpwEHrcrsM8uTbs9'
        },
        {
            id: 3,
            title: 'The Upside Down',
            description: 'Final Breach. The barrier is failing. Execute the master override sequence before the rift becomes permanent.',
            pdf: 'round3_instructions.pdf',
            form: 'https://forms.gle/Zfgvw5r25kTYpSEh7'
        }
    ];

    if (!team) return <div className="min-h-screen bg-black flex items-center justify-center text-neon-red font-mono tracking-[1em] animate-pulse uppercase">Syncing...</div>;

    return (
        <div className="min-h-screen bg-horror-bg text-white p-6 relative">
            <div className="scanline"></div>

            <div className="max-w-6xl mx-auto py-8">
                <header className="mb-16 flex flex-col md:flex-row justify-between items-end border-b-2 border-red-950 pb-8 relative">
                    <div className="absolute top-0 left-0 w-8 h-1 bg-neon-red"></div>
                    <div>
                        <div className="flex items-center gap-2 text-neon-red mb-2">
                            <Activity size={16} className="animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Subsurface Monitoring Live</span>
                        </div>
                        <h1 className="text-5xl font-black glow-text italic uppercase tracking-tighter italic glitch">Sector Rounds</h1>
                        <p className="text-gray-500 font-mono text-xs mt-3 uppercase tracking-widest">
                            TEAM: <span className="text-red-400 font-bold">{team.teamName}</span> | DATASTREAM: MF-{team.teamId}
                        </p>
                    </div>
                    <div className="mt-8 md:mt-0 px-8 py-3 border-2 border-red-600 flex items-center gap-4 bg-red-950/20 backdrop-blur-md">
                        <Timer className="text-neon-red animate-pulse" size={20} />
                        <div className="flex flex-col">
                            <span className="text-red-500 font-black uppercase tracking-widest text-xs">Event Session</span>
                            <span className="text-[9px] text-gray-500 font-mono uppercase">Tracking Real-time...</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {rounds.map((round) => {
                        const isCompleted = (round.id === 1 && team.round1CompletedTime) ||
                            (round.id === 2 && team.round2CompletedTime) ||
                            (round.id === 3 && team.round3CompletedTime);

                        const isLocked = false; // All rounds unlocked as per admin request

                        return (
                            <motion.div
                                key={round.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: round.id * 0.2 }}
                                className={`horror-card p-1 relative flex flex-col h-full rounded-none group ${isLocked ? 'opacity-40 grayscale pointer-events-none' : ''}`}
                            >
                                {/* Background Accent */}
                                <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-500 ${isLocked ? 'from-transparent' : 'from-red-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100'}`}></div>

                                <div className="p-8 flex flex-col h-full bg-black/40 border-2 border-red-950 group-hover:border-neon-red transition-colors relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="relative">
                                            <span className="text-6xl font-black text-red-950/30 group-hover:text-red-600/20 transition-colors">0{round.id}</span>
                                            <ChevronRight className={`absolute -right-4 top-1/2 -translate-y-1/2 text-neon-red opacity-0 group-hover:opacity-100 transition-all ${isLocked ? 'hidden' : ''}`} size={24} />
                                        </div>
                                        {isLocked ? (
                                            <div className="bg-gray-900 p-2 rounded-full border border-gray-800">
                                                <Lock size={18} className="text-gray-700" />
                                            </div>
                                        ) : isCompleted ? (
                                            <div className="text-green-500 flex flex-col items-end">
                                                <span className="text-[10px] font-black uppercase tracking-widest mb-1">Cleared</span>
                                                <div className="h-0.5 w-12 bg-green-500 shadow-[0_0_10px_#22c55e]"></div>
                                            </div>
                                        ) : (
                                            <div className="text-red-600 flex flex-col items-end animate-pulse">
                                                <span className="text-[10px] font-black uppercase tracking-widest mb-1">Breaching</span>
                                                <div className="h-0.5 w-12 bg-neon-red shadow-[0_0_10px_#ff0000]"></div>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className={`text-2xl font-black mb-4 uppercase tracking-tighter ${isLocked ? 'text-gray-700' : 'text-neon-red glow-text'}`}>
                                        {round.title}
                                    </h3>
                                    <p className={`text-sm font-mono leading-relaxed mb-10 flex-grow ${isLocked ? 'text-gray-800' : 'text-gray-400 font-medium italic'}`}>
                                        "{round.description}"
                                    </p>

                                    <div className="space-y-4 mt-auto">
                                        <button
                                            disabled={isLocked}
                                            onClick={() => window.open(`/pdfs/${round.pdf}`, '_blank')}
                                            className="w-full flex items-center justify-center gap-3 text-[10px] tracking-[0.3em] uppercase py-3 border-2 border-red-900 hover:border-neon-red hover:bg-red-950/20 disabled:border-gray-900 transition-all font-bold"
                                        >
                                            <FileText size={16} /> Get Intelligence
                                        </button>
                                        <button
                                            disabled={isLocked}
                                            onClick={() => window.open(round.form, '_blank')}
                                            className="w-full flex items-center justify-center gap-3 text-[10px] tracking-[0.3em] uppercase py-3 bg-red-800 text-black font-black border-2 border-red-800 hover:bg-neon-red transition-all shadow-[0_4px_10px_rgba(255,0,0,0.2)]"
                                        >
                                            <ExternalLink size={16} /> Submit Uplink
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="mt-24 text-center">
                    <div className="inline-block relative">
                        <div className="absolute inset-0 blur-2xl bg-red-900/10"></div>
                        <p className="relative text-[9px] text-gray-700 font-mono text-center uppercase tracking-[1em] animate-pulse">
                            Bio-signals Synchronized | Monitoring Sector 7-G
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoundsPage;
