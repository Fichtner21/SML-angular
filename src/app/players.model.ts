export const playerAttributesMapping = {
  playerName: 'Player Name',
  userName: 'User Name',
  ranking: 'Ranking',
  percentile: 'Percentile',
  place: 'Place',
  warCount: 'War Count',
  nationality: 'Nationality'
}

export interface Players {
  playerName: string,
  userName: string,
  ranking: Number,
  percentile: Number,
  place: Number,
  warCount: Number,
  nationality: string,
}