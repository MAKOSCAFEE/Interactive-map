import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { reducers } from './store';

import * as fromServices from './services';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature('map', reducers)
  ],
  providers: [...fromServices.services],
  declarations: []
})

export class MapModule { }
