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
            fontSize: '0px' 
          },
          options: (el.active == 'active') ? this.icon : this.icongray,
          title: el.active
        }       
        this.places.push(contact);
      })
    });   
  }  

  infoContent: string;
  icon = {
    animation: google.maps.Animation.DROP,
    icon: '../assets/images/sh_log70x70a.png'
  }
  icongray = {
    animation: google.maps.Animation.DROP,
    icon: '../assets/images/sh_log70x70a_gray.png'
  }

  openInfo(marker: MapMarker, content: string) {
    this.infoContent = content;
    this.infoWindow.open(marker);
  }

  center: google.maps.LatLngLiteral = {lat: 52.25, lng: 19};



  placess = [
    {
      position: {
        lat: 51.701622099222746, 
        lng: 19.66076561747126,
      },     
      label: {
        color: 'black',
        text: 'KaPsEL',
        fontSize: "0px"
      },      
      title: 'title1',
      options: this.icon
    },
    {
      position: {
        lat: 50.23651972205397,
        lng: 19.027802125926623, 
      },      
      label: {
        color: 'black',
        text: 'bAtOn',
        fontSize: "0px"
      },        
      title: 'Active',
      options: this.icon
    },
    {
      position: {
       lat: 54.71760197084978, 
       lng: 18.418015888512457
      },
      label: {
        color: 'black',
        text: 'Jim',
        fontSize: "0px"
      },        
      title: 'Active',
      options: this.icon
    },
    {
      position: {
        lat: 52.44309198641133, 
        lng: 16.907302456943704
      },
      label: {
        color: 'black',
        text: '-Illu$ioN-',
        fontSize: "0px"
      },        
      title: 'Active',
      options: this.icon
    },
    {
      position: {
        lat: 52.03304491601283, 
        lng: 23.13278992243002
      },
      label: {
        color: 'black',
        text: 'omega',
        fontSize: "0px"
      },        
      title: 'Active',
      options: this.icon
    },
    {
      position: {
        lat: 51.94004769419557, 
        lng: 15.508679902901962
      },
      label: {
        color: 'black',
        text: 'Zielony',
        fontSize: "0px"
      },        
      title: 'Active',
      options: this.icon
    },
    {
      position: {
        lat: 52.289907986204334, 
        lng:21.114926719143185
      },
      label: {
        color: 'black',
        text: 'GŁOWA',
        fontSize: "0px"
      },        
      title: 'Active',
      options: this.icon
    },
    {
      position: {
        lat: 52.30072355824604,  
        lng: 21.100923571154038
      },
      label: {
        color: 'black',
        text: 'ZielakPr0',
        fontSize: "0px"
      },        
      title: 'Active',
      options: this.icon
    },
    {
      position: {
        lat: 52.17723640572865,   
        lng: 20.850005724759583,
      },
      label: {
        color: 'black',
        text: 'neo',
        fontSize: "0px"
      },        
      title: 'Active',
      options: this.icon
    },
    {
      position: {
        lat: 52.19969539377627,    
        lng: 21.0100290544003,
      },
      label: {
        color: 'black',
        text: 'SzyCha',
        fontSize: "0px"
      },        
      title: 'Active',
      options: this.icon
    },
    {
      position: {
        lat: 50.26769378578994,     
        lng: 18.93898401425156,
      },
      label: {
        color: 'black',
        text: 'gRaBaRz',
        fontSize: "0px"
      },        
      title: 'Active',
      options: this.icon
    },
    {
      position: {
        lat: 50.2726874278241,      
        lng: 18.932375019004922,
      },
      label: {
        color: 'black',
        text: 'kurier',
        fontSize: "0px"
      },        
      title: 'Active',
      options: this.icon
    },
    {
      position: {
        lat: 52.75264106781298,       
        lng: 16.98528350902255,
      },
      label: {
        color: 'black',
        text: 'booGie',
        fontSize: "0px"
      },        
      title: 'Active',
      options: this.icon
    },
    {
      position: {
        lat: 49.784873112909004,        
        lng: 22.781997671317242,
      },
      label: {
        color: 'black',
        text: 'wariat',
        fontSize: "0px"
      },        
      title: 'Active',
      options: this.icon
    },
    {
      position: {
        lat: 50.1697211321711,         
        lng: 18.890024667960276,
      },
      label: {
        color: 'black',
        text: 'YOUR_PROBLEM',
        fontSize: "0px"
      },        
      title: 'Active',
      options: this.icon
    },
    {
      position: {
        lat: 51.407502055181936,          
        lng: 16.170028197880153,
      },
      label: {
        color: 'black',
        text: 'Markos',
        fontSize: "0px"
      },        
      title: 'Active',
      options: this.icon
    },
    {
      position: {
        lat: 49.6855306445134,           
        lng: 19.215510346934327,
      },
      label: {
        color: 'black',
        text: 'L4mer™',
        fontSize: "0px"
      },        
      title: 'Active',
      options: this.icon
    },
    {
      position: {
        lat: 51.69429270607395,            
        lng: 19.404573011376083,
      },
      label: {
        color: 'black',
        text: 'Meg@Sh!ra',
        fontSize: "0px"
      },        
      title: 'Active',
      options: this.icon
    },
    {
      position: {
        lat: 53.03296241285259,             
        lng: 18.61978604692516,
      },
      label: {
        color: 'black',
        text: 'KopeR',
        fontSize: "0px"
      },        
      title: 'Inactive',
      options: this.icongray
    },
    {
      position: {
        lat: 54.08584161152939,              
        lng: 21.372397986319754,
      },
      label: {
        color: 'black',
        text: 'MaMa',
        fontSize: "0px"
      },        
      title: 'Inactive',
      options: this.icongray
    },
    {
      position: {
        lat: 53.77957745545922,              
        lng: 20.51645053793799,
      },
      label: {
        color: 'black',
        text: 'Maliniak',
        fontSize: "0px"
      },        
      title: 'Inactive',
      options: this.icongray
    },
    {
      position: {
        lat: 49.59616042783484,              
        lng: 20.690834141716884,
      },
      label: {
        color: 'black',
        text: 'TOUGH^GUY',
        fontSize: "0px"
      },        
      title: 'Inactive',
      options: this.icongray
    },
    {
      position: {
        lat: 50.29958140048815,              
        lng: 21.46217014851982, 
      },
      label: {
        color: 'black',
        text: 'PiOD',
        fontSize: "0px"
      },        
      title: 'Inactive',
      options: this.icongray
    },
    {
      position: {
        lat: 52.236477478566,               
        lng: 21.0710597087215, 
      },
      label: {
        color: 'black',
        text: '-insaNe! >',
        fontSize: "0px"
      },        
      title: 'Inactive',
      options: this.icongray
    },
    {
      position: {
        lat: 37.530114252443205,                
        lng: 23.322278953236292, 
      },
      label: {
        color: 'black',
        text: 'evoltnz',
        fontSize: "0px"
      },        
      title: 'Inactive',
      options: this.icongray
    },
    {
      position: {
        lat: 52.21948448736198,                
        lng: 5.9687130271663005, 
      },
      label: {
        color: 'black',
        text: 'Mr.Wiggles',
        fontSize: "0px"
      },        
      title: 'Inactive',
      options: this.icon
    },
    {
      position: {
        lat: 39.24122364972807,                
        lng: -9.105907244219798, 
      },
      label: {
        color: 'black',
        text: 'madinfo',
        fontSize: "0px"
      },        
      title: 'Inactive',
      options: this.icon
    }
  ];

  

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

  click(){
    return true;
  }

  openInfoWindow(marker: MapMarker, windowIndex: number) {
    /// stores the current index in forEach
    let curIdx = 0;
    this.infoWindowsView.forEach((window: MapInfoWindow) => {
      if (windowIndex === curIdx) {
        window.open(marker);
        console.log('marker', marker);
        curIdx++;
      } else {
        curIdx++;
      }
      console.log('windowIndex', windowIndex)
    });
    
  }
  // public markers: any[];
  // public zoom: number;
  // public position = {
  //   lat: 52.259232532739134,
  //   lng: 19.1596780162337
  // }

  

 

 

  
}
