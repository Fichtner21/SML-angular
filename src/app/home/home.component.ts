import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { idOne, IdOneAttributesMapping, IdTwoAttributesMapping, idTwo } from '../home/team-selection-one.model';
import { SelectionTeamService } from './selection-team.service';
import { map, tap } from 'rxjs/operators';
import { Spinkit } from 'ng-http-loader';
import { PlayersApiService } from '../services/players-api.service';
import { Chart, ChartOptions, ChartType } from 'chart.js';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public spinkit = Spinkit;
  idOne$: Observable<idOne[]>;
  idTwo$: Observable<idTwo[]>;
  idOneToDisp: [];
  randomVideo: string;  
  // idOne$: Observable<idOne[]>;
  teamOneCumulative: any;
  teamTwoCumulative: any;
  chanceOfWinTeamOneShow: any;
  chanceOfWinTeamTwoShow: any;  

  playedWars$: Observable<any>;
  ctx: any;
  activityCanvas: any;  
  simpleChart: any;

  public teamOneSelection$: Observable<any>;
  public playersTest$: Observable<any>;
  public teamSelections$: Observable<any>;

  // public barChartPlugins = [pluginAnnotation];

  // valueLeft = 5.33;
  // valueRight = 4.0;
  // devider = '2010';
  // color = '#21B087';

  // public barChartOptions: ChartOptions = {
  //   responsive: true,
  //   scales: {
  //     ticks: {
  //       min: 0,
  //       max: 10,
  //     },
  //   },
  //   plugins: {
  //     annotation: {
  //       annotations: [
  //         {
  //           type: 'line',
  //           scaleID: 'y-axis-0',
  //           yMin: this.valueLeft,
  //           yMax: this.valueLeft,
  //           xMax: 0,
  //           xMin: this.devider,
  //           borderColor: this.color,
  //           borderWidth: 2,
  //           label: {
  //             content: String(this.valueLeft),
  //             enabled: true,
  //             backgroundColor: this.color,
  //             color: 'white',
  //           },
  //         },
  //         {
  //           type: 'line',
  //           scaleID: 'y-axis-0',
  //           yMin: this.valueRight,
  //           yMax: this.valueRight,
  //           xMax: this.devider,
  //           xMin: 6,
  //           borderColor: this.color,
  //           borderWidth: 2,
  //           label: {
  //             content: String(this.valueRight),
  //             enabled: true,
  //             backgroundColor: this.color,
  //             color: 'white',
  //           },
  //         },
  //         {
  //           type: 'line',
  //           scaleID: 'x-axis-0',
  //           xMin: this.devider,
  //           xMax: this.devider,
  //           yMax: 9,
  //           yMin: 1,
  //           borderColor: this.color,
  //           borderWidth: 2,
  //           borderDash: [5, 10],
  //         },
  //       ],
  //     },
  //   },
  // };
  // public barChartLabels = [
  //   '2006',
  //   '2007',
  //   '2008',
  //   '2009',
  //   '2010',
  //   '2011',
  //   '2012',
  // ];
  // public barChartType: ChartType = 'line';
  // public barChartLegend = false;

  // public barChartData = [
  //   {
  //     data: [2, 9, 9, 6, 8, 8, 3],
  //     label: 'Test1Max',
  //     borderColor: '#FF000055',
  //     backgroundColor: '#FF000055',
  //     fill: +1,
  //   },
  //   {
  //     data: [1, 5, 8, 5, 6, 7, 2],
  //     label: 'Test1Med',
  //     borderColor: '#FF0000',
  //     backgroundColor: '#FF0000',
  //   },
  //   {
  //     data: [0, 1, 7, 4, 4, 6, 1],
  //     label: 'Test1Min',
  //     borderColor: '#FF000055',
  //     backgroundColor: '#FF000055',
  //     fill: +1,
  //   },
  // ];

  constructor(private idTeamOne: SelectionTeamService, private playersApiService: PlayersApiService) {
    
   }

   onClick(event) {}

  ngOnInit(): void {
    

    this.teamOneSelection$ = this.playersApiService.getPlayers('TeamSelectionOne').pipe(
      map((response:any) => {
        let batchRowValues = response.values;
        let players: any[] = [];
        for(let i = 1; i < batchRowValues.length; i++){
          const rowObject: object = {};
          for(let j = 0; j < batchRowValues[i].length; j++){
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          players.push(rowObject);
        }
        
        return players;
      })
    );

    this.playersTest$ = this.playersApiService.getPlayers('Players').pipe(
      map((response: any) => {        
        let batchRowValues = response.values;
        let players: any[] = [];
        for(let i = 1; i < batchRowValues.length; i++){
          const rowObject: object = {};
          for(let j = 0; j < batchRowValues[i].length; j++){
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          players.push(rowObject);
        }
        
        return players;
      }),
    ); 

    this.teamSelections$ = combineLatest([this.playersTest$, this.teamOneSelection$]).pipe(
      map(([players, selection]) => {
        let selected;
        let selectedArray: any[] = [];

        for(let name of selection){
          selected = {
            t1playername: this.addPlayerLink(name.Team1Players, players),
            t1username: name.Team1Players,
            t1preelo: name.ELO1,            
            t2playername: this.addPlayerLink(name.Team2Players, players),
            t2username: name.Team2Players,
            t2preelo: name.ELO2,            
          };
          selectedArray.push(selected);          
        }

        const chanceFutureTeamOne = parseInt(selectedArray[selectedArray.length -1].t1preelo.replace(/,/g,''), 10);
        const chanceFutureTeamTwo = parseInt(selectedArray[selectedArray.length -1].t2preelo.replace(/,/g,''), 10);      

        const chanceOfWinTeamOne = 1 / (1 + 10 ** ((chanceFutureTeamOne - chanceFutureTeamTwo) / 400)) * 100;
        const chanceOfWinTeamTwo = 1 / (1 + 10 ** ((chanceFutureTeamTwo - chanceFutureTeamOne) / 400)) * 100;      

        this.chanceOfWinTeamOneShow = this.floorPrecised(chanceOfWinTeamOne, 2);
        this.chanceOfWinTeamTwoShow = this.ceilPrecised(chanceOfWinTeamTwo, 2);       

        this.teamOneCumulative = selectedArray[selectedArray.length -1].t1preelo;
        this.teamTwoCumulative = selectedArray[selectedArray.length -1].t2preelo;
        // selectedArray[selectedArray.length -1].t1preelo = 
        selectedArray.pop()
        return selectedArray;           
      })
      
    )
  
    
    const videos = ['1','2','3','4'];
    this.randomVideo = videos[Math.floor(Math.random()*videos.length)];

    this.playedWars$ = this.playersApiService.getPlayers('Match+History').pipe(
      map((response: any) => {         
        const resValues = response.values;
        resValues.shift();
        const matchesDate = [];
        resValues.forEach((el:any) => {          
          matchesDate.push(new Date(el[0]).toISOString());
        });               

        const listOfActivity = this.groupDates(matchesDate);

        const yearMonth = [];
        const datesInMonth = [];

        listOfActivity.forEach(el => {          
          const monthWithYear = el['month'] + '/' + el['year'];
          yearMonth.push(monthWithYear);
          datesInMonth.push(el['dates'].length);
        });   
        
        
        
        //CANVAS
        this.activityCanvas = document.getElementById('allActivity');
        this.ctx = this.activityCanvas.getContext('2d');
        new Chart(this.ctx, {
          type: 'bar',
          data: {
            labels: yearMonth,
            datasets: [{
              label: 'Wars in month',
              data: datesInMonth,
              backgroundColor: datesInMonth.map(function(wars, i){
                if(datesInMonth[i] == Math.max.apply(null, datesInMonth)){
                  return 'rgba(11,156,49,0.6)';
                }
                if(datesInMonth[i] == Math.min.apply(null, datesInMonth)){
                  return 'rgba(255,0,0,0.6)';
                }
                return 'rgba(239, 239, 240, 0.6)';
              }),              
              borderWidth: 1
            }] 
          },                  
          options: {
            legend: {
              display: false
            },
            responsive: true,
            scales: {             
              xAxes: [
                {
                  ticks: {
                    beginAtZero: false,
                    min: 1,
                  },
                  offset: true,
                  id: 'date-x-axis',
                  scaleLabel: {
                    display: false,
                    labelString: 'Date of match',
                  },                  
                },
              ],
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true,
                  },
                  scaleLabel: {
                    display: false,
                    labelString: 'Frags per war',
                  },
                },
              ],
            },
            
            // display:true
          }, 
               
        });

        
        
        return response.values;       
      })
    )  
  } 

  public addPlayerLink(player:string, obj:any) {
    let convertedPlayer = '';    
    obj.forEach((el:any) => {
      if (player === el.username) {
        convertedPlayer = el.playername;
      } else if (player === '') {
        // console.log('N/A player');
      } else {
        // console.log('Something went wrong.');
      }
    });   
    return convertedPlayer; 
  } 

  public floorPrecised(number, precision) {
    const power = Math.pow(10, precision);
    return Math.floor(number * power) / power;
  }
  public ceilPrecised(number, precision) {
    const power = Math.pow(10, precision);
    return Math.ceil(number * power) / power;
  }

  groupDates(dates:any){
    const groupedDates = {};
    dates.forEach((d: string | number | Date) => {       
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
