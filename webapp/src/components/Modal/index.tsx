import cs from 'classnames';
import { useState } from 'react';
import ReactModal from 'react-modal';
import css from './index.module.scss';

type ModalProps = {
  children?: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  sidebarItems?: {
    label: string;
    icon: React.ReactNode;
    tabName: string;
    content: React.ReactNode;
  }[];
};

ReactModal.setAppElement('#root');

export const Modal: React.FC<ModalProps> = ({
  children,
  isOpen,
  onClose,
  sidebarItems = [],
}) => {
  const [activeTab, setActiveTab] = useState(sidebarItems[0]?.tabName || '');

  const renderContent = () => {
    if (sidebarItems.length === 0) {
      return children;
    }

    const activeItem = sidebarItems.find((item) => item.tabName === activeTab);
    return activeItem?.content;
  };
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
      {sidebarItems.length > 0 && (
        <div className={css.modalSidebar}>
          {sidebarItems.map((item) => (
            <button
              key={item.tabName}
              type="button"
              className={cs(css.sidebarTab, {
                [css.activeTab]: item.tabName === activeTab,
              })}
              onClick={() => setActiveTab(item.tabName)}
            >
              <span className={css.sidebarIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
      <div className={css.modalContent}>{renderContent()}</div>
    </ReactModal>
  );
};
