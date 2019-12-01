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
  const { file, id, fileName } = req.body;
  console.log('req.body:', req.body);
  const filename = fileName || `${new Date().getTime()}.pdf`;
  console.log('filename:', filename)
  const data = file.replace(/^data:application\/pdf+;base64,/, '');
  console.log('data:', data)
  const key = () => `documents/${id}/pdf/${filename}`;

  try {
    const base64Data = Buffer.from(data, 'base64');
    const documentResponse = await s3.upload(base64Data, `${key()}.mp3`, 'application/pdf', process.env.BUCKET_NAME);
    res.status(200).send({
      data: {
        link: documentResponse.Location,
      },
    });
  } catch (err) {
    res.status(500).send({
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
