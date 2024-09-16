import multer from 'multer';
import multerS3 from 'multer-s3';

import { config } from '@/config';
import s3Client from '@/config/s3.config';

export default (folderName?: string) =>
    multer({
        storage: multerS3({
            s3: s3Client,
            bucket: config.env.AWS_BUCKET_NAME,
            metadata: function (req, file, cb) {
                cb(null, { fieldName: file.fieldname });
            },
            key: function (req, file, cb) {
                const filename = `${Date.now().toString()}-${file.originalname}`;
                cb(null, folderName ? `${folderName}/${filename}` : filename);
            },
        }),
    });
