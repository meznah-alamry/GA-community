var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TimelineSchema = new Schema({
    content: String,
    user: {type : mongoose.Schema.Types.ObjectId , ref : 'Student' },
});

  const Timeline = mongoose.model('Timeline', TimelineSchema);
  module.exports = Timeline;