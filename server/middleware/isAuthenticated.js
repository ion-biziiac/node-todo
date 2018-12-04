const passport = require('../config/passport');

module.exports = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, function(err, user, info) { 
    if (err) { return next(err); } 
    if (!user) { return res.status(401).send("Unauthorised").end(); } 
    req.user = user;  
    next();
  })(req, res, next);
};
