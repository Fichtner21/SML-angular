import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayersApiService } from 'src/app/services/players-api.service';

@Component({
  selector: 'app-list-data',
  templateUrl: './list-data.component.html',
  styleUrls: ['./list-data.component.scss']
})
export class ListDataComponent implements OnInit {
  data: any = [];

  constructor(private service: PlayersApiService, private router: Router) { }

  ngOnInit() {
    this.listData();    
  }  

  listData(){
    // this.service.listPlayers().subscribe({
    //   next: (res) => {
    //     // console.log(res)
    //     this.data = res;
    //   },
    //   error: (error) => {
    //     console.log(error)
    //   }
    // })
    this.service.getPlayers('Players').subscribe({
      next: (res) => {                    
        let batchRowValues = res.values;
        let players: any[] = [];
        for(let i = 1; i < batchRowValues.length; i++){
          const rowObject: object = {};
          for(let j = 0; j < batchRowValues[i].length; j++){
            rowObject[batchRowValues[0][j]] = batchRowValues[i][j];
          }
          players.push(rowObject);
        }        
        this.data = players; 
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  editSheet(username:any){
    this.router.navigate([`/dashboard/edit-player/${username}`])
  }

  deleteSheet(username:any){
    if(confirm("Are you sure to delete: " + username)){
      this.service.deletePlayer(username).subscribe({
        next: (res) => {
          this.listData();
        },
        error: (err) => {
          console.log(err)
        }
      })
    } else {
      alert("User " + username + " stay in Players List.");     
    }
  }
}
