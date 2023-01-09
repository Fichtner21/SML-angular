import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { InactiveViewComponent } from "./inactive-view/inactive-view.component"

const routes: Routes = [
  {
    path: ':username',
    component: InactiveViewComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class Inactive {}

export const inactivePlayerAttributesMapping = {
  playername: 'playername',
  username: 'username',
  ranking: 'ranking',
  percentil: 'percentile',
  place: 'place',
  warcount: 'warcount',
  nationality: 'nationality',
  clanhistory: 'clanhistory',
  due: 'due',
  lastwar: 'lastwar',
  fpw: 'fpw',
  fpwmax: 'fpwmax',
  fpwmin: 'fpwmin'
}

export interface InactivePlayers {
  playername: string,
  username: string,
  ranking: string,
  percentil: string,
  place: string,
  warcount: string,
  nationality: string,
  clanhistory: string,
  due: string,
  lastwar: string,
  fpw: string,
  fpwmax: string,
  fpwmin: string
}