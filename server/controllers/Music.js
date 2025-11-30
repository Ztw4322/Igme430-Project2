const models = require('../models');

const { Music } = models;

const makeMusic = async (req, res) => {
  if (!req.body.musicType || !req.body.genre || !req.body.albumName
    || !req.body.artistName || !req.body.url || !req.body.personName) {
    return res.status(400).json({ error: 'All Fields Required!!!!' });
  }

  const MusicData = {
    musicType: req.body.musicType,
    genre: req.body.genre,
    albumName: req.body.albumName,
    artistName: req.body.artistName,
    url: req.body.url,
    personName: req.body.personName,
    owner: req.session.account._id,
  };

  try {
    const newMusic = new Music(MusicData);
    await newMusic.save();
    return res.status(201).json({
      musicType: newMusic.musicType,
      genre: newMusic.genre,
      albumName: newMusic.albumName,
      artistName: newMusic.artistName,
      url: newMusic.url,
      personName: newMusic.personName,
    });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Music Already Exists!' });
    }
    return res.status(500).json({ error: 'An Error occured making Music!' });
  }
};

const getMusics = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Music.find(query).select('musicType genre albumName artistName url personName').lean().exec();
    return res.json({ Musics: docs });
  }
  catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving Musics!' });
  }
}

const makerPage = (req, res) => {
  return res.render('app');
};

module.exports = {
  makerPage,
  makeMusic,
  getMusics,
};
