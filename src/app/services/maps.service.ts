import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';
import 'rxjs/add/observable/throw';

@Injectable()
export class MapsService {
  constructor(private http: HttpClient) {}

  getMapFromFav(favId): Observable<any> {
    return this.http
      .get<any>(
        `../../../api/maps/${favId}.json?fields=id,user,displayName~rename(name),
        longitude,latitude,zoom,basemap,mapViews%5B*,columns%5Bdimension,filter,
        items%5BdimensionItem~rename(id),dimensionItemType,displayName~rename(name)%5D%5D,
        rows%5Bdimension,filter,items%5BdimensionItem~rename(id),dimensionItemType,
        displayName~rename(name)%5D%5D,filters%5Bdimension,filter,
        items%5BdimensionItem~rename(id),dimensionItemType,
        displayName~rename(name)%5D%5D,dataDimensionItems,
        program%5Bid,displayName~rename(name)%5D,programStage%5Bid,
        displayName~rename(name)%5D,legendSet%5Bid,displayName~rename(name)%5D,
        !lastUpdated,!href,!created,!publicAccess,!rewindRelativePeriods,
        !userOrganisationUnit,!userOrganisationUnitChildren,!userOrganisationUnitGrandChildren,
        !externalAccess,!access,!relativePeriods,!columnDimensions,!rowDimensions,!filterDimensions,
        !user,!organisationUnitGroups,!itemOrganisationUnitGroups,!userGroupAccesses,!indicators,
        !dataElements,!dataElementOperands,!dataElementGroups,!dataSets,!periods,
        !organisationUnitLevels,!organisationUnits,!sortOrder,!topLimit%5D&_dc=1514366821016`
      )
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  searchFavourite(name): Observable<any[]> {
    return this.http
      .get<any[]>(
        `../../../api/maps.json?fields=id,displayName~rename(name)&filter=displayName:ilike:${name}&_dc=1514366772136&pageSize=8&page=1&start=0&limit=8`
      )
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }
}
