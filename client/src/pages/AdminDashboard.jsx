import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Download, CheckCircle, Clock, Trash2, ShieldX, Edit3, X,
    Monitor, Users, FileSpreadsheet, RefreshCw, AlertTriangle, ChevronRight, Save
} from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
    const [teams, setTeams] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingTeam, setEditingTeam] = useState(null);
    const [editForm, setEditForm] = useState({
        teamName: '',
        teamLeader: '',
        mobile: '',
        teamCount: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchTeams();
        const interval = setInterval(fetchTeams, 15000); // Auto-refresh every 15s
        return () => clearInterval(interval);
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await api.get('/admin/teams');
            setTeams(response.data.data);
            setError('');
        } catch (err) {
            setError('System link severed. Re-authenticating...');
            if (err.response?.status === 401) {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteRound = async (teamId, round) => {
        try {
            const response = await api.post('/admin/complete-round', { teamId, round });
            if (response.data.success) {
                fetchTeams();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Override failed locally');
        }
    };

    const handleExport = async () => {
        try {
            const response = await api.get('/admin/export', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `MF_RESULTS_${new Date().toISOString().slice(0, 10)}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Export sequence failed');
        }
    };

    const handleExportRegistrations = async () => {
        try {
            const response = await api.get('/admin/export-registrations', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `MF_REGISTRATIONS_${new Date().toISOString().slice(0, 10)}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Registration export failed');
        }
    };

    const calculateTotalTime = (team) => {
        if (team.round3CompletedTime && team.eventStartTime) {
            const seconds = (new Date(team.round3CompletedTime) - new Date(team.eventStartTime)) / 1000;
            const minutes = seconds / 60;
            return minutes.toFixed(2) + 'm';
        }
        return '---';
    };

    const filteredTeams = teams
        .filter(t =>
            t.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.teamLeader.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.mobile.includes(searchTerm)
        )
        .sort((a, b) => {
            const timeA = a.round3CompletedTime && a.eventStartTime ? (new Date(a.round3CompletedTime) - new Date(a.eventStartTime)) : Infinity;
            const timeB = b.round3CompletedTime && b.eventStartTime ? (new Date(b.round3CompletedTime) - new Date(b.eventStartTime)) : Infinity;
            return timeA - timeB;
        });

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };

    const handleEdit = (team) => {
        setEditingTeam(team);
        setEditForm({
            teamName: team.teamName,
            teamLeader: team.teamLeader,
            mobile: team.mobile,
            teamCount: team.teamCount || 1
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/admin/team/${editingTeam.teamId}`, editForm);
            if (response.data.success) {
                setEditingTeam(null);
                fetchTeams();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Update failed');
        }
    };

    const handleDelete = async (teamId, teamName) => {
        if (window.confirm(`Are you sure you want to PURGE team "${teamName}"? This action is irreversible.`)) {
            try {
                const response = await api.delete(`/admin/team/${teamId}`);
                if (response.data.success) {
                    fetchTeams();
                }
            } catch (err) {
                alert(err.response?.data?.message || 'Purge sequence failed');
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-horror-bg flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-t-4 border-r-4 border-neon-red rounded-full animate-spin"></div>
            <p className="text-neon-red font-mono text-xs uppercase tracking-[0.6em] animate-pulse">Syncing with Site 4...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-horror-bg text-white p-4 md:p-10 relative">
            <div className="scanline"></div>

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8 relative">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-900/5 blur-[100px] pointer-events-none"></div>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Monitor className="text-neon-red animate-pulse" size={24} />
                            <span className="text-[10px] font-bold text-red-600 uppercase tracking-[0.5em]">Sector Monitoring Hub</span>
                        </div>
                        <h1 className="text-5xl font-black text-neon-red glow-text uppercase tracking-tighter italic glitch">Commander Portal</h1>
                    </div>

                    <div className="flex flex-wrap gap-4 w-full lg:w-auto">
                        <button
                            onClick={handleExport}
                            className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 py-3 bg-red-800 text-black font-black uppercase text-xs hover:bg-neon-red transition-all shadow-[0_4px_15px_rgba(255,0,0,0.3)]"
                        >
                            <FileSpreadsheet size={16} /> Data Export
                        </button>
                        <button
                            onClick={handleExportRegistrations}
                            className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 py-3 bg-gray-900 text-red-500 border border-red-900 font-black uppercase text-xs hover:bg-red-950 transition-all shadow-[0_4px_15px_rgba(255,0,0,0.2)]"
                        >
                            <Users size={16} /> Registration Export
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex-1 lg:flex-none flex items-center justify-center gap-3 px-6 py-3 border-2 border-red-900 text-red-500 font-black uppercase text-xs hover:bg-red-950/30 transition-all font-mono"
                        >
                            <ShieldX size={16} /> Disconnect
                        </button>
                    </div>
                </header>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-8 p-4 bg-red-600 text-black font-black uppercase text-center text-xs tracking-widest shadow-[0_0_20px_rgba(255,0,0,0.4)]"
                    >
                        <AlertTriangle className="inline mr-2" size={16} /> {error}
                    </motion.div>
                )}

                {/* Search and Stats Section */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    <div className="lg:col-span-3 relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-red-900 group-focus-within:text-neon-red transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="SEARCH SUBJECTS BY NAME, LEADER, OR MOBILE..."
                            className="w-full bg-black/50 border-2 border-red-950 focus:border-neon-red p-4 pl-14 text-sm font-mono outline-none transition-all placeholder:text-gray-800 uppercase"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="bg-red-950/10 border-2 border-red-950 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3 text-red-700">
                            <Users size={20} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Active Entities</span>
                        </div>
                        <span className="text-2xl font-black text-neon-red">{teams.length}</span>
                    </div>
                </div>

                {/* Leaderboard Table */}
                <div className="horror-card border-2 border-red-950 overflow-hidden relative group">
                    <div className="absolute inset-0 bg-gradient-to-b from-red-600/5 to-transparent pointer-events-none opacity-50"></div>

                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left border-collapse min-w-[1000px]">
                            <thead>
                                <tr className="bg-red-950/40 text-neon-red text-[10px] uppercase font-black tracking-[0.2em] border-b border-red-900">
                                    <th className="p-6">RANK</th>
                                    <th className="p-6">SUBJECT DATA</th>
                                    <th className="p-6">LINK STATUS</th>
                                    <th className="p-6">ENTRY GATE</th>
                                    <th className="p-6">BREACH 1</th>
                                    <th className="p-6">BREACH 2</th>
                                    <th className="p-6">TIME (MINS)</th>
                                    <th className="p-6 text-right">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-red-950/30">
                                <AnimatePresence>
                                    {filteredTeams.map((team, index) => {
                                        const isFinished = !!team.round3CompletedTime;
                                        return (
                                            <motion.tr
                                                key={team._id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className={`transition-colors duration-300 ${isFinished ? 'bg-red-900/10' : 'hover:bg-red-900/5'}`}
                                            >
                                                <td className="p-6 font-mono text-neon-red text-xl font-black">
                                                    {isFinished ? (
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] text-red-800">#</span>{index + 1}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-900 animate-pulse">--</span>
                                                    )}
                                                </td>
                                                <td className="p-6">
                                                    <div className="font-black text-sm uppercase tracking-tight mb-1">{team.teamName}</div>
                                                    <div className="text-[9px] text-gray-500 font-mono uppercase bg-black/40 inline-block px-2 py-0.5 border border-red-950">
                                                        {team.teamLeader} | {team.mobile}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    {team.hasStarted ? (
                                                        <div className="flex items-center gap-2 text-green-500">
                                                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_green]"></div>
                                                            <span className="text-[9px] font-black uppercase tracking-widest">ENCRYPTED</span>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-gray-800">
                                                            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                                                            <span className="text-[9px] font-black uppercase tracking-widest">OFFLINE</span>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="p-6">
                                                    {team.round1CompletedTime ? (
                                                        <div className="flex flex-col">
                                                            <span className="text-green-500 font-mono text-[10px] font-bold">SUCCESS</span>
                                                            <span className="text-[8px] text-gray-600">{new Date(team.round1CompletedTime).toLocaleTimeString()}</span>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            disabled={!team.hasStarted}
                                                            onClick={() => handleCompleteRound(team.teamId, 1)}
                                                            className="text-[9px] font-black uppercase border-2 border-red-900 px-4 py-2 text-red-700 hover:border-red-600 hover:text-red-500 disabled:opacity-30 disabled:grayscale transition-all"
                                                        >
                                                            OVERRIDE R1
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="p-6">
                                                    {team.round2CompletedTime ? (
                                                        <div className="flex flex-col">
                                                            <span className="text-green-500 font-mono text-[10px] font-bold">SUCCESS</span>
                                                            <span className="text-[8px] text-gray-600">{new Date(team.round2CompletedTime).toLocaleTimeString()}</span>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            disabled={!team.round1CompletedTime}
                                                            onClick={() => handleCompleteRound(team.teamId, 2)}
                                                            className="text-[9px] font-black uppercase border-2 border-red-900 px-4 py-2 text-red-700 hover:border-red-600 hover:text-red-500 disabled:opacity-30 disabled:grayscale transition-all"
                                                        >
                                                            OVERRIDE R2
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="p-6">
                                                    {team.round3CompletedTime ? (
                                                        <div className="flex flex-col">
                                                            <span className="text-green-500 font-mono text-[10px] font-bold">CLEARED</span>
                                                            <span className="text-[8px] text-gray-600">{new Date(team.round3CompletedTime).toLocaleTimeString()}</span>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            disabled={!team.round2CompletedTime}
                                                            onClick={() => handleCompleteRound(team.teamId, 3)}
                                                            className="text-[9px] font-black uppercase border-2 border-red-900 px-4 py-2 text-red-700 hover:border-red-600 hover:text-red-500 disabled:opacity-30 disabled:grayscale transition-all"
                                                        >
                                                            OVERRIDE R3
                                                        </button>
                                                    )}
                                                </td>
                                                <td className="p-6 text-right font-mono text-neon-red text-lg font-black italic">
                                                    {calculateTotalTime(team)}
                                                </td>
                                                <td className="p-6 text-right flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleEdit(team)}
                                                        className="text-white hover:text-neon-red transition-colors p-2 bg-red-950/20 border border-red-950 hover:border-neon-red"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(team.teamId, team.teamName)}
                                                        className="text-red-900 hover:text-red-500 transition-colors p-2 bg-red-950/20 border border-red-950 hover:border-red-600"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        );
                                    })}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                </div>

                {filteredTeams.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-32 text-center flex flex-col items-center gap-6"
                    >
                        <Monitor size={64} className="text-red-950 opacity-20" />
                        <p className="text-gray-800 text-xs font-mono uppercase tracking-[0.8em]">No signals detected in this sector</p>
                    </motion.div>
                )}

                <footer className="mt-16 flex justify-between items-center text-[8px] text-gray-800 font-mono uppercase tracking-[0.4em]">
                    <span>Hawkins Monitoring Station v.2026.B</span>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <div className="w-1 h-1 bg-red-600 rounded-full animate-pulse"></div>
                            <span>Mainframe Active</span>
                        </div>
                        <span>Secure Uplink: 100%</span>
                    </div>
                </footer>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingTeam && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                    >
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setEditingTeam(null)}></div>
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-md bg-horror-bg border-4 border-red-950 p-8 relative z-10 horror-card"
                        >
                            <div className="flex justify-between items-center mb-8 border-b-2 border-red-950 pb-4">
                                <h2 className="text-2xl font-black text-neon-red uppercase italic tracking-tighter italic glitch">Edit Protocol</h2>
                                <button onClick={() => setEditingTeam(null)} className="text-red-900 hover:text-neon-red">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleUpdate} className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-red-600 uppercase tracking-widest mb-2">Team Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-black/60 border-2 border-red-950 p-3 text-sm focus:border-neon-red outline-none transition-all"
                                        value={editForm.teamName}
                                        onChange={(e) => setEditForm({ ...editForm, teamName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-red-600 uppercase tracking-widest mb-2">Leader Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-black/60 border-2 border-red-950 p-3 text-sm focus:border-neon-red outline-none transition-all"
                                        value={editForm.teamLeader}
                                        onChange={(e) => setEditForm({ ...editForm, teamLeader: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-bold text-red-600 uppercase tracking-widest mb-2">Mobile</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full bg-black/60 border-2 border-red-950 p-3 text-sm focus:border-neon-red outline-none transition-all"
                                            value={editForm.mobile}
                                            onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold text-red-600 uppercase tracking-widest mb-2">Members</label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            max="4"
                                            className="w-full bg-black/60 border-2 border-red-950 p-3 text-sm focus:border-neon-red outline-none transition-all"
                                            value={editForm.teamCount}
                                            onChange={(e) => setEditForm({ ...editForm, teamCount: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-4 bg-red-800 text-black font-black uppercase text-xs hover:bg-neon-red transition-all shadow-[0_4px_15px_rgba(255,0,0,0.3)] flex items-center justify-center gap-2"
                                >
                                    <Save size={16} /> Apply Override
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
