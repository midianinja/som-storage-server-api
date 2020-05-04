import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

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

app.use(bodyParser.json({ limit: '15000kb'}));
app.use(bodyParser.urlencoded({ limit: '15000kb', extended: true }));
app.use(cors({
  origin: 'https://dev.som.vc'
}));

app.post('/image/upload', uploadImage);
app.post('/song/upload', uploadSong);
app.post('/document/upload', uploadDocument);

app.listen(process.env.PORT || 8080, (err) => {
  if (err) console.log(err);
  else console.log(`Server Running - Listening to port ${process.env.PORT || 8080}`);
});


