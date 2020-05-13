const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
    dropDups: true
  },
  category: { type: String },
  agency: { type: String },
  year: { type: Number },
  type: { type: String },
  name: { type: String },
  address: { type: String },
  city: { type: String },
  zip: { type: String },
  date: { type: String },
  cost: { type: Number },
  fullLocation: { type: String },
  lat: { type: String, default: 'N/A' },
  long: { type: String, default: 'N/A' }
});

module.exports = mongoose.model('Posts', PostSchema);
