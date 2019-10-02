const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const path = require('path');           /*Änderung Vanessa */
const saltRounds = 10;
const salt = bcrypt.genSalt(saltRounds);
/* Model abfragen */
const User = require('./../models/user-model.js')

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});
router.get('/home', (req, res, next) => {
 
  res.render('index');
});

/* GET News on Music page */
router.get('/news', (req, res, next) => {
  res.render('news');
});

/* GET Sign Up page */
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});
// Get Login Page
router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

//GET Lessons-private page
 router.get('/lessons-private', (req, res, next) => {
  res.render('auth/lessons-private');
});

router.get('/logOut', (req,res,next) => {
  req.session.destroy((err)=>{
    res.redirect("/")

  })
});
 /*Änderung Vanessa */
router.get('/', function(req,res){
  console.log("Silly")
  res.sendFile(path.join(__dirname,'../views/index.hbs'));
  });

// Register:
router.post('/signup', (req, res, next) => {
  const lastName = req.body.LastName;
  const firstName = req.body.firstName;
  const email = req.body.email;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hashPassword = bcrypt.hashSync(password,salt);


  const newUser = new User({
    lastName,
    firstName,
    email,
    hashPassword
  })


  if (email == '' || password == '' || lastName == '' || firstName == '') {
    res.render('events',{
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

 

      User.create({
        lastName: lastName,
        firstName: firstName,
        email: email,
        password: hashPassword
      })
        .then(user => {
          if(!user){
            res.render('auth/lessons-private')
            errorMessage: "The username doesn't exists"
          }
          // if all good, log in the user automatically
          req.session.currentUser = user;
          res.redirect("/");
        })
        .catch(err => next(err)); //closing User.create()
    })

  
});

/* GET Lessons page */

router.get('/lessons', (req, res, next) => {
  res.render('lessons');
});
// Route from successfull login in lessons.hbs to lessons-private.hbs if the variables in email/ password mach with the object in mongoDB 
router.post('/login', (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;

  const newLoginUser = new User ({
    email,
    password
  });
  
  if (email === "" || password === "") {
    res.render('auth/login',{
      errorMessage: "Please enter both, email and password to login"
    });
    return;
  }
  User.findOne({ email })
 .then(user => {
  if(bcrypt.compareSync(req.body.password,user.password)){
    req.session.currentUser = user;
    res.render('auth/lessons-private')
    console.log("test"); 
       return;
     }

     if (req.body.password === user.password) {
       // Save the login in the session!
       console.log('### ', req.session);
       req.session.currentUser = user;
       res.redirect("/lessons-private");

     } else {
       
       res.render("auth/login", {
         errorMessage: "Incorrect password"
        
        });

     }
 })
 .catch(error => {
   next(error);
 })
})



module.exports = router;
//module.exports = User;
