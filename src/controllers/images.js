import base64Img from 'base64-img';
import imagemin from 'imagemin';
import imageminJpegRecompress from 'imagemin-jpeg-recompress';
import fs from 'fs';
import s3 from '../utils/aws.repository';
/**
  * @function upload
  *
 * That function make upload of a image .
  * For use that function make a POST request to /image/upload
  *
  * @method POST
  * @param {base64Data} file
  * @param {string} id
  */
export const upload = async (req, res) => {
  // const myData = JSON.parse(JSON.stringify(req.body).slice(1, -1));
  const { file, id } = req.body;
  const filename = `${new Date().getTime()}`;
  const data = file.replace(/^data:image\/\w+;base64,/, '');
  const base64Data = Buffer.from(data, 'base64');
  const rootDir = '/tmp';
  const originalTmpPath = `${rootDir}/originals/`;
  const mimifiedTmpPath = `${rootDir}/mimifieds/`;
  const thumbnailTmpPath = `${rootDir}/thumbnails/`;
  const key = type => `images/${id}/jpg/${type}/${filename}`;

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
    const originalResponse = await s3.upload(base64Data, `${key('originals')}.jpg`, 'image/jpeg', process.env.BUCKET_NAME);
    urls.original = originalResponse.Location;
  } catch (err) {
    console.log('Orifinal image error', err);
    return res.status(500).send({
      error: {
        type: 'upload_original_image',
        info: err,
      },
    });
  }

  try {
    const mimifiedBuffer = await fs.readFileSync(`${mimifiedTmpPath + filename}.jpg`);
    const mimifiedResponse = await s3.upload(mimifiedBuffer, `${key('mimifieds')}.jpg`, 'image/jpeg', process.env.BUCKET_NAME);
    urls.mimified = mimifiedResponse.Location;
  } catch (err) {
    console.log('mimified image error', err);
    return res.status(500).send({
      error: {
        type: 'process_mimified_image',
        info: err,
      },
    });
  }

  try {
    const thumbnailBuffer = await fs.readFileSync(`${thumbnailTmpPath + filename}.jpg`);
    const thumbnailResponse = await s3.upload(thumbnailBuffer, `${key('thumbnails')}.jpg`, 'image/jpeg', process.env.BUCKET_NAME);
    urls.thumbnail = thumbnailResponse.Location;
  } catch (err) {
    console.log('upload image error', err);
    return res.status(500).send({
      error: {
        type: 'process_thumbnail_image',
        info: err,
      },
    });
  }

  console.log('urls: ', urls);
  return res.status(200).send({
    data: {
      urls,
    },
  });
};

export const remove = (event) => {
  console.log('here', event);
};
