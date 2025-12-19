import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import zh from '@angular/common/locales/zh';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { loadTheme } from '@utl/loadCss';
import { provideNzI18n, zh_CN } from 'ng-zorro-antd/i18n';
import { routes } from './app.routes';

registerLocaleData(zh);

loadTheme('light', true);

// const HttpLoaderFactory = (http: HttpClient): TranslateHttpLoader => {
//   const loader = new TranslateHttpLoader(http, './assets/i18n/', '.json');
//   return loader;
// };

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideNzI18n(zh_CN),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
        // enforceLoading: true,
        // useHttpBackend: true,
      }),
      fallbackLang: 'zh-CN',
    }),
  ],
};
