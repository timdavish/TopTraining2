
// Module dependencies
const express = require('express');
const router = express.Router();

router.use('/mail', require('./mail'));
router.use('/profiles', require('./profiles'));
router.use('/search', require('./search'));
router.use('/users', require('./users'));

router.use(function(err, req, res, next) {
	if (err.name === 'ValidationError') {
		return res.status(422).json({
			errors: Object.keys(err.errors).reduce(function(errors, key) {
				errors[key] = err.errors[key].message;

				return errors;
			}, {})
		});
	}

	return next(err);
});

module.exports = router;
