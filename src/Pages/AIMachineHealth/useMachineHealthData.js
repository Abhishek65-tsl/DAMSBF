import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchMachineHealthBundle } from '../../Services/AIMachineHealth/machineHealthService';

const REFRESH_MS = 5000;

const initialState = {
  loading: true,
  error: null,
  data: null,
  isEmpty: false
};

export function useMachineHealthData() {
  const [state, setState] = useState(initialState);

  const loadData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: prev.data === null, error: null }));
    try {
      const data = await fetchMachineHealthBundle({ historyLength: 36, intervalMs: REFRESH_MS });
      setState({ loading: false, error: null, data, isEmpty: !data?.sensorSeries?.length });
    } catch (error) {
      setState({ loading: false, error: error.message || 'Failed to load machine health data.', data: null, isEmpty: false });
    }
  }, []);

  useEffect(() => {
    loadData();
    const timer = setInterval(loadData, REFRESH_MS);
    return () => clearInterval(timer);
  }, [loadData]);

  const lastUpdatedLabel = useMemo(() => {
    if (!state.data?.lastUpdated) return '-';
    return new Date(state.data.lastUpdated).toLocaleString();
  }, [state.data?.lastUpdated]);

  return {
    ...state,
    reload: loadData,
    refreshMs: REFRESH_MS,
    lastUpdatedLabel
  };
}
