import { zUpdateEmailTrpcInput } from '@leisuretask/backend/src/router/auth/updateEmail/input';
import { useTranslation } from 'react-i18next';
import { trpc } from '../../../lib/trpc';
import { Form } from '../../Form';
import { Field } from '../../Form/Field';
import { Modal } from '../../Modal';

type UpdateEmailModalProps = {
  isUpdateEmailModalOpen: boolean;
  setIsUpdateEmailModalOpen: (isOpen: boolean) => void;
  updateEmailMutation: any;
};

export const UpdateEmailModal: React.FC<UpdateEmailModalProps> = ({
  isUpdateEmailModalOpen,
  setIsUpdateEmailModalOpen,
  updateEmailMutation,
}) => {
  const { t } = useTranslation();
  const trpcUtils = trpc.useUtils();

  return (
    <Modal
      isOpen={isUpdateEmailModalOpen}
      onClose={() => setIsUpdateEmailModalOpen(false)}
    >
      <Form
        id="updateEmailForm"
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={zUpdateEmailTrpcInput}
        onSubmit={async ({ email, password }) => {
          const updatedMe = await updateEmailMutation.mutateAsync({
            email,
            password,
          });
          trpcUtils.getMe.setData(undefined, { me: updatedMe });
          setIsUpdateEmailModalOpen(false);
        }}
        submitButtonText={t('changeEmail')}
      >
        <Field
          name="email"
          label={t('email')}
          type="email"
          placeholder={t('typeNewEmail')}
          stretch
          marginBottom
        />
        <Field
          name="password"
          label={t('password')}
          type="password"
          placeholder={t('typePassword')}
          stretch
          marginBottom
        />
      </Form>
    </Modal>
  );
};
