import { useState, useEffect, useCallback } from 'react';
import { WebContainer } from '@webcontainer/api';

export function useWebContainer() {
  const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);

  const initWebContainer = useCallback(async () => {
    try {
      const instance = await WebContainer.boot();
      setWebcontainer(instance);
    } catch (error) {
      console.error('Failed to initialize WebContainer:', error);
    }
  }, []);

  const restartWebContainer = useCallback(async () => {
    if (webcontainer) {
      await webcontainer.teardown();
    }

    await initWebContainer();
  }, [webcontainer, initWebContainer]);

  useEffect(() => {
    initWebContainer();

    return () => {
      if (webcontainer) {
        webcontainer.teardown();
      }
    };
  }, []);

  return { webcontainer, restartWebContainer };
}
