import s3 from '../utils/aws.repository';

/**
  * @function upload
  *
  * That function make upload from pdf .
  * For use that function make a POST request to
  *   /document/upload,
  *
  * @method GET
  * @param {base64Data} file
  * @param {string} id
  * @param {string} fileName
  */
export const upload = async (req, res) => {
  const { file, id, fileName } = req.body;
  const filename = fileName || `${new Date().getTime()}.pdf`;

  const data = file.replace(/^data:application\/pdf+;base64,/, '');
  const key = () => `documents/${id}/pdf/${filename}`;

  try {
    const base64Data = Buffer.from(data, 'base64');
    console.log('base64Data:', base64Data);
    const documentResponse = await s3.upload(base64Data, `${key()}`, 'application/pdf', process.env.BUCKET_NAME);
    res.status(200).send({
      data: {
        link: documentResponse.Location,
      },
    });
  } catch (err) {
    console.log('🚀 ~ file: documents.js ~ line 33 ~ upload ~ err', [err]);
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
