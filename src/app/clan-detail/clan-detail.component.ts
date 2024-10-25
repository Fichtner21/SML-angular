import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlayersApiService } from '../services/players-api.service'; // Update according to your service path

@Component({
  selector: 'app-clan-detail',
  templateUrl: './clan-detail.component.html',
  styleUrls: ['./clan-detail.component.scss']
})
export class ClanDetailComponent implements OnInit {
  clan: any; // Define your clan model here
  clanName: string | null = null;

  constructor(private route: ActivatedRoute, private yourService: PlayersApiService) {}

  ngOnInit(): void {
    this.clanName = this.route.snapshot.paramMap.get('clan');
    this.fetchClanDetails(this.clanName);
  }

  fetchClanDetails(clanName: string | null): void {
    if (clanName) {
      this.yourService.getClanDetails(clanName).subscribe((data) => {
        this.clan = data;
      });
    }
  }
}

