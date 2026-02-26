const Team = require('../models/Team');
const jwt = require('jsonwebtoken');
const xlsx = require('xlsx');

exports.login = async (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'mindflayer_admin_2024';

    if (password === adminPassword) {
        const token = jwt.sign({ role: 'volunteer' }, process.env.JWT_SECRET || 'fallback_secret', {
            expiresIn: '1h',
        });
        return res.status(200).json({ success: true, token });
    }

    res.status(401).json({ success: false, message: 'Invalid Admin Password' });
};

exports.getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find({}).sort({ registrationTime: -1 });
        // Virtuals are calculated on the fly in the frontend or during mapping
        res.status(200).json({ success: true, data: teams });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.completeRound = async (req, res) => {
    try {
        const { teamId, round } = req.body;
        const team = await Team.findOne({ teamId });

        if (!team) return res.status(404).json({ success: false, message: 'Team not found' });
        if (!team.hasStarted) return res.status(400).json({ success: false, message: 'Team has not started the event' });

        const now = new Date();

        if (round === 1) {
            if (team.round1CompletedTime) return res.status(400).json({ success: false, message: 'Round 1 already completed' });
            team.round1CompletedTime = now;
        } else if (round === 2) {
            if (!team.round1CompletedTime) return res.status(400).json({ success: false, message: 'Complete Round 1 first' });
            if (team.round2CompletedTime) return res.status(400).json({ success: false, message: 'Round 2 already completed' });
            team.round2CompletedTime = now;
        } else if (round === 3) {
            if (!team.round2CompletedTime) return res.status(400).json({ success: false, message: 'Complete Round 2 first' });
            if (team.round3CompletedTime) return res.status(400).json({ success: false, message: 'Round 3 already completed' });
            team.round3CompletedTime = now;
        } else {
            return res.status(400).json({ success: false, message: 'Invalid round' });
        }

        await team.save();
        res.status(200).json({ success: true, message: `Round ${round} completed`, data: team });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.exportToExcel = async (req, res) => {
    try {
        const teams = await Team.find({});

        const data = teams.map(t => ({
            'Team Name': t.teamName,
            'Team Leader': t.teamLeader,
            'Round 1 Time (min)': t.round1Time || 'N/A',
            'Round 2 Time (min)': t.round2Time || 'N/A',
            'Round 3 Time (min)': t.round3Time || 'N/A',
            'Total Time (min)': t.totalTime || 'N/A'
        }));

        // Sort by Total Time (ascending) - handle nulls
        data.sort((a, b) => {
            if (a['Total Time (min)'] === 'N/A') return 1;
            if (b['Total Time (min)'] === 'N/A') return -1;
            return parseFloat(a['Total Time (min)']) - parseFloat(b['Total Time (min)']);
        });

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Results');

        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Mindflayer_Results.xlsx');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteTeam = async (req, res) => {
    try {
        const { teamId } = req.params;
        const team = await Team.findOneAndDelete({ teamId });

        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }

        res.status(200).json({ success: true, message: 'Team purged from system' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.exportRegistrationDetails = async (req, res) => {
    console.log('📡 Registration export requested by:', req.user || 'Unknown Admin');
    try {
        const teams = await Team.find({}).sort({ registrationTime: 1 });
        console.log(`📊 Found ${teams.length} teams for registration export`);

        const data = teams.map(t => ({
            'Team ID': t.teamId,
            'Team Name': t.teamName,
            'Team Leader': t.teamLeader,
            'Team Count': t.teamCount,
            'Mobile': t.mobile,
            'Registration Time': new Date(t.registrationTime).toLocaleString()
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Registration Details');

        const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=Mindflayer_Registrations.xlsx');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
