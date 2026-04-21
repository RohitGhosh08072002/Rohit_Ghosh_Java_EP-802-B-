const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

let User = require('../models/user');
let Complaint = require('../models/complaint');
let ComplaintMapping = require('../models/complaint-mapping');
let Feedback = require('../models/feedback');

// Home Page - Dashboard
router.get('/', ensureAuthenticated, (req, res, next) => {
    Complaint.getAllComplaints((err, complaints) => {
        if (err) throw err;
        
        ComplaintMapping.getAllMappings((err, mappings) => {
            if (err) throw err;

            let total = complaints.length;
            let resolved = mappings.length;
            let successPercentage = total > 0 ? Math.round((resolved / total) * 100) : 0;
            let pending = total - resolved;

            res.render('index', {
                stats: {
                    total: total,
                    resolved: resolved,
                    pending: Math.max(0, pending),
                    successPercentage: successPercentage
                }
            });
        });
    });
});

// Login Form
router.get('/login', (req, res, next) => {
    res.render('login');
});

// Register Form
router.get('/register', (req, res, next) => {
    res.render('register');
});

// Logout
router.get('/logout', ensureAuthenticated,(req, res, next) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
});

// Admin
router.get('/admin', ensureAuthenticated, (req,res,next) => {
    Complaint.getAllComplaints((err, complaints) => {
        if (err) throw err;
    
        User.getEngineer((err, engineer) => {
            if (err) throw err;

            Feedback.getAllFeedbacks((err, feedbacks) => {
                if (err) throw err;
                
                ComplaintMapping.getAllMappings((err, mappings) => {
                    if (err) throw err;

                    let total = complaints.length;
                    let resolved = mappings.length;
                    let successPercentage = total > 0 ? Math.round((resolved / total) * 100) : 0;
                    let pending = total - resolved;

                    res.render('admin/admin', {
                        complaints : complaints,
                        engineer : engineer,
                        feedbacks : feedbacks,
                        stats: {
                            total: total,
                            resolved: resolved,
                            pending: Math.max(0, pending),
                            successPercentage: successPercentage
                        }
                    });
                });
            });
        });
    });        
});


// Assign the Complaint to Engineer
router.post('/assign', (req,res,next) => {
    const complaintID = req.body.complaintID;
    const engineerName = req.body.engineerName;

    req.checkBody('complaintID', 'Contact field is required').notEmpty();
    req.checkBody('engineerName', 'Description field is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('admin/admin', {
            errors: errors
        });
    } else {
        const newComplaintMapping = new ComplaintMapping({
            complaintID: complaintID,
            engineerName: engineerName,
        });

        ComplaintMapping.registerMapping(newComplaintMapping, (err, complaint) => {
            if (err) throw err;
            req.flash('success_msg', 'You have successfully assigned a complaint to Engineer');
            res.redirect('/admin');
        });
    }

});

// Track issue
router.get('/track', ensureAuthenticated, (req,res,next) => {
    res.render('track');
});

router.post('/track', ensureAuthenticated, (req, res, next) => {
    const complaintID = req.body.complaintID;
    
    if (!complaintID || !complaintID.match(/^[0-9a-fA-F]{24}$/)) {
        req.flash('error_msg', 'Invalid Complaint ID format. Please double check your 24-character ID.');
        return res.redirect('/track');
    }

    Complaint.findById(complaintID, (err, complaint) => {
        if (err || !complaint) {
            req.flash('error_msg', 'We could not locate a Complaint with that ID.');
            return res.redirect('/track');
        }

        ComplaintMapping.findOne({complaintID: complaintID}, (err, mapping) => {
            if (err) throw err;

            res.render('track', {
                complaint: complaint,
                mapping: mapping,
                tracked: true
            });
        });
    });
});

// Feedback Page
router.get('/feedback', (req, res, next) => {
    res.render('feedback');
});

//Submit Feedback
router.post('/submitFeedback', (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    
    req.checkBody('message', 'Message field is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('feedback', {
            errors: errors
        });
    } else {
        const newFeedback = new Feedback({
            name: name,
            email: email,
            message: message,
        });

        Feedback.submitFeedback(newFeedback, (err, feedback) => {
            if (err) throw err;
            req.flash('success_msg', 'Thank you for your feedback!');
            res.redirect('/');
        });
    }
});

