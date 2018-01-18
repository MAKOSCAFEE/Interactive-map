import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconLayers, IconMap, IconPlus, IconMinus, IconHome } from 'angular-feather';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';
// containers
import * as fromContainers from './containers';
// components
import * as fromComponents from './components';

import * as fromServices from './services';

@NgModule({
  imports: [
    IconLayers,
    IconMap,
    IconPlus,
    IconMinus,
    IconHome,
    CommonModule,
    StoreModule.forFeature('map', reducers),
    EffectsModule.forFeature(effects)
  ],
  providers: [...fromServices.services],
  declarations: [...fromContainers.containers, ...fromComponents.components],
  exports: [...fromContainers.containers, ...fromComponents.components]
})
export class MapModule {}
