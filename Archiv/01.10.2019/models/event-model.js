const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const eventSchema = new Schema({
 name: { type: String },
 description: { type: String },
 imageUrl: { type: String },
 owner: { type: Schema.Types.ObjectId, ref: 'User' },
 //reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' } ]
})
const Event = mongoose.model('Event', eventSchema);
module.exports = Event;