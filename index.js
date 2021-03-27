import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config()

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

dotenv.config();
let app = express();

app.use(bodyParser.json({ limit: '15000kb', type: 'application/json' }));
app.use(bodyParser.urlencoded({ limit: '15000kb'}));

const allowedDomains = [
  'https://www.som.vc',
  'https://som.vc',
  'https://dev.som.vc',
  'https://main.dkeswowbvzjm7.amplifyapp.com',
];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
}

app.use(cors((req, callback) => {
  console.log('🚀 ~ file: index.js ~ line 38 ~ app.use ~ req', req);
  console.log('origin -------', req.referer);
  
  // if (allowedDomains.indexOf(req.header('origin')) !== -1) {
    console.log('🚀 ~ file: index.js ~ line 48 ~ app.use ~', req.header('origin'));
    callback(null, { origin: true });
  // } else {
  //   callback(new Error('Not allowed by CORS'));
  // }
}));

app.get('/insta/photos/:username', getUserLastPics);
app.get('/insta/profile/:username', getUserProfilePic);
app.post('/image/upload', uploadImage);
app.post('/song/upload', uploadSong);
app.post('/document/upload', uploadDocument);

app.listen(process.env.PORT || 3002, (err) => {
  if (err) console.log(err);
  else console.log(`Server Running - Listening to port ${process.env.PORT || 3002}`);
});


