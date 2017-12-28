import {Component, Input, OnInit, ViewChild} from '@angular/core';
import * as fromServices  from '../services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
   title = 'app';
   public visualObject: any;
   public isLoaded: boolean = false;

    constructor(private favoriteService: fromServices.FavouriteService, private mapService: fromServices.MapsService) {
    }

    ngOnInit() {
      this.mapService.getMapFromFav().subscribe(data =>  {
        this.visualObject = data;
        this.isLoaded = true;
      })
    }

}
