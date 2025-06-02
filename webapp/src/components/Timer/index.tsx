import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useMe } from '../../lib/ctx';
import { trpc } from '../../lib/trpc';
import css from './index.module.scss';

const formatTime = (seconds: number): string => {
  const validSeconds = Math.max(0, seconds);
  const hours = Math.floor(validSeconds / 3600);
  const minutes = Math.floor((validSeconds % 3600) / 60);
  const remainingSeconds = validSeconds % 60;
  return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export const Timer: React.FC = () => {
  const { t } = useTranslation();
  const me = useMe();
  const utils = trpc.useUtils();

  if (!me) {
    return null;
  }

  const [time, setTime] = useState(me.avaiableTime);
  const [isActive, setIsActive] = useState(me.timerActive);

  const toggleTimerMutation = trpc.toggleTimer.useMutation({
    onError: (error) => {
      console.error('Failed to toggle timer:', error);
      setIsActive((prev) => !prev);
    },
  });

  const saveTimeMutation = trpc.saveTime.useMutation({
    onError: (error) => {
      console.error('Failed to save time:', error);
    },
    onSuccess: () => {
      utils.getTasks.invalidate();
    },
  });

  useEffect(() => {
    const saveInterval = setInterval(async () => {
      try {
        const validTime = Math.max(0, time);
        await saveTimeMutation.mutateAsync({ remainingTime: validTime });
      } catch (error) {
        console.error('Failed to save time in interval:', error);
      }
    }, 1000);

    return () => {
      clearInterval(saveInterval);
    };
  }, [time, saveTimeMutation]);

  const handleToggleTimer = useCallback(async () => {
    if (toggleTimerMutation.isLoading || saveTimeMutation.isLoading) {
      return;
    }

    const newActiveState = !isActive;
    setIsActive(newActiveState);

    try {
      await toggleTimerMutation.mutateAsync({ active: newActiveState });
    } catch (error) {
      console.error('Failed to handle timer toggle:', error);
      setIsActive(!newActiveState);
    }
  }, [isActive, toggleTimerMutation, saveTimeMutation]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => {
          const newTime = Math.max(0, prevTime - 1);
          if (newTime <= 0) {
            handleToggleTimer();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, time, handleToggleTimer]);

  return (
    <div className={css.timerContainer}>
      <div className={css.time}>
        <b>
          {t('avaiableTime')}: {formatTime(time)}
        </b>
      </div>
      <button
        type="button"
        className={css.toggleButton}
        onClick={handleToggleTimer}
        disabled={time <= 0}
      >
        {isActive ? t('stop') : t('start')}
      </button>
    </div>
  );
};
