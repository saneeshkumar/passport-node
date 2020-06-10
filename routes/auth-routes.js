const router = require('express').Router();
const passport = require('passport');

const authCheck = (req, res, next) => {
    if (!req.user) {
        //if user is not logged in
        next();
    } else {
        // logged in
        res.redirect('/profile');
    }
};

//auth login
router.get('/login', authCheck, (req, res) => {
    res.render('login', {user: req.user});
});

//auth logout
router.get('/logout', (req, res) => {
    //handle with passport
    req.logOut();
    res.redirect('/');
});

//auth with google
router.get('/google', passport.authenticate('google', {
    scope:['profile']
}));

//callback route for google to redirect to
router.get('/google/redirect',passport.authenticate('google') ,(req, res)=>{
    res.redirect('/profile/');
})

module.exports = router;