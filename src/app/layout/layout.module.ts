import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

import { FooterComponent } from '@shared/components/footer/footer.component';
import { PageNotFoundComponent } from '@shared/components/page-not-found/page-not-found.component';
import { LayoutComponent } from './layout.component';

import { ServiceProviderModule } from '../core/service-providers/service-provider.module';
import { LayoutRoutingModule } from './layout-routing.module';
import { I18nService } from '@core/i18n/i18n.service';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ApiService } from '@shared/services/api/api.service';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [LayoutComponent, FooterComponent, PageNotFoundComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    LayoutRoutingModule,
    ServiceProviderModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
      defaultLanguage: 'es',
    }),
  ],
  providers: [ApiService, I18nService, provideHttpClient(withFetch())],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [LayoutComponent],
})
export class LayoutModule {}
