import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PlayersApiService } from '../services/players-api.service';

@Component({
  selector: 'app-clan-matches-list',
  templateUrl: './clan-matches-list.component.html',
  styleUrls: ['./clan-matches-list.component.scss']
})
export class ClanMatchesListComponent implements OnInit {

  matches: any[] = [];
  paginatedMatches: any[] = [];
  currentPage: number = 0;
  pageSize: number = 20;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private playersApiService: PlayersApiService) { }

  ngOnInit(): void {
    this.playersApiService.getMatchHistoryClans2().subscribe(matches => {
      // Sort matches by timestamp descending to show the newest match first
      console.log('matches', matches)
      this.matches = matches.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      this.updatePaginatedMatches();
    });
  }

  updatePaginatedMatches() {
    const startIndex = this.currentPage * this.pageSize;
    this.paginatedMatches = this.matches.slice(startIndex, startIndex + this.pageSize);
  }

  changePage(event: any) {
    this.currentPage = event.pageIndex;
    this.updatePaginatedMatches();
  }
}
