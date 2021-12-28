
// TODO the same. We need this?


// import { NgModule } from "@angular/core"
// import { RouterModule, Routes } from "@angular/router"
// import { PlayerViewComponent } from "./player-view/player-view.component"

// const routes: Routes = [
//   {
//     path: ':username',
//     component: PlayerViewComponent
//   }
// ]

// @NgModule({
//   imports: [RouterModule.forChild(routes)],
//   exports: [RouterModule],
// })

// export class Ranking {}

export const playerAttributesMapping = {
  playername: 'playername',
  username: 'username',
  ranking: 'ranking',
  percentil: 'percentile',
  place: 'place',
  warcount: 'warcount',
  nationality: 'nationality',
  clanhistory: 'clanhistory',
  cup1on1edition1: 'cup1on1edition1',
}

export interface Players {
  playername: string,
  username: string,
  ranking: string,
  percentil: string,
  place: string,
  warcount: string,
  nationality: string,
  clanhistory: string,
  cup1on1edition1: string,
}