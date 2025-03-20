const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 5000;
app.use(cors());






const CONNECTION_STRING = "mongodb+srv://nacho:20Deabril%40@cluster0.3aqi7.mongodb.net/video?authSource=admin&replicaSet=atlas-s4z6td-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true";

// Conexión a MongoDB
mongoose.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const videoSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
  contentType: String,
});
const Video = mongoose.model('Video', videoSchema);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para subir video
app.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const newVideo = new Video({
      filename: req.file.originalname,
      data: req.file.buffer,
      contentType: req.file.mimetype,
    });
    const savedVideo = await newVideo.save();
    res.json({ message: 'Video subido correctamente', videoId: savedVideo._id  });
  } catch (error) {
    res.status(500).json({ error: 'Error subiendo el video' });
  }
});

// Ruta para obtener el video
app.get('/video/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: 'Video no encontrado' });
    res.set('Content-Type', video.contentType);
    res.send(video.data);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo el video' });
  }
});


app.get('/', async (req, res) => {
  try {
    res.json({ message: 'ok', videoId: ''  });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo el video' });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
