import { zUpdateEmailTrpcInput } from '@leisuretask/backend/src/router/auth/updateEmail/input';
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
        submitButtonText="Change E-Mail"
      >
        <Field
          name="email"
          label="E-Mail"
          type="email"
          placeholder="Type your new E-Mail"
          stretch
          marginBottom
        />
        <Field
          name="password"
          label="Password"
          type="password"
          placeholder="Type your password"
          stretch
          marginBottom
        />
      </Form>
    </Modal>
  );
};
