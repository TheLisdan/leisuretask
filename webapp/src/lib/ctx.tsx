import { createContext, useContext } from 'react';
import { trpc } from './trpc';
import { TrpcRouterOutputs } from './trpcTypes';

export type AppContext = {
  me: TrpcRouterOutputs['getMe']['me'];
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
        <p>Loading...</p>
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
