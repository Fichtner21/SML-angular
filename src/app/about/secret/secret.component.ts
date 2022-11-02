import {Component, ViewChild, OnInit, QueryList, ViewChildren} from '@angular/core';
import {MapInfoWindow, MapMarker, GoogleMap } from '@angular/google-maps';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Contact } from './secret.model';
import { PlayersApiService } from 'src/app/services/players-api.service';


@Component({
  selector: 'app-secret',
  templateUrl: './secret.component.html',
  styleUrls: ['./secret.component.scss']
})
export class SecretComponent implements OnInit {
  // @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  @ViewChildren(MapInfoWindow) infoWindowsView: QueryList<MapInfoWindow>;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;

  public contactPlayers$: Observable<Contact[]>;
  public contactArray = [];
  public places = [];

  constructor(private playersApiService: PlayersApiService) {
    // this.markers = [];
    // this.zoom = 7;
  }

  ngOnInit() { 
    this.contactPlayers$ = this.playersApiService.getPlayers('Contact').pipe(
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
    this.contactPlayers$.subscribe(contacts => {
      this.contactArray = contacts;      
      this.contactArray.forEach(el => {
        let contact = {
          position: {
            lat: Number(el.lat),
            lng: Number(el.lng)
          },
          label: {
            color: 'black',
            text: el.nickname,
            tel: el.tel,
            realname: el.realname,
            address: el.address,
            accurate: el.accurate,
            fontSize: '0px' 
          },
          options: (el.active == 'active') ? this.icon : this.icongray,
          title: el.active
        }       
        this.places.push(contact);
      })
    });   
  }  

  infoContent: any;
  infoTel: string;
  infoRealname: string;
  infoAddress: string;
  accurate: string;

  icon = {
    animation: google.maps.Animation.DROP,
    icon: '../assets/images/sh_log70x70a.png'
  }
  icongray = {
    animation: google.maps.Animation.DROP,
    icon: '../assets/images/sh_log70x70a_gray.png'
  }

  openInfo(marker: MapMarker, content: any) {
    this.infoContent = content.label.text;
    this.infoTel = content.label.tel;
    this.infoRealname = content.label.realname;
    this.infoAddress = content.label.address;
    this.accurate = content.label.accurate;
    // console.log('content', content);
    // content.setContent('<p>'+ content.label.text +'</p>');
    // this.infoContent.innerHTML('<p>'+ content.label.text +'</p>');
    this.infoWindow.open(marker);
  }

  center: google.maps.LatLngLiteral = {lat: 52.25, lng: 19};  

  markerPositions: google.maps.LatLngLiteral[] = [
    
  ];
  zoom = 7;

  mapOptions: google.maps.MapOptions = {
    center: {lat:45.568, lng: 15.545},
    zoom: 7
  };

  // addMarker(event: google.maps.MapMouseEvent) {
  //   this.markerPositions.push(event.latLng.toJSON());
  // } 

  openInfoWindow(marker: MapMarker, windowIndex: number) {
    /// stores the current index in forEach
    let curIdx = 0;
    this.infoWindowsView.forEach((window: MapInfoWindow) => {   
      console.log('window', window);   
      if (windowIndex === curIdx) { 
        console.log('marker', marker);       
        window.open(marker);        
        curIdx++;
      } else {
        curIdx++;
      }      
    });
    
  }
  // public markers: any[];
  // public zoom: number;
  // public position = {
  //   lat: 52.259232532739134,
  //   lng: 19.1596780162337
  // }

  

 

 

  
}
