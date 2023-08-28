import cloudinary from '../lib/cloudinary.js';

const uploadToCloudinary = async (filePath, resourceType, folder) => {
    const result = await cloudinary.uploader.upload(filePath, {
        resource_type: resourceType,
        folder: folder,
    });
    return result;
};
const deleteFile = async (publicId, resource_type) => {
    const result = await cloudinary.api.delete_resources(publicId, {
        resource_type: resource_type,
        all: true,
    });
    return result;
};
const createFolder = async (userId) => {
    await cloudinary.api.create_folder(userId);
};
const deleteFolder = async (pathFolder) => {
    await cloudinary.api.delete_folder(pathFolder);
};
export { uploadToCloudinary, deleteFile, deleteFolder, createFolder };
