const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
  name: { type: String},
  description: { type: String},
  lineup: { type: String},
  genre: { type: String}
  }, {
  timestamps: true
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;