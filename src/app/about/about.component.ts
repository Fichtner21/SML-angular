import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { PlayersApiService } from '../services/players-api.service';
import { map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Contact } from './secret/secret.model';
import { NgxGalleryOptions } from '@kolkov/ngx-gallery';
import { NgxGalleryImage } from '@kolkov/ngx-gallery';
import { NgxGalleryAnimation } from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public matchesTab$: Observable<any>;
  public maps: any;
  public resultMap: any;

  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];

  constructor(public route: ActivatedRoute, private router: RouterModule, private tabApiService: PlayersApiService, private translateService: TranslateService) { }
  public contactPlayers$: Observable<Contact[]>;

  ngOnInit(): void {
    this.matchesTab$ = this.tabApiService.getPlayers('Match+History').pipe(
      map((response: any) => {        
        let batchRowValuesHistory = response.values;
        let historyMatches: any[] = [];
        for(let i = 1; i < batchRowValuesHistory.length; i++){
          const rowObject: object = {};
          for(let j = 0; j < batchRowValuesHistory[i].length; j++){
            rowObject[batchRowValuesHistory[0][j]] = batchRowValuesHistory[i][j];
          }
          historyMatches.push(rowObject);
        }        
        return historyMatches;
      }),
    )

    this.contactPlayers$ = this.tabApiService.getPlayers('Contact').pipe(
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
      })
    )

    this.galleryOptions = [
      {
        width: '600px',
        height: '400px',
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide
      },
      // max-width 800
      {
        breakpoint: 800,
        width: '100%',
        height: '600px',
        imagePercent: 80,
        thumbnailsPercent: 20,
        thumbnailsMargin: 20,
        thumbnailMargin: 20
      },
      // max-width 400
      {
        breakpoint: 400,
        preview: false
      }
    ];

    this.galleryImages = [
      {
        small: 'assets/images/cb_rank.jpg',
        medium: 'assets/images/cb_rank.jpg',
        big: 'assets/images/cb_rank.jpg'
      },
    ]

    // this.contactPlayers$.subscribe(res => console.log('CONTACT', res));
    
    // this.maps = this.matchesTab$;
    // const mapsFilter = this.maps.map((a) => a.info);
    // this.resultMap = mapsFilter.filter((map: string | string[]) => map.includes('The Hunt')).length;

  } 
}