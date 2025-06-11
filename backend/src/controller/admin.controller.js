import { Song } from "../models/song.model.js";
import { Album } from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";
import axios from "axios";
import axiosRetry from "axios-retry";
import sharp from "sharp";

// Menambahkan mekanisme retry untuk axios
axiosRetry(axios, {
  retries: 3,  // Jumlah percobaan ulang
  retryDelay: axiosRetry.exponentialDelay,  // Delay antara percobaan ulang
  shouldRetry: (error) => error.response && error.response.status === 500,  // Hanya coba ulang untuk error tertentu
});

// Helper function untuk kompresi gambar sebelum upload
const compressImage = async (filePath) => {
  try {
    const compressedFilePath = `compressed-${filePath}`;
    await sharp(filePath)
      .resize(800)  // Menyesuaikan ukuran gambar
      .toFile(compressedFilePath);
    console.log('Image compressed successfully');
    return compressedFilePath;
  } catch (error) {
    console.error('Error during image compression:', error);
    throw new Error('Error compressing image');
  }
};

// Helper function untuk upload file ke Cloudinary dengan timeout yang lebih lama
const uploadToCloudinary = async (file) => {
  try {
    // Jika file gambar, kompres terlebih dahulu
    if (file.mimetype.startsWith('image')) {
      file.tempFilePath = await compressImage(file.tempFilePath);
    }

    // Upload file ke Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
      timeout: 60000, // Timeout 60 detik untuk menghindari timeout
    });
    return result.secure_url;
  } catch (error) {
    console.log("Error in uploadToCloudinary", error);
    throw new Error("Error uploading to Cloudinary");
  }
};

// Fungsi untuk membuat lagu baru
export const createSong = async (req, res, next) => {
  try {
    if (!req.files || !req.files.audioFile || !req.files.imageFile) {
      return res.status(400).json({ message: "Please upload all files" });
    }

    const { title, artist, albumId, duration } = req.body;
    const audioFile = req.files.audioFile;
    const imageFile = req.files.imageFile;

    // Upload audio dan gambar ke Cloudinary
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

    // Jika lagu milik album, update array lagu di album
    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    res.status(201).json(song);
  } catch (error) {
    console.log("Error in createSong", error);
    next(error);
  }
};

// Fungsi untuk menghapus lagu
export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;

    const song = await Song.findById(id);

    // Jika lagu milik album, update array lagu di album
    if (song.albumId) {
      await Album.findByIdAndUpdate(song.albumId, {
        $pull: { songs: song._id },
      });
    }

    await Song.findByIdAndDelete(id);

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    console.log("Error in deleteSong", error);
    next(error);
  }
};

// Fungsi untuk membuat album baru
export const createAlbum = async (req, res, next) => {
  try {
    const { title, artist, releaseYear } = req.body;
    const { imageFile } = req.files;

    // Upload gambar album ke Cloudinary
    const imageUrl = await uploadToCloudinary(imageFile);

    const album = new Album({
      title,
      artist,
      imageUrl,
      releaseYear,
    });

    await album.save();

    res.status(201).json(album);
  } catch (error) {
    console.log("Error in createAlbum", error);
    next(error);
  }
};

// Fungsi untuk menghapus album
export const deleteAlbum = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Song.deleteMany({ albumId: id });
    await Album.findByIdAndDelete(id);
    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.log("Error in deleteAlbum", error);
    next(error);
  }
};

// Fungsi untuk mengecek status admin
export const checkAdmin = async (req, res, next) => {
  res.status(200).json({ admin: true });
};
