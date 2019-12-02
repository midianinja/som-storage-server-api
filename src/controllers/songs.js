// import base64Img from 'base64-img';
// import imagemin from 'imagemin';
// import imageminJpegRecompress from 'imagemin-jpeg-recompress';
// import fs from 'fs';
import s3 from '../utils/aws.repository';
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
  const myData = JSON.parse(JSON.stringify(req.body).slice(1, -4));
  console.log('myData:', myData)
  console.log('myData:', typeof myData)
  const { file, id } = JSON.parse(myData);
  console.log('file:', file);
  const filename = `${new Date().getTime()}`;
  const data = file.replace(/^data:audio\/mp3+;base64,/, '');
  const key = () => `songs/${id}/mp3/${filename}`;

  try {
    const base64Data = Buffer.from(data, 'base64');
    console.log('base64Data:', base64Data);
    const originalResponse = await s3.upload(base64Data, `${key()}.mp3`, 'audio/mp3', process.env.BUCKET_NAME);
    console.log('originalResponse:', originalResponse);
    return res.status(200).send({
      data: {
        link: originalResponse.Location,
      },
    });
  } catch (err) {
    console.log('Orifinal image error', err);
    return res.status(500).send({
      error: {
        type: 'upload_song_error',
        info: err,
      },
    });
  }
};

export const remove = (event) => {
  console.log('here', event);
};

// export const upload = (event) => {
// const multipartData = await multipart.parse(event);
//   if (multipartData.error) {
//     return ({
//       statusCode: 500,
//       body: JSON.stringify({
//         error: true,
//         msg: 'Internal Server Error',
//         info: 'internal_server_error',
//       }),
//     });
//   }

//   const { file, info } = multipartData;
//   let fileData, filePath;

//   if(types.findIndex(type => type === info.ext) === -1) {
//     return ({
//       statusCode: 401,
//       body: JSON.stringify({
//         error: true,
//         msg: 'not_support',
//         info: 'Image extension not supported',
//       }),
//     });
//   }

//   const rootDir = process.cwd();
// await imagemin([file.path], rootDir+'/tmp', {
//   plugins: [
//     imageminJpegRecompress(),
//     imageminPngquant({ quality: '50-70' })
//   ]
// });

//   filePath = rootDir + file.path;
//   fileData = await fileSystem.read(filePath);
//   const key = `image/${id}/${info.ext}/${fileId}.${info.ext}`;

//   const result =
// await s3.upload(fileData, key, info.contentType, event.stagestgVariables.bucketName);
//   fileSystem.delete(filePath);
// }
