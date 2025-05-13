import { Router } from "express";
import { User } from "../models/user.model.js";
import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";

export const getStats =  async (req, res, next) => {
  try {
    // const totalSongs = await Song.countDocuments();
    // const totalUsers = await User.countDocuments();
    // const totalAlbums = await Album.countDocuments();

    const [totalSongs, totalUsers, totalAlbums, uniqueArtists] = Promise.all([
      Song.countDocuments(),
      User.countDocuments(),
      Album.countDocuments(),

      Song.aggregate([
        {
          $unionWith: {
            coll: "albums",
            pipeline: [],
          },
        },
        {
          $group: {
            _id: "$artist",
          },
        },
        {
          $count: "count",
        },
      ]),
    ]);

    res.status(200).json({
      totalSongs,
      totalUsers,
      totalAlbums,
      uniqueArtists: uniqueArtists[0]?.count || 0,
    });
  } catch (error) {
    
  }
}