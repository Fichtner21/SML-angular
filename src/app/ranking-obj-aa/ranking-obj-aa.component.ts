import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PlayersApiService } from 'src/app/services/players-api.service';

@Component({
  selector: 'app-ranking-obj-aa',
  templateUrl: './ranking-obj-aa.component.html',
  styleUrls: ['./ranking-obj-aa.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class RankingObjAaComponent implements OnInit {
  showMore: boolean = localStorage.getItem('showMoreData') === 'true';

  playersAA$: Observable<any[]> = this.playersApiService.getPlayersFinal('Players_AA').pipe(
    map(players =>      
       players.filter(player => player.active === 'TRUE')       
       ),
       tap(players => console.log('players', players)),
    catchError(error => {
      console.error('Error loading players:', error);
      return of([]);
    })
  );

  displayedColumns: string[] = ['place', 'playername', 'nationality', 'ranking', 's8wars', 's8fpw', 'lastwar', 'last30_365_days'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private playersApiService: PlayersApiService) {}

  ngOnInit(): void {
    this.updateDataSource();
  }

  toggleShowMore(): void {
    this.showMore = !this.showMore;
    localStorage.setItem('showMoreData', this.showMore.toString());

    if (this.showMore) {
      // Dodanie kolumny "Total Wars"
      this.displayedColumns.splice(5, 0, 'totalwars');
      this.displayedColumns.splice(7, 0, 'fpw');
    } else {
      // Usunięcie kolumny "Total Wars"
      this.displayedColumns = this.displayedColumns.filter(col => col !== 'totalwars');
      this.displayedColumns = this.displayedColumns.filter(col => col !== 'fpw');
    }

    this.updateDataSource();
  }

  private updateDataSource(): void {
    this.playersAA$.subscribe(players => {
      this.dataSource.data = players;
      this.dataSource.sort = this.sort!;
      this.dataSource.paginator = this.paginator!;
    });
  }

  getActivityColor(activity: number): string {
    if (activity == 0) {
      return '#003200';
    } else if (activity >= 1 && activity <= 5) {
      return '#050';
    } else if (activity >= 6 && activity <= 10) {
      return '#00a100';
    } else if (activity >= 11 && activity <= 20) {
      return '#8aff1a';
    } else if (activity >= 21 && activity <= 40) {
      return '#ffff00';
    } else if (activity >= 41 && activity <= 60) {
      return 'orange';
    } else if (activity >= 61 && activity <= 90) {
      return '#ff4500';
    } else {
      return '#003200';
    }
  }

  getActivityGradient(activity: number): string {
    let percentage = 0;
    if (activity >= 1 && activity <= 5) {
      percentage = ((activity - 1) / 5) * 100;
    } else if (activity >= 6 && activity <= 10) {
      percentage = ((activity - 6) / 5) * 100;
    } else if (activity >= 11 && activity <= 20) {
      percentage = ((activity - 11) / 10) * 100;
    } else if (activity >= 21 && activity <= 40) {
      percentage = ((activity - 21) / 20) * 100;
    } else if (activity >= 41 && activity <= 60) {
      percentage = ((activity - 41) / 20) * 100;
    } else if (activity >= 61 && activity <= 90) {
      percentage = ((activity - 61) / 30) * 100;
    } else if (activity > 90) {
      percentage = 100;
    }
    const color = this.getActivityColor(activity);
    return `linear-gradient(to top, ${color} ${percentage}%, gray ${percentage}%)`;
  } 

  onOverlayClosed(): void {
    console.log('Overlay closed');
  }
}
