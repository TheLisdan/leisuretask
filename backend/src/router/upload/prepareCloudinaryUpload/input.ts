import { cloudinaryUploadTypes } from '@leisuretask/shared/src/cloudinary';
import { getKeysAsArray } from '@leisuretask/shared/src/getKeysAsArray';
import { z } from 'zod';

export const zPrepareCloudinaryUploadTrpcInput = z.object({
  type: z.enum(getKeysAsArray(cloudinaryUploadTypes)),
});
