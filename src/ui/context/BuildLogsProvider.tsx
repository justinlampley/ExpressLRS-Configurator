import React, {
  FunctionComponent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useBuildLogUpdatesSubscription } from '../gql/generated/types';
import client from '../gql';
import EventsBatcher from '../library/EventsBatcher';

export const BuildLogsContext = React.createContext<{
  buildLogs: string;
  resetBuildLogs: () => void;
}>({
  buildLogs: '',
  resetBuildLogs: () => {},
});

interface BuildLogsProviderContextProps {
  children?: React.ReactNode;
}

const BuildLogsProvider: FunctionComponent<BuildLogsProviderContextProps> = ({
  children,
}) => {
  /*
    We batch log events in order to save React.js state updates and rendering performance.
   */
  const [buildLogs, setLogs] = useState<string>('');
  const logsRef = useRef<string[]>([]);
  const eventsBatcherRef = useRef<EventsBatcher<string> | null>(null);
  useEffect(() => {
    eventsBatcherRef.current = new EventsBatcher<string>(200);
    eventsBatcherRef.current.onBatch((newLogs) => {
      const newLogsList = [...logsRef.current, ...newLogs];
      logsRef.current = newLogsList;
      setLogs(newLogsList.join(''));
    });
  }, []);
  useBuildLogUpdatesSubscription({
    fetchPolicy: 'network-only',
    client,
    onSubscriptionData: (options) => {
      const args = options.subscriptionData.data?.buildLogUpdates.data;
      if (args !== undefined && eventsBatcherRef.current !== null) {
        eventsBatcherRef.current.enqueue(args);
      }
    },
  });

  const resetBuildLogs = () => {
    logsRef.current = [];
    setLogs('');
  };

  const value = useMemo(
    () => ({
      buildLogs,
      resetBuildLogs,
    }),
    [buildLogs]
  );
  return (
    <BuildLogsContext.Provider value={value}>
      {children}
    </BuildLogsContext.Provider>
  );
};

export default BuildLogsProvider;
