import type { iLogger } from '../../src/Type/Log';

/** Опциональный перехват ошибок браузера с возможностью отписаться. */
export function initGlobalErrorCatching(logger: iLogger): () => void {
  if (typeof window === 'undefined') return () => {};

  const onError = (event: ErrorEvent): void => {
    if (event.error) logger.error(`Глобальный перехват ошибки: ${event.message}`, event.error);
  };
  const onRejection = (event: PromiseRejectionEvent): void => {
    const reason: unknown = event.reason;
    const message = reason instanceof Error ? reason.message : String(reason);
    logger.error(`Неотловленный Promise rejection: ${message}`, reason);
  };

  window.addEventListener('error', onError);
  window.addEventListener('unhandledrejection', onRejection);
  return () => {
    window.removeEventListener('error', onError);
    window.removeEventListener('unhandledrejection', onRejection);
  };
}
