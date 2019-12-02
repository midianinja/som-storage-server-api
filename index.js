import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import {
  getUserLastPics, getUserProfilePic,
} from './src/controllers/getUserMedia';
import {
  upload as uploadImage
} from './src/controllers/images'
import {
  upload as uploadDocument
} from './src/controllers/documents'
import {
  upload as uploadSong
} from './src/controllers/songs'

let app = express();

app.use(bodyParser.json());
app.use(express.json({ extended: true, limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb'}));
app.use(cors({
  origin: 'https://som.vc'
}));

app.get('/insta/photos/:username', getUserLastPics);
app.get('/insta/profile/:username', getUserProfilePic);
app.post('/image/upload', uploadImage);
app.post('/song/upload', uploadSong);
app.post('/document/upload', uploadDocument);

app.listen(process.env.PORT || 8080, (err) => {
  if (err) console.log(err);
  else console.log(`Server Running - Listening to port ${8080}`);
});


