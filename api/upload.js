const {
          AWS_ACCESS_KEY_ID,
          AWS_SECRET_ACCESS_KEY,
          AWS_S3_BUCKET,
      } = process.env;

const {uuid} = require('uuidv4');
const S3     = require('aws-sdk/clients/s3');
const s3api  = new S3({
    apiVersion:      '2006-03-01',
    accessKeyId:     AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
});

module.exports = (app, db) => {
    app.put('/api/imageset/upload', async (req, res) => {
        const resUpload = await s3api.upload({
            Bucket: AWS_S3_BUCKET,
            Key:    uuid() + '.jpg',
            Body:   req,
            ACL:    "public-read"
        }).promise();

        const {Location} = resUpload;

        const id = db.main.prepare(
            `insert into s3_images (location, created_at) values ('${Location}','${(new Date().toISOString())}')`
        ).run().lastInsertRowid;

        res.json({id, location: Location});
    });
};
