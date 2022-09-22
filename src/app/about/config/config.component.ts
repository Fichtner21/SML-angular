import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayersApiService } from 'src/app/services/players-api.service';
import {Chart} from 'chart.js';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  playedWars$: Observable<any>;
  ctx: any;
  activityCanvas: any;  

  constructor(private playersApiService: PlayersApiService) {}

  ngOnInit(): void {
      
  }

  groupDates(dates:any){
    const groupedDates = {};
    dates.forEach(d => {
      // console.log(el.getMonth() + ': ' + el.getFullYear());   
      const dt = new Date(d);
      const date = dt.getDate();
      const year = dt.getFullYear();
      const month = dt.getMonth() + 1;

      const key = `${year}-${month}`;
      if(key in groupedDates){
        groupedDates[key].dates = [...groupedDates[key].dates, date];
      } else {
        groupedDates[key] = {
          year,
          month,
          dates: [date],
        };
      }
         
    });
    return Object.values(groupedDates);
  }
}
