import { Component, OnInit } from '@angular/core';
import { InactiveObjService } from './inactive-obj.service';
import { InactivePlayers } from './inactive.model';
import { Observable } from 'rxjs';
import { Spinkit } from 'ng-http-loader';

@Component({
  selector: 'app-inactive-obj',
  templateUrl: './inactive-obj.component.html',
  styleUrls: ['./inactive-obj.component.scss']
})
export class InactiveObjComponent implements OnInit {
  public spinkit = Spinkit;
  players$: Observable<InactivePlayers[]>;

  constructor(private inactiveObjService: InactiveObjService) { }

  ngOnInit(): void {
    this.players$ = this.inactiveObjService.fetchInactivePlayers();
  }

}
