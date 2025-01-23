import { Link, Outlet } from 'react-router-dom';
import { getHomeRoute } from '../../lib/routes';
import css from './index.module.scss';
import Modal from 'react-modal';
import { TodoLogo } from './todo-logo';
import { useState } from 'react';

Modal.setAppElement('#root');

export const Layout = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  return (
    <div className={css.layout}>
      <nav className={css.navigation}>
        <Link to={getHomeRoute()} className={css.link}>
          <TodoLogo className={css.logo} />
        </Link>
        <button onClick={openModal} className={css.openButton}>
          Открыть модальное окно
        </button>
      </nav>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className={css.modal}
        overlayClassName={css.overlay}
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
      >
        <h2>Модальное окно</h2>
        <p>Это содержимое модального окна.</p>
        <button type="button" onClick={closeModal} className={css.closeButton}>
          Закрыть
        </button>
      </Modal>
      <Outlet />
    </div>
  );
};
