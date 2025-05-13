import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";


const uploadToCloudinary = async (file) => {
  try {
    const result = await uploadToCloudinary.uploader.upload(file.tempfilepath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error uploading to Cloudinary:", error);
    throw new Error("Error uploading to cloudinary");
  }
};

export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "tolong upload semua file" });
    }

    const { title, artist, genre, album } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    const audioUrl = await uploadToCloudinary(audioFile);
    const imageUrl = await uploadToCloudinary(imageFile);

    const song = new Song({
      title,
      artist,
      audioUrl,
      imageUrl,
      duration,
      albumId: albumId || null,
    });

    await song.save();

    if (albumId) {
      const album = await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }
    res.status(201).json({ message: "lagu berhasil ditambahkan" });
  } catch (error) {
    console.error("Error creating song:", error);
    next(error);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);

    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);

    res.status(200).json({
      message: "lagu berhasil dihapus",
    });
  } catch (error) {
    console.log("Error menghapus lagu:", error);
    next(error);
  }
};

export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;

    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
    })

    await album.save()
    res.status(201).json(album)

  } catch (error) {
    console.log("Error membuat album:", error);
    next(error);
  }
};
export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Song.deleteMany({
      albumId: id
    })
    await Album.findByIdAndDelete(id);
    res.status(200).json({
      message: "album berhasil dihapus",
    })
  } catch (error) {
    console.log("Error menghapus album:", error);
    next(error);
  }
};

export const checkAdmin = async (req, res, next) => {
  res.status(200).json({
    admin: true,
    message: "anda adalah admin",
  })
}