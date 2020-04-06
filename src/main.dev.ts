import { enableProdMode , Type} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppMockModule } from '../mock/app.mock.module';
import { environment } from './environments/environment';

platformBrowserDynamic().bootstrapModule(AppMockModule).catch(err => console.error(err));