const express = require('express');
const router = express.Router();
const Event = require('./../models/event-model.js');


//const fileUploader = require('../config/upload-setup/cloudinary');
// available only if we have user in the session
function isLoggedIn(req, res, next){
 if(req.session.currentUser){
   next();
 } else  {
   res.redirect('/login');
 }
}
// GET route to create a event
router.get('/create-event', (req, res, next) => {
 res.render('event-pages/add-event.hbs');
});
//  <input type="file" name="imageUrl" id="">
//
//router.post('/create-event', fileUploader.single('imageUrl'),(req, res, next) => {
 // console.log('body: ', req.body);
 // console.log(' - - -- - -- - -- - - -- - - ');
 // console.log('file: ', req.file);
 router.post('/create-event',(req, res, next) => {
 
 const nameEvent = req.body.name;
 const descriptionEvent = req.body.description;
 
 Event.create({
   name: nameEvent,
   description: descriptionEvent,
   imageUrl: '',
   owner: req.session.currentUser._id
 })
 .then( newEvent => {
   // console.log('event created: ', newEvent)
   res.render('event-pages/event-list', {eventsFromDB: newEvent});
 } )
 .catch( err => next(err) )
});
// show all events
router.get('/events', (req, res, next) => {
 Event.find().populate('owner')
 .then(allEvents => {

  allEvents.forEach(oneEvent => {
     if(req.session.currentUser){
       if(oneEvent.owner.equals(req.session.currentUser._id)){
         oneEvent.isOwner = true;
        
       }
     }
   })
  
   res.render('event-pages/event-list', { eventsFromDB: allEvents })
 })
 .catch( err => next(err) )
})
// get the details of a specific room
router.get('/events/:eventId',isLoggedIn, (req, res, next) => {
 Event.findById(req.params.eventId).populate('owner')
 .populate({path: 'reviews', populate: {path:'user'}})
 .then(foundEvent => {
   if(foundEvent.owner.equals(req.session.currentUser._id)){
     foundEvent.isOwner = true;
   }
   res.render('event-pages/event-details', { event: foundEvent } )
   })
   .catch( err => next(err) )
 })
// post => save updates in the specific room
router.post('/events/:eventId/update', (req, res, next) => {
 const { name, description } = req.body;
 const updatedEvent = {
   name,
   description,
    owner: req.session.currentUser._id                                                }
 console.log(req.session.currentUser._id)
 Event.findByIdAndUpdate(req.params.eventId, updatedEvent) // <----------
 .then( theUpdatedEvent => {
   res.redirect(`/events/${req.params.eventId}`);
 } )
 .catch( err => next(err) )
})
// delete a event
router.post('/events/:id/delete', (req, res, next) => {
 Event.findByIdAndDelete(req.params.id)
 .then(() => {
   res.redirect('/events');
 })
 .catch(err => next(err));
})
module.exports = router;