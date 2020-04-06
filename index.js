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
  upload500Cities
} from './src/500-cities/image';
import {
  upload as uploadDocument
} from './src/controllers/documents';
import {
  upload as uploadSong
} from './src/controllers/songs';

let app = express();

app.use(bodyParser.json({ limit: '15000kb'}));
app.use(bodyParser.urlencoded({ limit: '15000kb'}));
app.use(cors({
  origin: '*'
}));

app.post('/image/upload', upload500Cities);

app.listen(process.env.PORT || 8080, (err) => {
  if (err) console.log(err);
  else console.log(`Server Running - Listening to port ${process.env.PORT}`);
});


