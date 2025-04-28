import { createContext, useContext } from 'react';
import { Loader } from '../components/Loader';
import { trpc } from './trpc';
import { MeType } from './trpcTypes';

export type AppContext = {
  me: MeType;
};

const AppReactContext = createContext<AppContext>({
  me: null,
});

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data, error, isLoading, isFetching, isError } = trpc.getMe.useQuery();
  return (
    <AppReactContext.Provider value={{ me: data?.me || null }}>
      {isLoading || isFetching ? (
        <Loader />
      ) : isError ? (
        <p>Error: {error.message}</p>
      ) : (
        children
      )}
    </AppReactContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppReactContext);
};

export const useMe = () => {
  const { me } = useAppContext();
  return me;
};
