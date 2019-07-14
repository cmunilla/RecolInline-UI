import { enableProdMode , Type} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { ServiceModule } from './app/@recolinline-service/service';
import { GenericModule } from './app/@recolinline-generic/generic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));