import mixpanel from 'mixpanel-browser';
import { useEffect } from 'react';
import { useMe } from './ctx';
import { env } from './env';
import { TaskType, TrpcRouterOutputs } from './trpcTypes';

if (env.VITE_MIXPANEL_API_KEY) {
  mixpanel.init(env.VITE_MIXPANEL_API_KEY);
}

const whenEnabled = <T,>(fn: T): T => {
  return env.VITE_MIXPANEL_API_KEY ? fn : ((() => {}) as T);
};

export const mixpanelIdentify = whenEnabled((userId: string) => {
  mixpanel.identify(userId);
});

export const mixpanelAlias = whenEnabled((userId: string) => {
  mixpanel.alias(userId);
});

export const mixpanelReset = whenEnabled(() => {
  mixpanel.reset();
});

export const mixpanelPeopleSet = whenEnabled(
  (me: NonNullable<TrpcRouterOutputs['getMe']['me']>) => {
    mixpanel.people.set({
      $email: me.email,
      nick: me.name,
    });
  }
);

export const mixpanelTrackSignUp = whenEnabled(() => {
  mixpanel.track('Sign Up');
});

export const mixpanelTrackSignIn = whenEnabled(() => {
  mixpanel.track('Sign In');
});

export const mixpanelCompleteTask = whenEnabled((task: TaskType) => {
  mixpanel.track('Complete Task', { taskId: task.id });
});

export const MixpanelUser = () => {
  const me = useMe();
  useEffect(() => {
    if (me) {
      mixpanelPeopleSet(me);
    } else {
      mixpanelReset();
    }
  }, [me]);
  return null;
};
