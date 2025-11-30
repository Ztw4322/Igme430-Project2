const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const musicSchema = new mongoose.Schema({
  musicType: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  albumName: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  artistName: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  url: {
    type: String,
    required: true,
  },
  personName: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

musicSchema.statics.toAPI = (doc) => ({
  musicType: doc.musicType,
  genre: doc.genre,
  albumName: doc.albumName,
  artistName: doc.artistName,
  url: doc.url,
  personName: doc.personName,
});

const MusicModel = mongoose.model('Music', musicSchema);
module.exports = MusicModel;
