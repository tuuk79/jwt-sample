const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.get('/api', (req, res) => {
	res.json({
		text: 'my api!'
	});
});

app.post('/api/login', (req, res) => {
	const user = {
		username: 'testname'
	};
	const token = jwt.sign(user, 'mysecretkey');
	res.json({
		token: token
	});
});

app.get('/api/protected', ensureToken, (req, res) => {
	jwt.verify(req.token, 'mysecretkey', (err, data) => {
		if (err) {
			res.sendStatus(403);
		} else {
			res.json({
				text: 'this is protected',
				data: data
			});
		}
	});

	res.json({
		text: 'protect api!'
	});
});

function ensureToken(req, res, next) {
	const bearerHeader = req.headers['authorization'];
	if (typeof bearerHeader !== 'undefined') {
		const bearer = bearerHeader.split(' ');
		const tokenType = bearer[0];
		const bearerToken = bearer[1];

		if (tokenType !== 'Bearer') {
			res.sendStatus(403);
		} else {
			req.token = bearerToken;
			// next();
			res.sendStatus(200);
		}
	} else {
		res.sendStatus(403);
	}
}

app.listen(3000, () => {
	console.log('listening on port 3000!!!');
});