import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { promisify } from 'util';
import config from '../config';

const unlink = promisify(fs.unlink);

cloudinary.config({
    cloud_name: config.cloudinary_name,
    api_key: config.cloudinary_api_key,
    api_secret: config.cloudinary_api_secret,
});

export default async function uploadImage(
    filepath: string,
    publicId: string,
    folder?: string,
) {
    const uploadResult = await cloudinary.uploader.upload(filepath, {
        public_id: publicId,
        folder: folder,
    });

    await unlink(filepath);

    return uploadResult;
}
