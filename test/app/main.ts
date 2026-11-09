import { createApp, shallowRef } from 'vue';
import type { sLogStructure } from 'js-log-lens';
import { setupLogger } from '@example/Install/SetupLogger';
import { AppLogKey } from '@app/LogContext';
import { PageLogModule } from '@app/Module/PageLog';
import App from '@app/App.vue';
import '@app/Style/App.css';

const { lens, log } = setupLogger();
const entries = shallowRef<readonly sLogStructure[]>([]);

const pageModule = new PageLogModule({
  dependencies: {
    onEntriesChange: (nextEntries) => {
      entries.value = nextEntries;
    },
  },
  settings: { maxEntries: 100 },
});

lens.modules.add('page', pageModule);

const app = createApp(App);
app.provide(AppLogKey, { lens, log, entries, pageModule });
app.mount('#app');
