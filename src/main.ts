import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { LayoutModule } from './app/layout/layout.module';

platformBrowserDynamic()
  .bootstrapModule(LayoutModule)
  .catch(() => {});
