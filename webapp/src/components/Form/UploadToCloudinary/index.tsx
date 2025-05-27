import { CloudinaryUploadTypeName } from '@leisuretask/shared/src/cloudinary';
import { useFormikContext } from 'formik';
import { useRef, useState } from 'react';
import css from './index.module.scss';
import { useUploadToCloudinary } from './useUploadToCloudinary';

type UploadToCloudinaryProps<TTypeName extends CloudinaryUploadTypeName> = {
  name: string;
  type: TTypeName;
  children?: React.ReactNode;
};

export const UploadToCloudinary: React.FC<
  UploadToCloudinaryProps<CloudinaryUploadTypeName>
> = ({ name, type, children }) => {
  const inputEl = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setFieldValue, submitForm } = useFormikContext();

  const { uploadToCloudinary } = useUploadToCloudinary(type);

  return (
    <div>
      <input
        type="file"
        name={name}
        disabled={isLoading}
        ref={inputEl}
        accept="image/*"
        className={css.uploadInput}
        onChange={({ target: { files } }) => {
          void (async () => {
            setIsLoading(true);
            try {
              if (files?.length) {
                const file = files[0];
                const { publicId } = await uploadToCloudinary(file);
                await setFieldValue(name, publicId);
                await new Promise((resolve) => setTimeout(resolve, 100));
                await submitForm();
              }
            } catch (err: any) {
              console.error('Error uploading to Cloudinary:', err);
            } finally {
              setIsLoading(false);
              if (inputEl.current) {
                inputEl.current.value = '';
              }
            }
          })();
        }}
        title="Upload Avatar"
      />
      {!isLoading && (
        <div onClick={() => inputEl.current?.click()}>{children}</div>
      )}
    </div>
  );
};
