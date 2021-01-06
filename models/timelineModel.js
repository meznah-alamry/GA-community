var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TimelineSchema = new Schema({
    content: String,
    user: String,
    userId: String
    // user: {type : mongoose.Schema.Types.ObjectId , ref : 'User' }
});

  const Timeline = mongoose.model('Timeline', TimelineSchema);
  
  // export user model
  module.exports = Timeline;