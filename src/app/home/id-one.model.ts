export const IdOneAttributesMapping = {
  team1players: {
    name: 'team1players',
    elo: 'elo',
  }
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
  team1players: string;
  elo: Number;
  // team2players: string;
  // _elo: Number;
}

export interface idTwo {
  team2players: string;
  elo: Number;
}