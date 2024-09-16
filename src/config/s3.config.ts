import { config } from '.';
import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
    region: config.env.AWS_REGION,
    credentials: {
        accessKeyId: config.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.env.AWS_SECRET_ACCESS_KEY,
    },
});

export default s3Client;
