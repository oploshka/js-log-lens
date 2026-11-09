import LOG, { LogEvent, Log, LogLens, ConsoleModule, LogLevel } from '../../src/index';

LOG.emergency('Application unavailable');
LOG.alert('Immediate attention required');
LOG.critical('Critical operation failed', new Error('Timeout'));
LOG.error('Request failed');
LOG.warning('Slow response');
LOG.notice('State changed');
LOG.info('Application started');
LOG.debug('Debug state', { step: 2, isValid: false });

const event = new LogEvent();
const lens = new LogLens(event);
lens.modules.add('console', new ConsoleModule({ settings: { includeMeta: true } }));
const logger: Log = lens.build();
logger.debug('WebSocket message', { eventId: '123' });
lens.modules.disable('console');
logger.info('This is not printed');
lens.modules.enable('console');
lens.modules.get('console')?.mergeSettings({ includeMeta: false });
logger.info('Printed again', LogLevel.Info);
lens.modules.remove('console');
lens.dispose();
