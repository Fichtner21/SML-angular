import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PlayersApiService } from '../../services/players-api.service'; // Przykładowa nazwa usługi
import { map, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.scss'],
})
export class OverlayComponent implements OnInit {
  @Input() title: string = 'Default Title'; // Tytuł overlay
  @Input() targetAmount: number = 100; // Docelowa kwota
  @Input() imageSrc: string | null = null; // Opcjonalne zdjęcie
  @Input() links: { label: string; url: string; color: string }[] = []; // Linki do przycisków

  @Output() closed = new EventEmitter<void>(); // Event do powiadomienia rodzica o zamknięciu

  collectedAmount$!: Observable<number>; // Observable przechowujący zebrane dane
  isVisible: boolean = true;
  constructor(private googleApi: PlayersApiService) {}

  ngOnInit(): void {
    this.collectedAmount$ = this.googleApi.getPlayers('NumPlayers').pipe(
      map((response: any) => {
        if (response.values && response.values[2] && response.values[2][0]) {
          return parseFloat(response.values[2][0]); // Pobranie wartości 17.95
        }
        return 0; // Domyślna wartość, jeśli coś poszło nie tak
      }),
      catchError(() => of(0)) // Obsługa błędów
    );
  }

  closeOverlay(): void {
    this.isVisible = false; // Ukryj overlay po zamknięciu
    this.closed.emit(); // Emituj zdarzenie zamknięcia
  }
}
