import { ConsoleModule, LogLens } from 'js-log-lens';

/**
 * Example application integration.
 * The project owns the logger lifecycle and decides which modules to enable.
 */
export function setupLogger() {
  const lens = new LogLens();
  lens.modules.add('console', new ConsoleModule());

  return {
    lens: lens,
    log: lens.build(),
  };
}
