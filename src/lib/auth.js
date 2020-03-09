module.exports = {
	isLoggedIn(request, response, next) {
		if (request.isAuthenticated()) {
			return next();
		}else{
			response.redirect('/signin');
		}
	},
	isNotLoggedIn(request, response, next) {
		if (!request.isAuthenticated()) {
			return next();
		}else{
			response.redirect('/profile');
		}
	}
};