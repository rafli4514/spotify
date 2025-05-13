import { Song } from "../models/song.model.js";

export const getAllSongs = async (req, res, next) => {
  try {
    const songs = await Song.find().sort({ create: -1 });
    res.status(200).json(songs);
  } catch (error) {
    next(error);
  }
};

export const getFeaturedSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      {
        $sampler: {size: 10},
      },
      {
        $project: {
            _id: 1,
            title: 1,
            artist: 1,
            imageUrl: 1,
            audioUrl: 1,
        }
      },
    ]);

    res.json(songs)
  } catch (error) {

  }
};

export const getMadeForYouSongs = async (req, res, next) => {
      try {
    const songs = await Song.aggregate([
      {
        $sampler: {size: 10},
      },
      {
        $project: {
            _id: 1,
            title: 1,
            artist: 1,
            imageUrl: 1,
            audioUrl: 1,
        }
      },
    ]);

    res.json(songs)
  } catch (error) {
    
  }
};

export const getTrendingSongs = async (req, res, next) => {
      try {
    const songs = await Song.aggregate([
      {
        $sampler: {size: 10},
      },
      {
        $project: {
            _id: 1,
            title: 1,
            artist: 1,
            imageUrl: 1,
            audioUrl: 1,
        }
      },
    ]);

    res.json(songs)
  } catch (error) {
    
  }
};
