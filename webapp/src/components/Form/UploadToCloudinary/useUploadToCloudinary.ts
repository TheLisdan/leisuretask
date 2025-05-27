import { CloudinaryUploadTypeName } from '@leisuretask/shared/src/cloudinary';
import { trpc } from '../../../lib/trpc';

export const useUploadToCloudinary = (type: CloudinaryUploadTypeName) => {
  const preparedCloudinaryUpload = trpc.prepareCloudinaryUpload.useMutation();

  const uploadToCloudinary = async (file: File) => {
    const { preparedData } = await preparedCloudinaryUpload.mutateAsync({
      type,
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('timestamp', preparedData.timestamp);
    formData.append('folder', preparedData.folder);
    formData.append('transformation', preparedData.transformation);
    formData.append('eager', preparedData.eager);
    formData.append('signature', preparedData.signature);
    formData.append('api_key', preparedData.apiKey);

    return fetch(preparedData.url, {
      method: 'POST',
      body: formData,
    })
      .then(async (rawRes) => {
        return await rawRes.json();
      })
      .then((res) => {
        if (res.error) {
          throw new Error(res.error.message);
        }
        return {
          publicId: res.public_id as string,
          res,
        };
      });
  };

  return { uploadToCloudinary };
};
