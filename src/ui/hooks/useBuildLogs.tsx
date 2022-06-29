import { useContext } from 'react';
import { BuildLogsContext } from '../context/BuildLogsProvider';

export default function useBuildLogs() {
  const context = useContext(BuildLogsContext);
  if (context === undefined)
    throw new Error(`No provider for BuildLogsContext given`);

  const { buildLogs, resetBuildLogs } = context;

  return {
    buildLogs,
    resetBuildLogs,
  };
}
