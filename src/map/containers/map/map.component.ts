import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromStore from '../../store';
import { Layer } from '../../models/layer.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  public layers$: Observable<Layer[]>;
  constructor(private store: Store<fromStore.MapState>) { }

  ngOnInit() {
    this.layers$ = this.store.select(fromStore.getAllLayers);
    this.store.dispatch(new fromStore.LoadLayers());
  }

}
