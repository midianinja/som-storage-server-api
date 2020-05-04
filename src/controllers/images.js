import base64Img from 'base64-img';
import imagemin from 'imagemin';
import imageminJpegRecompress from 'imagemin-jpeg-recompress';
import fs from 'fs';
import s3 from '../utils/aws.repository';
import md5 from 'md5';
/**
  * @function upload
  *
  * That function delete an credit card on wirecard api.
  * That action is irreversible.
  * For use that function make a GET request to
  *   /delete-credit-card?wirecardId=CRC-5TUWT121PNZY,
  *   the wirecardId in query, is the credit card id in Wirecard
  *
  * @method GET
  * @param {string} wirecardId
  */
export const upload = async (req, res) => {
  const { file, id } = req.body;
  const filename = `${new Date().getTime()}`;
  const data = JSON.parse(file).data.replace(/^data:image\/\w+;base64,/, '');
  const base64Data = Buffer.from(data, 'base64');
  const rootDir = '/tmp';
  const originalTmpPath = `${rootDir}/originals/`;
  const mimifiedTmpPath = `${rootDir}/mimifieds/`;
  const thumbnailTmpPath = `${rootDir}/thumbnails/`;
  const key = type => `images/${id}/jpg/${type}`;

  const filepath = await base64Img.imgSync(
    `data:image/jpg;base64,${data}`,
    originalTmpPath,
    filename,
  );

  await imagemin([filepath], mimifiedTmpPath, {
    plugins: [
      imageminJpegRecompress({
        loops: 4,
        quality: 'high',
      }),
    ],
  });

  await imagemin([filepath], thumbnailTmpPath, {
    plugins: [
      imageminJpegRecompress({
        loops: 4,
        quality: 'low',
      }),
    ],
  });

  const urls = {};
  console.log('urls: ', urls);

  try {
    const originalResponse = await s3.upload(base64Data, `${key('originals')}/${md5(base64Data)}-${filename}.jpg`, 'image/jpeg', process.env.BUCKET_NAME);
    urls.original = originalResponse.Location;
  } catch (err) {
    console.log('Orifinal image error', err);
    return res.status(500)
      .send({
        error: {
          type: 'upload_original_image',
          info: err,
        },
      });
  }

  try {
    const mimifiedBuffer = await fs.readFileSync(`${mimifiedTmpPath + filename}.jpg`);
    const mimifiedResponse = await s3.upload(mimifiedBuffer, `${key('mimifieds')}/${md5(mimifiedBuffer)}-${filename}.jpg`, 'image/jpeg', process.env.BUCKET_NAME);
    urls.mimified = mimifiedResponse.Location;
  } catch (err) {
    console.log('mimified image error', err);
    return res.status(500)
      .send({
        error: {
          type: 'process_mimified_image',
          info: err,
        },
      });
  }

  try {
    const thumbnailBuffer = await fs.readFileSync(`${thumbnailTmpPath + filename}.jpg`);
    const thumbnailResponse = await s3.upload(thumbnailBuffer, `${key('thumbnails')}/${md5(thumbnailBuffer)}-${filename}.jpg`, 'image/jpeg', process.env.BUCKET_NAME);
    urls.thumbnail = thumbnailResponse.Location;
  } catch (err) {
    console.log('upload image error', err);
    return res.status(500)
      .send({
        error: {
          type: 'process_thumbnail_image',
          info: err,
        },
      });
  }

  console.log('urls: ', urls);
  return res.status(200)
    .send({
      data: {
        urls,
      },
    });
};

export const remove = (event) => {
  console.log('here', event);
};
