import cloudinary from '../lib/cloudinary.js';

const getFolder = async (pathFolder) => {
    return (await cloudinary.api.sub_folders(pathFolder)).folders;
};
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
    return await cloudinary.api.create_folder(userId);
};
const deleteFolder = async (pathFolder) => {
    return await cloudinary.api.delete_folder(pathFolder);
};
const deleteResources = async (pathFolder) => {
    return await cloudinary.api.delete_resources_by_prefix(pathFolder);
};
export {
    uploadToCloudinary,
    deleteFile,
    deleteFolder,
    createFolder,
    deleteResources,
    getFolder,
};