// Junior Eng
router.get('/jeng', ensureAuthenticated, (req,res,next) => {
    ComplaintMapping.find({ engineerName: req.user.username }, (err, mappings) => {
        if (err) throw err;
        const complaintIDs = mappings.map(m => m.complaintID);
        Complaint.find({ _id: { $in: complaintIDs } }, (err, complaints) => {
            if (err) throw err;

            let totalAssigned = complaints.length;
            let resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
            let pendingCount = totalAssigned - resolvedCount;
            let successPercentage = totalAssigned > 0 ? Math.round((resolvedCount / totalAssigned) * 100) : 0;
            
            res.render('junior/junior', {
                complaints: complaints,
                stats: {
                    total: totalAssigned,
                    resolved: resolvedCount,
                    pending: pendingCount,
                    successPercentage: successPercentage
                }
            });
        });
    });
});

// Resolve Complaint
router.post('/resolve', ensureAuthenticated, (req, res, next) => {
    const complaintID = req.body.complaintID;
    Complaint.findByIdAndUpdate(complaintID, { status: 'Resolved' }, (err) => {
        if (err) {
            req.flash('error_msg', 'Failed to resolve the task.');
        } else {
            req.flash('success_msg', 'Task successfully marked as Resolved!');
        }
        res.redirect('/jeng');
    });
});

//Complaint
router.get('/complaint', ensureAuthenticated, (req, res, next) => {
    //console.log(req.session.passport.username);
    //console.log(user.name);
    res.render('complaint', {
        username: req.session.user,
    });
});

//Register a Complaint
router.post('/registerComplaint', (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const contact = req.body.contact;
    const desc = req.body.desc;
    const address = req.body.address;
    
    const postBody = req.body;
    console.log(postBody);

    req.checkBody('contact', 'Contact field is required').notEmpty();
    req.checkBody('desc', 'Description field is required').notEmpty();
    req.checkBody('address', 'Address field is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('complaint', {
            errors: errors
        });
    } else {
        const newComplaint = new Complaint({
            name: name,
            email: email,
            contact: contact,
            desc: desc,
            address: address,
        });

        Complaint.registerComplaint(newComplaint, (err, complaint) => {
            if (err) throw err;
            req.flash('success_msg', 'You have successfully launched a complaint');
            res.redirect('/');
        });
    }
});



// Process Register
router.post('/register', (req, res, next) => {
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;
    const role = req.body.role;

    req.checkBody('name', 'Name field is required').notEmpty();
    req.checkBody('email', 'Email field is required').notEmpty();
    req.checkBody('email', 'Email must be a valid email address').isEmail();
    req.checkBody('username', 'Username field is required').notEmpty();
    req.checkBody('password', 'Password field is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    req.checkBody('role', 'Role option is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        const newUser = new User({
            name: name,
            username: username,
            email: email,
            password: password,
            role: role
        });

        User.registerUser(newUser, (err, user) => {
            if (err) {
                if (err.code === 11000) {
                    req.flash('error_msg', 'Username or Email is already registered.');
                } else {
                    req.flash('error_msg', 'Something went wrong during registration.');
                }
                return res.redirect('/register');
            }
            req.flash('success_msg', 'You are Successfully Registered and can Log in');
            res.redirect('/login');
        });
    }
});

// Local Strategy
passport.use(new LocalStrategy((username, password, done) => {
    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return done(null, false, {
                message: 'No user found'
            });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'Wrong Password'
                });
            }
        });
    });
}));

passport.serializeUser((user, done) => {
    var sessionUser = {
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
    }
    done(null, sessionUser);
});

passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, sessionUser) => {
        done(err, sessionUser);
    });
});

// Login Processing
router.post('/login', passport.authenticate('local', 
    { 
        failureRedirect: '/login', 
        failureFlash: true 
    
    }), (req, res, next) => {
    
        req.session.save((err) => {
        if (err) {
            return next(err);
        }
        if(req.user.role==='admin'){
            res.redirect('/admin');
        }
        else if(req.user.role==='jeng'){
            res.redirect('/jeng');
        }
        else{
            res.redirect('/');
        }
    });
});

// Access Control
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error_msg', 'You are not Authorized to view this page');
        res.redirect('/login');
    }
}

module.exports = router;