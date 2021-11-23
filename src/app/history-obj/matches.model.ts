import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
// import { HistoryObjComponent } from "./history-obj.component"
import { SingleMatchComponent } from "./single-match/single-match.component"

const routes: Routes = [
  // {
  //   path: '',
  //   component: HistoryObjComponent,
  //   children: [
      {
        path: ':id',
        component: SingleMatchComponent
      },
    // ],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class MatchesRoutingModule {}

export const matchesAttributesMapping = {
  Timestamp: 'timestamp',
  idwar: 'idwar',
  t1roundswon: 't1roundswon',
  t2roundswon: 't2roundswon',  
  t1p1name: 't1p1name',
  t1p1preelo: 't1p1preelo',
  t1p1score: 't1p1score',
  t1p1postelo: 't1p1postelo',
  t1p2name: 't1p2name',
  t1p2preelo: 't1p2preelo',
  t1p2score: 't1p2score',
  t1p2postelo: 't1p2postelo',
  t1p3name: 't1p3name',
  t1p3preelo: 't1p3preelo',
  t1p3score: 't1p3score',
  t1p3postelo: 't1p3postelo',
  t1p4name: 't1p4name',
  t1p4preelo: 't1p4preelo',
  t1p4score: 't1p4score',
  t1p4postelo: 't1p4postelo',
  t1p5name: 't1p5name',
  t1p5preelo: 't1p5preelo',
  t1p5score: 't1p5score',
  t1p5postelo: 't1p5postelo',
  t1p6name: 't1p6name',
  t1p6preelo: 't1p6preelo',
  t1p6score: 't1p6score',
  t1p6postelo: 't1p6postelo',
  t1p7name: 't1p7name',
  t1p7preelo: 't1p7preelo',
  t1p7score: 't1p7score',
  t1p7postelo: 't1p7postelo',
  t2p1name: 't2p1name',
  t2p1preelo: 't2p1preelo',
  t2p1score: 't2p1score',
  t2p1postelo: 't2p1postelo',
  t2p2name: 't2p2name',
  t2p2preelo: 't2p2preelo',
  t2p2score: 't2p2score',
  t2p2postelo: 't2p2postelo',
  t2p3name: 't2p3name',
  t2p3preelo: 't2p3preelo',
  t2p3score: 't2p3score',
  t2p3postelo: 't2p3postelo',
  t2p4name: 't2p4name',
  t2p4preelo: 't2p4preelo',
  t2p4score: 't2p4score',
  t2p4postelo: 't2p4postelo',
  t2p5name: 't2p5name',
  t2p5preelo: 't2p5preelo',
  t2p5score: 't2p5score',
  t2p5postelo: 't2p5postelo',
  t2p6name: 't2p6name',
  t2p6preelo: 't2p6preelo',
  t2p6score: 't2p6score',
  t2p6postelo: 't2p6postelo',
  t2p7name: 't2p7name',
  t2p7preelo: 't2p7preelo',
  t2p7score: 't2p7score',
  t2p7postelo: 't2p7postelo'
}

export interface Matches {
  timestamp: string,
  idwar: string,
  t1roundswon: string,
  t2roundswon: string, 
  t1p1name: string,
  t1p1preelo: string,
  t1p1score: string,
  t1p1postelo: string,
  t1p2name: string,
  t1p2preelo: string,
  t1p2score: string,
  t1p2postelo: string,
  t1p3name: string,
  t1p3preelo: string,
  t1p3score: string,
  t1p3postelo: string,
  t1p4name: string,
  t1p4preelo: string,
  t1p4score: string,
  t1p4postelo: string,
  t1p5name: string,
  t1p5preelo: string,
  t1p5score: string,
  t1p5postelo: string,
  t1p6name: string,
  t1p6preelo: string,
  t1p6score: string,
  t1p6postelo: string,
  t1p7name: string,
  t1p7preelo: string,
  t1p7score: string,
  t1p7postelo: string,
  t2p1name: string,
  t2p1preelo: string,
  t2p1score: string,
  t2p1postelo: string,
  t2p2name: string,
  t2p2preelo: string,
  t2p2score: string,
  t2p2postelo: string,
  t2p3name: string,
  t2p3preelo: string,
  t2p3score: string,
  t2p3postelo: string,
  t2p4name: string,
  t2p4preelo: string,
  t2p4score: string,
  t2p4postelo: string,
  t2p5name: string,
  t2p5preelo: string,
  t2p5score: string,
  t2p5postelo: string,
  t2p6name: string,
  t2p6preelo: string,
  t2p6score: string,
  t2p6postelo: string,
  t2p7name: string,
  t2p7preelo: string,
  t2p7score: string,
  t2p7postelo: string,
}


