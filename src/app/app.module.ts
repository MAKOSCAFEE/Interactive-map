import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { HttpClientModule } from '@angular/common/http';
import { MapModule } from './../map/map.module';

import * as fromServices from './services';

// not used in production
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';

// TODO: Figure out way to remove these and use only cli environment
const environment = {
  development: true,
  production: false,
};

export const metaReducers: MetaReducer<any>[] = !environment.production
  ? [storeFreeze]
  : [];

import { AppComponent } from './containers/app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    MapModule,
    StoreModule.forRoot({}, { metaReducers }),
    EffectsModule.forRoot([]),
    HttpClientModule,
    environment.development ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [fromServices.services],
  bootstrap: [AppComponent]
})
export class AppModule { }
