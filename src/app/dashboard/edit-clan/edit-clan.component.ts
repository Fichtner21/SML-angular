import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlayersApiService } from '../../services/players-api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-clan',
  templateUrl: './edit-clan.component.html',
  styleUrls: ['./edit-clan.component.scss']
})
export class EditClanComponent implements OnInit {
  clans: any[] = [];
  selectedClan: any | null = null;
  editClanForm: FormGroup;
  allPlayers: any[] = [];
  membersList: string[] = []; // Lista członków klanu do wyświetlenia w szablonie

  constructor(
    private clanService: PlayersApiService,
    private fb: FormBuilder
  ) {
    this.editClanForm = this.fb.group({
      clan: ['', Validators.required],
      clantag: [''],
      cl: [''],
      wa: [''],
      clan_image: [''],
      flag: [''],
      members: ['']
    });
  }

  ngOnInit(): void {
    this.fetchClans();
    this.fetchPlayers();
  }

  fetchClans() {
    this.clanService.getPlayersFinal('Clans').subscribe(response => {    
      this.clans = response.map((clan, index) => ({
        ...clan,
        index: index
      }));
    });
  }

  fetchPlayers() {
    this.clanService.getPlayersFinal('Players').subscribe(response => {
      this.allPlayers = response;
    });
  }

  onSelectClan(clan: any) {
    this.selectedClan = clan;
    this.editClanForm.patchValue({
      clan: clan.clan,
      clantag: clan.clantag,
      cl: clan.cl,
      wa: clan.wa,
      clan_image: clan.clan_image,
      flag: clan.flag,
      members: clan.members
    });

    // Aktualizacja membersList z obecnych członków klanu
    this.membersList = clan.members ? clan.members.split(',').map((member: string) => member.trim()) : [];
  }

  onSubmit() {
    if (this.editClanForm.valid && this.selectedClan) {
        const formValues = this.editClanForm.value;
        const updatedFields: any = {};

        // Porównanie wartości formularza z istniejącymi i przygotowanie aktualizacji
        for (const key in formValues) {
            if (formValues[key] !== this.selectedClan[key]) {
                updatedFields[key] = formValues[key];
            }
        }

        // Przygotowanie listy członków do aktualizacji
        const updatedMembers = this.membersList.join(', ');
        updatedFields.members = updatedMembers; // Dodaj członków do obiektu aktualizacji

        // Aktualizacja członków w arkuszu
        this.clanService.updateClanMembers(environment.SPREADSHEET_ID, 'Clans', this.selectedClan.clan, updatedMembers).subscribe({
            next: response => {
                console.log(`Updated clan members for ${this.selectedClan.clan}:`, response);
                
                // Aktualizacja pozostałych pól klanu
                this.clanService.updateClan(this.selectedClan.index + 2, updatedFields).subscribe({
                    next: response => {
                        console.log('Clan updated:', response);
                        this.fetchClans(); // Odśwież listę klanów po aktualizacji
                    },
                    error: error => console.error('Error updating clan:', error)
                });
            },
            error: error => console.error(`Error updating clan members for ${this.selectedClan.clan}:`, error)
        });
    }
  }

  addMember(newMember: string) {
    if (!this.membersList.includes(newMember)) {
        this.membersList.push(newMember);
        this.editClanForm.patchValue({ members: this.membersList.join(', ') });

        // Update the player clan in the Players sheet
        this.updatePlayerClan(newMember, this.selectedClan.clan, 'add');
        
        // Update the clan members list in the Clans sheet
        this.updateClanMembersColumn(this.selectedClan.clan, this.membersList);
    }
  }

  removeMember(member: string) {
    this.membersList = this.membersList.filter(m => m.trim() !== member.trim());
    this.editClanForm.patchValue({ members: this.membersList.join(', ') });

    // Update the player clan in the Players sheet
    this.updatePlayerClan(member, this.selectedClan.clan, 'remove');
    
    // Update the clan members list in the Clans sheet
    this.updateClanMembersColumn(this.selectedClan.clan, this.membersList);
  }




updatePlayerClan(playerUsername: string, clanName: string, action: 'add' | 'remove') {
  const player = this.allPlayers.find(p => p.username === playerUsername);
  if (!player) return;

  let playerClans = player.clans ? player.clans.split(',').map(c => c.trim()) : [];

  if (action === 'add') {
      if (!playerClans.includes(clanName)) {
          playerClans.push(clanName);
      }
  } else {
      playerClans = playerClans.filter(c => c !== clanName);
  }

  const updatedClans = playerClans.join(', ');

  if (updatedClans === player.clans) {
      console.log('No change detected in clans for player:', playerUsername);
      return;
  }

  const spreadsheetId = '1w_WHqCutkp_S6KveKyu4mNaG76C5dIlDwKw-A-dEOLo';
  const sheetName = 'Players';

  this.clanService.updatePlayerClan(spreadsheetId, sheetName, playerUsername, clanName, action).subscribe({
      next: response => console.log(`Updated player ${playerUsername} clans:`, response),
      error: error => console.error(`Error updating player ${playerUsername} clans:`, error)
  });
}


updateClanMembersColumn(clanName: string, membersList: string[]) {
  const updatedMembers = membersList.join(', ');
  console.log(`Updating clan members in Clans for ${clanName}: ${updatedMembers}`);

  // Update the Clans sheet with the new members list
  this.clanService.updateClanMembers(environment.SPREADSHEET_ID, 'Clans', clanName, updatedMembers).subscribe({
      next: response => console.log(`Updated clan members for ${clanName}:`, response),
      error: error => console.error(`Error updating clan members for ${clanName}:`, error)
  });
}
}
