import { ru, enUS, uk, Locale } from 'date-fns/locale';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const dateFnsLocales: Record<string, Locale> = {
  ru,
  en: enUS,
  uk,
};

export const getCurrentDateFnsLocale = () => {
  const currentLang = i18n.language || 'en';
  return dateFnsLocales[currentLang] || enUS;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    detection: {
      order: ['navigator'],
      caches: [],
    },
    resources: {
      en: {
        translation: {
          // Common actions
          edit: 'Edit',
          delete: 'Delete',
          save: 'Save',
          cancel: 'Cancel',
          more: 'More',
          loadMore: 'Load more',

          // Task related
          updateTask: 'Update task',
          createTask: 'Create task',
          taskTitle: 'Task title',
          timeAward: 'Time Award',
          deadline: 'Deadline',
          setDeadline: 'Set deadline',
          title: 'Title',

          // Task statuses
          inProgress: 'In Progress',
          completed: 'Completed',
          failed: 'Failed',

          // Settings
          settings: 'Settings',
          account: 'Account',
          password: 'Password',
          oldPassword: 'Old password',
          newPassword: 'New password',
          newPasswordAgain: 'New password again',
          changePassword: 'Change password',
          changeEmail: 'Change E-Mail',
          email: 'E-Mail',

          // Timer
          avaiableTime: 'Available time',
          start: 'Start',
          stop: 'Stop',

          // Auth forms
          signIn: 'Sign In',
          signUp: 'Sign Up',
          signOut: 'Sign Out',
          dontHaveAccount: "Don't have an account?",
          alreadyHaveAccount: 'Already have an account?',

          // Landing page
          heroTitle: 'Manage Your Time Effectively',
          heroSubtitle: 'Track tasks, earn time rewards, and stay productive',
          featureTimer: 'Smart Timer',
          featureTimerDesc:
            'Track your task completion time and earn bonus time for finishing them',
          featureManagement: 'Easy Task Management',
          featureManagementDesc:
            'Create, organize and mark tasks as completed in a user-friendly interface',
          featureRewards: 'Reward System',
          featureRewardsDesc: 'Get extra time for completing tasks on schedule',

          // Form placeholders
          name: 'Name',
          typePassword: 'Type your password',
          typeNewPassword: 'Type your new password',
          typeNewPasswordAgain: 'Type your new password again',
          typeOldPassword: 'Type your old password',
          typeEmail: 'Type your E-Mail',
          typeNewEmail: 'Type your new E-Mail',
        },
      },
      ru: {
        translation: {
          // Common actions
          edit: 'Изменить',
          delete: 'Удалить',
          save: 'Сохранить',
          cancel: 'Отмена',
          more: 'Ещё',
          loadMore: 'Загрузить ещё',

          // Task related
          updateTask: 'Обновить задачу',
          createTask: 'Создать задачу',
          taskTitle: 'Название задачи',
          timeAward: 'Награда временем',
          deadline: 'Срок выполнения',
          setDeadline: 'Установить срок',
          title: 'Название',

          // Task statuses
          inProgress: 'В процессе',
          completed: 'Выполнено',
          failed: 'Провалено',

          // Settings
          settings: 'Настройки',
          account: 'Аккаунт',
          password: 'Пароль',
          oldPassword: 'Старый пароль',
          newPassword: 'Новый пароль',
          newPasswordAgain: 'Повторите новый пароль',
          changePassword: 'Изменить пароль',
          changeEmail: 'Изменить E-Mail',
          email: 'E-Mail',

          // Timer
          avaiableTime: 'Доступное время',
          start: 'Старт',
          stop: 'Стоп',

          // Auth forms
          signIn: 'Войти',
          signUp: 'Регистрация',
          signOut: 'Выйти',
          dontHaveAccount: 'Нет аккаунта?',
          alreadyHaveAccount: 'Уже есть аккаунт?',

          // Landing page
          heroTitle: 'Управляйте своим временем эффективно',
          heroSubtitle:
            'Отслеживайте задачи, получайте награды временем и повышайте продуктивность',
          featureTimer: 'Умный таймер',
          featureTimerDesc:
            'Отслеживайте время выполнения задач и получайте бонусное время за их завершение',
          featureManagement: 'Простое управление задачами',
          featureManagementDesc:
            'Создавайте, организуйте и отмечайте задачи как выполненные в удобном интерфейсе',
          featureRewards: 'Система наград',
          featureRewardsDesc:
            'Получайте дополнительное время за выполнение задач по графику',

          // Form placeholders
          name: 'Имя',
          typePassword: 'Введите пароль',
          typeNewPassword: 'Введите новый пароль',
          typeNewPasswordAgain: 'Повторите новый пароль',
          typeOldPassword: 'Введите старый пароль',
          typeEmail: 'Введите E-Mail',
          typeNewEmail: 'Введите новый E-Mail',
        },
      },
      uk: {
        translation: {
          // Common actions
          edit: 'Змінити',
          delete: 'Видалити',
          save: 'Зберегти',
          cancel: 'Скасувати',
          more: 'Ще',
          loadMore: 'Завантажити ще',

          // Task related
          updateTask: 'Оновити завдання',
          createTask: 'Створити завдання',
          taskTitle: 'Назва завдання',
          timeAward: 'Нагорода часом',
          deadline: 'Термін виконання',
          setDeadline: 'Встановити термін',
          title: 'Назва',

          // Task statuses
          inProgress: 'В процесі',
          completed: 'Виконано',
          failed: 'Провалено',

          // Settings
          settings: 'Налаштування',
          account: 'Обліковий запис',
          password: 'Пароль',
          oldPassword: 'Старий пароль',
          newPassword: 'Новий пароль',
          newPasswordAgain: 'Повторіть новий пароль',
          changePassword: 'Змінити пароль',
          changeEmail: 'Змінити E-Mail',
          email: 'E-Mail',

          // Timer
          avaiableTime: 'Доступний час',
          start: 'Старт',
          stop: 'Стоп',

          // Auth forms
          signIn: 'Увійти',
          signUp: 'Реєстрація',
          signOut: 'Вийти',
          dontHaveAccount: 'Немає облікового запису?',
          alreadyHaveAccount: 'Вже є обліковий запис?',

          // Landing page
          heroTitle: 'Керуйте своїм часом ефективно',
          heroSubtitle:
            'Відстежуйте завдання, отримуйте нагороди часом та підвищуйте продуктивність',
          featureTimer: 'Розумний таймер',
          featureTimerDesc:
            'Відстежуйте час виконання завдань та отримуйте бонусний час за їх завершення',
          featureManagement: 'Просте керування завданнями',
          featureManagementDesc:
            'Створюйте, організовуйте та позначайте завдання як виконані у зручному інтерфейсі',
          featureRewards: 'Система нагород',
          featureRewardsDesc:
            'Отримуйте додатковий час за виконання завдань за графіком',

          // Form placeholders
          name: "Ім'я",
          typePassword: 'Введіть пароль',
          typeNewPassword: 'Введіть новий пароль',
          typeNewPasswordAgain: 'Повторіть новий пароль',
          typeOldPassword: 'Введіть старий пароль',
          typeEmail: 'Введіть E-Mail',
          typeNewEmail: 'Введіть новий E-Mail',
        },
      },
    },
  });

export default i18n;
