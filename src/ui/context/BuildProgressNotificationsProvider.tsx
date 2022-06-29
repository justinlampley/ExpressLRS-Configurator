import React, { FunctionComponent, useMemo, useRef, useState } from 'react';
import {
  BuildProgressNotification,
  useBuildProgressNotificationsSubscription,
} from '../gql/generated/types';
import client from '../gql';

export const BuildProgressNotificationsContext = React.createContext<{
  buildProgressNotifications: BuildProgressNotification[];
  lastBuildProgressNotification: BuildProgressNotification | null;
  resetBuildProgressNotifications: () => void;
}>({
  buildProgressNotifications: [],
  lastBuildProgressNotification: null,
  resetBuildProgressNotifications: () => {},
});

interface BuildProgressProviderContextProps {
  children?: React.ReactNode;
}

const BuildProgressNotificationsProvider: FunctionComponent<
  BuildProgressProviderContextProps
> = ({ children }) => {
  const [buildProgressNotifications, setBuildProgressNotifications] = useState<
    BuildProgressNotification[]
  >([]);
  const buildProgressNotificationsRef = useRef<BuildProgressNotification[]>([]);
  const [lastBuildProgressNotification, setLastBuildProgressNotification] =
    useState<BuildProgressNotification | null>(null);

  useBuildProgressNotificationsSubscription({
    client,
    onSubscriptionData: (options) => {
      const args = options.subscriptionData.data?.buildProgressNotifications;
      if (args !== undefined) {
        const newNotificationsList = [
          ...buildProgressNotificationsRef.current,
          args,
        ];
        buildProgressNotificationsRef.current = newNotificationsList;
        setBuildProgressNotifications(newNotificationsList);
        setLastBuildProgressNotification(args);
      }
    },
  });

  const resetBuildProgressNotifications = () => {
    buildProgressNotificationsRef.current = [];
    setBuildProgressNotifications([]);
    setLastBuildProgressNotification(null);
  };

  const value = useMemo(
    () => ({
      buildProgressNotifications,
      lastBuildProgressNotification,
      resetBuildProgressNotifications,
    }),
    [lastBuildProgressNotification, buildProgressNotifications]
  );
  return (
    <BuildProgressNotificationsContext.Provider value={value}>
      {children}
    </BuildProgressNotificationsContext.Provider>
  );
};

export default BuildProgressNotificationsProvider;
