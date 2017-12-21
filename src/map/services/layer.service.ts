import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Layer } from '../models/layer.model';

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

    return Observable.of(sampleLayer);
  }

}
