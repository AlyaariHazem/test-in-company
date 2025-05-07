import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { TokenInterceptor } from './login/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
  provideAnimationsAsync(),
  provideHttpClient(),

  providePrimeNG({
    theme: {
      preset: Aura
    }
  }),
  provideToastr({
    timeOut: 5000,
  }),
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ]
};
