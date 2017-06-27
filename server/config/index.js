module.exports = {
	secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret',
	mail: { user: 'toptrainingpro@gmail.com', pass: 'supporttoptrainingpro' }
};
