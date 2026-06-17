import { sharedEnv } from './env';

const cloudinaryUrl = sharedEnv.CLOUDINARY_CLOUD_NAME
  ? `https://res.cloudinary.com/${sharedEnv.CLOUDINARY_CLOUD_NAME}/image/upload`
  : null;

type CloudinaryUploadType = {
  folder: string;
  transformation: string;
  format: string;
  presets: Record<string, string>;
};

export const cloudinaryUploadTypes = {
  avatar: {
    folder: 'avatars',
    transformation: 'w_400,h_400,c_fill',
    format: 'png',
    presets: {
      small: 'w_200,h_200,c_fill',
      big: 'w_400,h_400,c_fill',
    },
  },
} satisfies Record<string, CloudinaryUploadType>;

type CloudinaryUploadTypes = typeof cloudinaryUploadTypes;
export type CloudinaryUploadTypeName = keyof CloudinaryUploadTypes;
export type CloudinaryUploadPresetName<
  TTypeName extends CloudinaryUploadTypeName,
> = keyof CloudinaryUploadTypes[TTypeName]['presets'];

export const getCloudinaryUploadUrl = <
  TTypeName extends CloudinaryUploadTypeName,
>(
  publicId: string,
  typeName: TTypeName,
  presetName: CloudinaryUploadPresetName<TTypeName>
) => {
  if (!cloudinaryUrl) {
    throw new Error('CLOUDINARY_CLOUD_NAME is not configured');
  }
  const type = cloudinaryUploadTypes[typeName] as CloudinaryUploadType;
  const preset = type.presets[presetName as string];
  return `${cloudinaryUrl}/${preset}/${publicId}`;
};

export const getAvatarUrl = (
  publicId: string | null | undefined,
  preset: keyof CloudinaryUploadTypes['avatar']['presets']
) => (publicId ? getCloudinaryUploadUrl(publicId, 'avatar', preset) : null);
