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
  try {
    const { file, id } = req.body;
    if (!file) throw new Error('file/undefined');
    const filename = `${new Date().getTime()}.pdf`;

    const data = file.replace(/^data:application\/pdf+;base64,/, '');
    console.log('data:', data)
    const key = () => `documents/${id || 'WITHOUT_ID'}/pdf`;

    const base64Data = Buffer.from(data, 'base64');
    console.log('base64Data:', base64Data);
    const documentResponse = await s3.upload(base64Data, `${key()}/${md5(base64Data)}-${filename}`, 'application/pdf', process.env.BUCKET_NAME);
    res.status(200).setHeader('X-Content-Type-Options', 'nosniff')
    .send({
      data: {
        link: documentResponse.Location,
      },
    });
  } catch (err) {
    res.status(500).setHeader('X-Content-Type-Options', 'nosniff').send({
        error: {
          type: 'upload_document_error',
          info: err,
        },
      });
  }
};

export const remove = (event) => {
  console.log('here', event);
};
