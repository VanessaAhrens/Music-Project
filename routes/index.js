const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;
/* Model abfragen */
const User = require('./../models/user-model.js')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});
router.get('/home', (req, res, next) => {
  res.render('index');
});
/* GET events page */
router.get('/events', (req, res, next) => {
  res.render('events');
});
/* GET News on Music page */
router.get('/news', (req, res, next) => {
  res.render('news');
});

/* GET Sign Up page */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

// Register:
router.post('/signup', (req, res, next) => {
  const lastName = req.body.LastName;
  const firstName = req.body.firstName;
  const email = req.body.email;
  const password = req.body.password;


  const newUser = new User({
    lastName,
    firstName,
    email,
    password
  })

  if (email == '' || password == '' || lastName == '' || firstName == '') {
    res.render('index',{
      errorMessage: "Please set some data"
     });
    return;
  }

  User.findOne({ "email": email })
    .then(foundUser => {
      if (foundUser !== null) {
        // here we will redirect to '/login' if email is a registered user
        res.redirect('/');
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPassword = bcrypt.hashSync(password, salt);

      User.create({
        lastName: lastName,
        firstName: firstName,
        email: email,
        password: password
      })
        .then(user => {
          // if all good, log in the user automatically
          req.session.currentUser = user;
          res.redirect("/");
        })
        .catch(err => next(err)); //closing User.create()
    })

  res.render('auth/signup-success');
});

/* GET Lessons page */
router.get('/lessons', (req, res, next) => {
  res.render('lessons');
});
/* Route from successfull login in lessons.hbs to lessons-private.hbs if the variables in email/ password mach with the object in mongoDB */
router.post('/lessons', (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;

  const newLoginUser = new User ({
    email,
    password
  });
  
  if (email === "" && password === "") {
    res.render('lessons')
    return;
  }
  User.findOne({ email })
 .then(user => {
     if (!user) {
       res.render("lessons", {
         errorMessage: "The username doesn't exist."
       });
       return;
     }
console.log(User.password, ' ', user.password);
     if (User.password === user.password) {
       // Save the login in the session!
       console.log('### ', req.session);
       req.session.currentUser = user;
       res.redirect("/");
     } else {
       console.log('#### passwort nicht gleich');
       res.render("login", {
         errorMessage: "Incorrect password"
       });
     }
 })
 .catch(error => {
   next(error);
 })
})

/* GET Lessons-private page*/
router.get('/lessons-private', (req, res, next) => {
  console.log("fuck you")
  res.render('auth/lessons-private');
})


module.exports = router;
//module.exports = User;
