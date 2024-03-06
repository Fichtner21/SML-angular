import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { PlayersApiService } from 'src/app/services/players-api.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit {
  public movies$: Observable<any[]>;
  filteredMovies$: Observable<any[]>;
  searchTerm = new FormControl('');

  constructor(private googleApi: PlayersApiService) { }

  ngOnInit(): void {
    this.movies$ = this.googleApi.getPlayers('Movies').pipe(
      map((response: any) => {
        let batchRowValues = response.values;
        let movies: any[] = [];
        for(let i = 1; i < batchRowValues.length; i++){
          const movie: any = {};
          for(let j = 0; j < batchRowValues[i].length; j++){
            if (batchRowValues[0][j] === 'players') {
              const playersArray = batchRowValues[i][j].split(', ').map((playername: string) => {
                return { username: playername };
              });
              movie['players'] = playersArray;
            } else {
              movie[batchRowValues[0][j]] = batchRowValues[i][j];
            }
          }
          movies.push(movie);
        }
        return movies;
      }),
      switchMap(movies => {
        return this.googleApi.listPlayers().pipe(
          map((listPlayers: any[]) => {
            return movies.map(movie => {
              if (movie.players && Array.isArray(movie.players)) {
                movie.players.forEach(player => {
                  const matchedPlayer = listPlayers.find(p => p.username === player.username);
                  if (matchedPlayer) {
                    player.playername = matchedPlayer.playername;
                    player.nationality = matchedPlayer.nationality;
                  }
                });
              }
              console.log('movie', movie)
              return movie;
            });
          })
        );
      })
    );
    this.filteredMovies$ = this.searchTerm.valueChanges.pipe(
      startWith(''),
      switchMap(value => this.filterMovies(value))
    );
  }

  getThumbnailUrl(youtubeId: string): string {
    // return `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
    return 'https://img.youtube.com/vi/' + youtubeId + '/hqdefault.jpg';
  }

  filterMovies(value: string): Observable<any[]> {
    const filterValue = value.toLowerCase();
    return this.movies$.pipe(
      map(movies => movies.filter(movie =>
        (movie.players && Array.isArray(movie.players) && movie.players.some((player: any) => player.username.toLowerCase().includes(filterValue))) ||
        (movie.desc && movie.desc.toLowerCase().includes(filterValue))
      ))
    );
  }

  loadVideo(youtubeId: string): void {
    // Obsługa ładowania filmu z YouTube po kliknięciu
  }

  onPlayerReady(event: any) {
    event.target.playVideo();
  }
}
