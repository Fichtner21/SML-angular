import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tt-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss']
})
export class MatchComponent implements OnInit {
  @Input() match: any;

  constructor() { }

  ngOnInit(): void {
  }

}
