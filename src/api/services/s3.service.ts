import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

import { config } from '@/config';
import s3Client from '@/config/s3.config';

const bucketName = config.env.AWS_BUCKET_NAME;

export const uploadFile = async (fileContent: Buffer, fileName: string, folder?: string): Promise<any> => {
    const uploadParams = {
        Bucket: bucketName,
        Key: folder ? `${folder}/${fileName}` : fileName,
        Body: fileContent,
    };
    const uploadCommand = new PutObjectCommand(uploadParams);

    return s3Client.send(uploadCommand);
};

export const downloadFile = async (fileName: string, folder?: string): Promise<any> => {
    const params = {
        Bucket: bucketName,
        Key: folder ? `${folder}/${fileName}` : fileName,
    };

    const getCommand = new GetObjectCommand(params);
    return s3Client.send(getCommand);
};

export const deleteFile = async (fileName: string, folder?: string): Promise<any> => {
    const params = {
        Bucket: bucketName,
        Key: folder ? `${folder}/${fileName}` : fileName,
    };

    const deleteCommand = new DeleteObjectCommand(params);
    return s3Client.send(deleteCommand);
};
