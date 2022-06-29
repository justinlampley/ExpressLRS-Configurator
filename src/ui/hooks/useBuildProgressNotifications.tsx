import { useContext } from 'react';
import { BuildProgressNotificationsContext } from '../context/BuildProgressNotificationsProvider';

export default function useBuildProgressNotifications() {
  const context = useContext(BuildProgressNotificationsContext);
  if (context === undefined)
    throw new Error(`No provider for BuildProgressContext given`);

  const {
    buildProgressNotifications,
    lastBuildProgressNotification,
    resetBuildProgressNotifications,
  } = context;

  return {
    buildProgressNotifications,
    lastBuildProgressNotification,
    resetBuildProgressNotifications,
  };
}
