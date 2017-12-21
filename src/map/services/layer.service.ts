import { Injectable } from '@angular/core';
import { of } from 'rxjs/observable/of';
import { Layer } from '../models/layer.model';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LayerService {

  constructor() { }

  getLayers(): Observable<Layer[]> {

    const sampleLayer = [{
      action: 'drawMap',
      layer: {
        name: 'themantic1',
        id: 'yKdal90kK',
        user: {
          id: 'dakIkak90'
        }
      }
    }];

    return of(sampleLayer);
  }

}
