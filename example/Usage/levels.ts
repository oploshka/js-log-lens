import LOG, { LogAdapter, LogEvent, LogLens, ConsoleModule, LogLevel } from '../../src/index';

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
const consoleModule = new ConsoleModule({ settings: { includeMeta: true } });
lens.modules.add('console', consoleModule);
const logger: LogAdapter = lens.build();

const ws = logger.child('WebSocket', { module: 'ws' });
const connection = ws.child('Connection', { connectionId: '123' });
connection.debug('Connected');
connection.meta({ requestId: 42 }).info('Message received', { id: 123 });

lens.modules.disable('console');
logger.info('This is not printed');
lens.modules.enable('console');
consoleModule.mergeSettings({ includeMeta: false });
logger.info('Printed again', LogLevel.Info);
lens.modules.remove('console');
lens.dispose();
