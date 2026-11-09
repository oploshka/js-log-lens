import LOG, { createLogger, logEvent } from '../../src/index';

const LOG_WS = createLogger(logEvent, { module: 'ws' });

LOG.emergency('Application unavailable');
LOG.alert('Immediate attention required');
LOG.critical('Critical operation failed', new Error('Timeout'));
LOG.error('Request failed');
LOG.warning('Slow response');
LOG.notice('State changed');
LOG.info('Application started');
LOG.debug('Debug state', { step: 2, isValid: false });
LOG_WS.debug('Message received', { eventId: '123' });
