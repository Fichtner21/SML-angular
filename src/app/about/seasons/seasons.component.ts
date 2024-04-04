import { Component, OnInit } from '@angular/core';
import { faMedal } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.scss']
})
export class SeasonsComponent implements OnInit {
  medal = faMedal;

  constructor() { }

  ngOnInit(): void {
  }

}
