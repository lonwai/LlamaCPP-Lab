import { useState, useEffect, useCallback, useRef } from 'react';
import { checkModelStatus, type ModelStatus } from '../api/llamaApi';

const CHECK_INTERVAL = 10000;

const initialStatus: ModelStatus = {
  online: false,
  loading: false,
  error: '正在检测...',
};

export function useModelStatus() {
  const [status, setStatus] = useState<ModelStatus>(initialStatus);
  const [checking, setChecking] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const check = useCallback(async () => {
    setChecking(true);
    const result = await checkModelStatus();
    setStatus(result);
    setChecking(false);
  }, []);

  useEffect(() => {
    check();
    intervalRef.current = setInterval(check, CHECK_INTERVAL);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [check]);

  return { status, checking, refresh: check };
}
