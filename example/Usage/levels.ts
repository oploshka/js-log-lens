import LOG, { LogEvent, Log, LogLens, ConsoleModule } from '../../src/index';

LOG.emergency('Application unavailable');
LOG.alert('Immediate attention required');
LOG.critical('Critical operation failed', new Error('Timeout'));
LOG.error('Request failed');
LOG.warning('Slow response');
LOG.notice('State changed');
LOG.info('Application started');
LOG.debug('Debug state', { step: 2, isValid: false });

// Custom assembly without an implicit console.
const event = new LogEvent();
const lens = new LogLens(event).use(new ConsoleModule({ includeMeta: true }));
const logger: Log = lens.build();
logger.debug('WebSocket message', { eventId: '123' });
lens.dispose();
