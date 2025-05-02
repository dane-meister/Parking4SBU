const express = require('express');
const router = express.Router();
const { Ticket, User, Vehicle } = require('../models');

// GET all tickets for a user
router.get('/user/:userId', async (req, res) => {
	try {
		const tickets = await Ticket.findAll({
			where: { user_id: req.params.userId },
			order: [['issued_at', 'DESC']]
		});
		res.json(tickets);
	} catch (err) {
		console.error('Error fetching user tickets:', err);
		res.status(500).json({ error: 'Failed to fetch tickets' });
	}
});

// POST new ticket
router.post('/', async (req, res) => {
	try {
        console.log(req.body)
		const ticket = await Ticket.create(req.body);
		res.status(201).json(ticket);
	} catch (err) {
		console.error('Error creating ticket:', err);
        console.error('Error creating ticket:', err.errors || err.message || err);
		res.status(400).json({ error: 'Failed to create ticket' });
	}
});

// PATCH appeal a ticket
router.patch('/:ticketId/appeal', async (req, res) => {
	try {
		const { appeal_reason } = req.body;
		const ticket = await Ticket.findByPk(req.params.ticketId);
		if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

		ticket.appeal_reason = appeal_reason;
		ticket.appeal_submitted_at = new Date();
		ticket.status = 'appealed';
		await ticket.save();

		res.json(ticket);
	} catch (err) {
		console.error('Error appealing ticket:', err);
		res.status(500).json({ error: 'Failed to appeal ticket' });
	}
});

// PATCH pay a ticket
router.patch('/:ticketId/pay', async (req, res) => {
	try {
		const ticket = await Ticket.findByPk(req.params.ticketId);
		if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

		ticket.status = 'paid';
		await ticket.save();

		res.json(ticket);
	} catch (err) {
		console.error('Error paying ticket:', err);
		res.status(500).json({ error: 'Failed to update payment status' });
	}
});

module.exports = router;
