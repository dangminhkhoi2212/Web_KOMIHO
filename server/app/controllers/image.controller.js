import {
    deleteResources,
    uploadToCloudinary,
} from '../services/cloudinary.service.js';
import ApiError from '../utils/apiError.js';

export const uploadImages = async (req, res, next) => {
    try {
        const files = req.files;

        const userId = req.body.userId;
        if (files && files.length > 0) {
            // Wait for all the file upload promises to resolve
            const uploadPromises = await Promise.all(
                files.map((file) => {
                    return uploadToCloudinary(
                        file.path,
                        'image',
                        `komiho/users/${userId}/products/`,
                    );
                }),
            );
            const result = uploadPromises.map((image) => {
                let result = {
                    url: image.url,
                    public_id: image.public_id,
                };
                return result;
            });
            return res.send(result);
        } else return next(new ApiError(400, 'Do not find file.'));
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || error.error.message || 'Error server.',
            ),
        );
    }
};
export const deleteImages = async (req, res, next) => {
    try {
        const images = req.body;
        console.log(
            '🚀 ~ file: image.controller.js:44 ~ deleteImages ~ images:',
            images,
        );
        const publicIds = images.map((img) => img.public_id);

        if (publicIds.length > 0) {
            const result = await deleteResources(publicIds);
            console.log(
                '🚀 ~ file: image.controller.js:47 ~ deleteImages ~ result:',
                result,
            );
        }
        res.json({ message: 'Images on cloud were deleted', images, ok: true });
    } catch (error) {
        next(
            new ApiError(
                error.code || 500,
                error.message || error.error.message || 'Error server.',
            ),
        );
    }
};
