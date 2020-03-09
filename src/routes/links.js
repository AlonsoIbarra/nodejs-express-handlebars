const express = require('express');
const router = express.Router();

const pool = require('./../database');
const { isLoggedIn } = require('./../lib/auth');

router.get('/add', isLoggedIn, (request, response)=>{
	response.render('links/add');
});

router.post("/add", isLoggedIn, async (request, response)=>{
	const {title, url, description} = request.body;
	const user_id = request.user.id;
	const newLink ={
		title,
		url,
		description,
		user_id
	};
	await pool.query('INSERT INTO links set ?', [newLink]);
	request.flash('success', 'Link saved successfully.');
	response.redirect('/links');
});

router.get('/', isLoggedIn, async(request, response)=>{
	const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [request.user.id]);
	response.render('links/list', {links});
});

router.get('/delete/:id', isLoggedIn, async(request, response)=>{
	const {id} = request.params;
	await pool.query('DELETE FROM links WHERE id=?', [id]);
	request.flash('success', 'Link removed successfully.');
	response.redirect('/links');
});
router.get('/edit/:id', isLoggedIn, async(request, response)=>{
	const {id} = request.params;
	const links = await pool.query('SELECT * FROM links WHERE id=?', [id]);
	const link = links[0];
	response.render('links/edit', {link});
});
router.post('/edit/:id', isLoggedIn, async(request, response)=>{
	const {id} = request.params;
	const {title, url, description} = request.body;
	const newLink = {
		title,
		url,
		description
	}	
	await pool.query('UPDATE links SET ? WHERE id=?', [newLink, id]);
	request.flash('success', 'Link updated successfully.');
	response.redirect('/links');
});

module.exports = router;