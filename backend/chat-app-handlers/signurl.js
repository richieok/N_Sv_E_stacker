import { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

let options = {
    region: 'us-east-1'
}

const fsignUrl = async ({ client, bucket, key }) => {
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(client, command, { expiresIn: 120 });
}

if (process.env.NODE_ENV) {
    options.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
}

const client = new S3Client(options);

export const signUrl = async (req, res) => {
    const { folder, filename } = req.params;
    // res.send(`${folder}/${filename}`)
    console.log(process.env.AWS_BUCKET)
    const url = await fsignUrl({ client, bucket: process.env.AWS_BUCKET, key: `${folder}/${filename}` });
    res.send(url);
}

export const signUrls = async (req, res) => {
    const json = req.body
    console.log(req.user.id)
    let surls = []
    const folder = req.user.id
    if (json && json.length > 0) {
        for (const filename of json) {
            const url = await fsignUrl({ client, bucket: process.env.AWS_BUCKET, key: `${folder}/${filename}` });
            surls.push(url)
        }
    }
    res.json({
        status: "success",
        surls
    })
}