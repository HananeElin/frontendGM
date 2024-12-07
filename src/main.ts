import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { provideNzIcons } from 'ng-zorro-antd/icon';

bootstrapApplication(AppComponent,{ providers: [provideHttpClient()] })
  .catch((err) => console.error(err));
