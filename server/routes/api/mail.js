
// Dependencies
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const mail = require('../../config').mail;

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: mail
});

// Send a contact request
router.post('/', function(req, res, next) {
	const data = req.body;

	transporter.sendMail({
		from: data.email,
		to: data.to,
		replyTo: data.email,
		subject: data.subject,
		text: data.content
	}, function(err) {
		if (err) { return next(err); }
	});

	res.json(data);
});

module.exports = router;
