import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Layer } from '../models/layer.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LayerService {
  constructor() {}

  getLayers(): Observable<Layer[]> {
    const sampleLayers = [
      {
        id: 'eUyUAXaGr6b',
        layer: 'boundary',
        hidden: false,
        opacity: 0.9,
        name: 'ANC IPT 2 Coverage',
        displayName: 'ANC IPT 2 Coverage',
        displaySettings: {
          labelFontColor: '#00007F',
          labelFontStyle: 'normal',
          labelFontSize: '11px',
          labelFontWeight: 'normal',
          labels: true,
          hideTitle: false,
          hideSubtitle: false
        },
        legendProperties: {
          method: 'equalInterval',
          colorHigh: '00ff00',
          colorLow: 'ff0000',
          colorScale: '#fff7bc,#fec44f,#d95f0e',
          classes: 3
        },
        layerOptions: {},
        dataSelections: {
          columns: [
            {
              dimension: 'dx',
              items: [
                {
                  id: 'c8fABiNpT0B',
                  name: 'ANC IPT 2 Coverage',
                  dimensionItemType: 'INDICATOR'
                }
              ]
            }
          ],
          filters: [
            {
              dimension: 'pe',
              items: [
                {
                  id: '2017',
                  name: '2017',
                  dimensionItemType: 'PERIOD'
                }
              ]
            }
          ],
          rows: [
            {
              dimension: 'ou',
              items: [
                {
                  id: 'ImspTQPwCqd',
                  name: 'Sierra Leone',
                  dimensionItemType: 'ORGANISATION_UNIT'
                },
                {
                  id: 'LEVEL-4'
                }
              ]
            }
          ],
          aggregationType: 'AGGREGATE'
        }
      }
    ];

    return of(sampleLayers);
  }
}
