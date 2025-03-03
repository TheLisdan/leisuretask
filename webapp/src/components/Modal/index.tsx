import ReactModal from 'react-modal';
import css from './index.module.scss';

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

ReactModal.setAppElement('#root');

export const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={css.modal}
      overlayClassName={css.modalOverlay}
      closeTimeoutMS={200}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
    >
      {children}
    </ReactModal>
  );
};
