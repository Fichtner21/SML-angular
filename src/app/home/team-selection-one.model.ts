export class TeamSelectionOne {
}

export const IdOneAttributesMapping = {
  id: 'id',
  Team1Players: 'Team1Players',
  ELO1: 'ELO1',
  Team2Players: 'Team2Players',
  ELO2: 'ELO2',
  // team1players: {
  //   name: 'team1players',
  //   elo: 'elo',
  // }
  // ,
  // team2players: {
  //   name: 'team2players',
  //   elo2: '_elo',
  // }
}

export const IdTwoAttributesMapping = {
  team2players: {
    name: 'team2players',
    elo: 'elo',
  }
}

export interface idOne { 
  id: any; 
  Team1Players: any;
  ELO1: any;
  Team2Players: any;
  ELO2: any;
}

export interface idTwo {
  team2players: string;
  elo: Number;
}