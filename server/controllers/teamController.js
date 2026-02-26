const Team = require('../models/Team');
const crypto = require('crypto');

exports.registerTeam = async (req, res) => {
    try {
        const { teamName, teamLeader, teamCount, mobile } = req.body;

        // Team count validation
        if (teamCount < 1 || teamCount > 2) {
            return res.status(400).json({ success: false, message: 'Team count must be between 1 and 2' });
        }

        // Generate unique Team ID
        const teamId = 'MF-' + crypto.randomBytes(3).toString('hex').toUpperCase();

        const newTeam = new Team({
            teamId,
            teamName,
            teamLeader,
            teamCount,
            mobile,
            registrationTime: new Date()
        });

        await newTeam.save();
        res.status(201).json({ success: true, teamId: newTeam.teamId, data: newTeam });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

exports.startEvent = async (req, res) => {
    try {
        const { teamId } = req.body;
        const team = await Team.findOne({ teamId });

        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }

        if (team.hasStarted || team.eventStartTime) {
            return res.status(400).json({ success: false, message: 'Event already started for this team' });
        }

        team.eventStartTime = new Date();
        team.hasStarted = true;
        await team.save();

        res.status(200).json({ success: true, message: 'Event started', eventStartTime: team.eventStartTime });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getTeamStatus = async (req, res) => {
    try {
        const { teamId } = req.params;
        const team = await Team.findOne({ teamId });
        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }
        res.status(200).json({ success: true, data: team });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
