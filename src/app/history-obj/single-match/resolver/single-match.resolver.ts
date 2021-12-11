import { switchMap, take } from 'rxjs/operators';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { FetchMatchesService } from "../../fetch-matches.service";
import { Matches } from "../../matches.model";
import { Observable } from 'rxjs';

@Injectable()
export class SingleMatchResolve implements Resolve<Observable<Matches>> {
    constructor(private fetchMatchesService: FetchMatchesService) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.fetchMatchesService.matches$.pipe(
            take(1),
            switchMap((matches: Matches[]) => {
                return (matches.length > 0) ? this.fetchMatchesService.getSingleMatch(route.params['idwar']).pipe(take(1)) : this.fetchMatchesAndGetSingleMatch(route.params['idwar']);
            })
        );
    }


    private fetchMatchesAndGetSingleMatch(idwar: string): Observable<Matches> {
        return this.fetchMatchesService.fetchMatches().pipe(
            switchMap(() => this.fetchMatchesService.getSingleMatch(idwar).pipe(take(1)))
        )
    }
}