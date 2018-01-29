import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as fromServices from '../services';
import { visualizationObject } from '../data/sample';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  public selectedOption: any;
  public showFavList: boolean = false;
  public favorites: any = [];
  public searchOptions = [];
  public favForm: FormGroup;
  public visualizationObj: any = visualizationObject;
  public visualObject: any = {
    id: 'UjHKZ2lZJ3T',
    latitude: '6.489301',
    longitude: '21.885109',
    name: 'initialMap',
    basemap: 'osmLight',
    zoom: 4,
    mapViews: []
  };
  public isLoaded = false;

  constructor(
    private favoriteService: fromServices.FavouriteService,
    private mapService: fromServices.MapsService,
    public fb: FormBuilder
  ) {}

  ngOnInit() {
    this.favForm = this.fb.group({
      querystring: ['']
    });
    this.getAllFav();
    this.onChangeMap();
  }

  onChangeMap(): void {
    // ... do other stuff here ...
    this.favForm.valueChanges.subscribe(val => {
      if (val.querystring) {
        this.isLoaded = false;
        this.mapService.searchFavourite(val.querystring).subscribe(data => {
          this.favorites = data['maps'];
          this.isLoaded = true;
        });
      }
    });
  }

  getAllFav() {
    this.favoriteService.getFavourite().subscribe(data => {
      this.isLoaded = true;
      this.favorites = data['maps'];
    });
  }

  getMapFav(mapId) {
    this.mapService.getMapFromFav(mapId).subscribe(data => {
      this.visualObject = data;
      this.isLoaded = true;
    });
  }

  toggleFavSelection(event) {
    event.stopPropagation();
    this.showFavList = !this.showFavList;
  }

  setSelectedFav(fav, event) {
    event.stopPropagation();
    this.selectedOption = fav;
    this.getMapFav(fav.id);
    this.showFavList = !this.showFavList;
  }
}
