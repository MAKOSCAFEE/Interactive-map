import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';


@Injectable()
export class FavouriteService {

  constructor(private http: HttpClient) {}

  getFavourite(): Observable<any[]> {
    return this.http
      .get<any[]>(`../../../api/maps.json?fields=id,displayName~rename(name),access&_dc=1514366772136&pageSize=8&page=1&start=0&limit=8`)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

}
