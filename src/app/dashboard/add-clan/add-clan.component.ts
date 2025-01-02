import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlayersApiService } from '../../services/players-api.service';
import { environment } from 'src/environments/environment';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-add-clan',
  templateUrl: './add-clan.component.html',
  styleUrls: ['./add-clan.component.scss']
})
export class AddClanComponent implements OnInit {
  addClanForm: FormGroup;
  clansLength!: number;
  players: { playername: string; username: string; clan?: string[] }[] = [];
  filteredPlayersMembers: any[] = []; // Filtered list based on search input
  @ViewChild('membersSelect') membersSelect!: MatSelect;
  addSuccessMessage: string | null = null; // Success message
  addErrorMessage: string | null = null; // Error message
  playerSearchControl = this.fb.control('');

  constructor(private fb: FormBuilder, private clanService: PlayersApiService) {
    this.addClanForm = this.fb.group({
      clan: ['', Validators.required],
      clantag: ['', Validators.required],
      cl: ['', Validators.required],
      wa: ['', Validators.required],
      clan_image: ['', Validators.required],
      flag: ['', Validators.required],
      last30days: [''], // Hidden field for last30days formula
      last365days: [''], // Hidden field for last365days formula
      win: [''], // Hidden field for win formula
      loss: [''], // Hidden field for loss formula
      draw: [''], // Hidden field for draw formula
      members: ['', Validators.required] // For storing selected members as a comma-separated string
    });
  }

  ngOnInit(): void {
    this.getClansData();
    this.loadPlayers();

    // Listen for changes in search input to filter players
    this.playerSearchControl.valueChanges.subscribe(value => {
      this.filterPlayers(value);
    });
  }

  getClansData(): void {
    this.clanService.getClans().subscribe(data => {
      this.clansLength = data?.values?.length ? data.values.length + 1 : 1; // Calculate first empty row

      const last30daysFormula = `=ARRAYFORMULA(JEŻELI(A${this.clansLength} = "", "", 
      LICZ.JEŻELI(FILTER('Match History Clans'!A:A, 
      'Match History Clans'!A:A >= DZIŚ()-30, 
      ('Match History Clans'!B:B = A${this.clansLength}) + ('Match History Clans'!C:C = A${this.clansLength})), 
      ">0")))`;

      const last365daysFormula = `=ARRAYFORMULA(JEŻELI(A${this.clansLength} = "", "", LICZ.JEŻELI(FILTER('Match History Clans'!A:A, 'Match History Clans'!A:A >= DZIŚ()-365, ('Match History Clans'!B:B = A${this.clansLength}) + ('Match History Clans'!C:C = A${this.clansLength})), ">0")))`;

      const winFormula = `=ARRAYFORMULA(SUM((('Match History Clans'!B:B = A${this.clansLength}) * ('Match History Clans'!D:D > 'Match History Clans'!E:E)) + (('Match History Clans'!C:C = A${this.clansLength}) * ('Match History Clans'!E:E > 'Match History Clans'!D:D))))`;

      const lossFormula = `=ARRAYFORMULA(SUM((('Match History Clans'!B:B = A${this.clansLength}) * ('Match History Clans'!D:D < 'Match History Clans'!E:E)) + (('Match History Clans'!C:C = A${this.clansLength}) * ('Match History Clans'!E:E < 'Match History Clans'!D:D))))`;

      const drawFormula = `=ARRAYFORMULA(SUM((('Match History Clans'!B:B = A${this.clansLength}) * ('Match History Clans'!D:D = 'Match History Clans'!E:E)) + (('Match History Clans'!C:C = A${this.clansLength}) * ('Match History Clans'!E:E = 'Match History Clans'!D:D))))`;

      const membersFormula = `=JOIN(", ", FILTER(Players!B:B, ISNUMBER(SEARCH(${this.clansLength}, Players!H:H))))`;

      const preeloFormula = `=IFERROR(
          INDEX('Match History Clans'!F:H, 
            MAX(FILTER(
              ROW('Match History Clans'!B:B),
              (('Match History Clans'!B:B = A${this.clansLength}) * 1 + ('Match History Clans'!C:C = A${this.clansLength}) * 1) > 0)
            ), 
            IF(INDEX('Match History Clans'!B:B, MAX(FILTER(
              ROW('Match History Clans'!B:B),
              (('Match History Clans'!B:B = A${this.clansLength}) * 1 + ('Match History Clans'!C:C = A${this.clansLength}) * 1) > 0))) = A${this.clansLength}, 1, 3)
          ),
          "No match found"
        )`;
      const totalwarsFormula =  `=ILE.NIEPUSTYCH(FILTER({'Match History Clans'!B:B; 'Match History Clans'!C:C}, {'Match History Clans'!B:B; 'Match History Clans'!C:C} = A${this.clansLength}))`

      // Update form values with calculated formulas
      this.addClanForm.patchValue({
        last30days: last30daysFormula,
        last365days: last365daysFormula,
        win: winFormula,
        loss: lossFormula,
        draw: drawFormula,
        members: membersFormula,
        preelo: preeloFormula,
        totalwars: totalwarsFormula
      });
    });
  }

  loadPlayers(): void {
    this.clanService.getPlayersFinal('Players').subscribe(players => {
      this.players = players.map(player => ({
        ...player,
        disabled: this.isPlayerInTwoClans(player.clan) // Disable if already in two clans
      }));
      console.log('this.players', this.players)
      this.filteredPlayersMembers = this.players; // Show all options initially
    });
  }

  isPlayerInTwoClans(clanField?: string): boolean {
    const clanList = clanField ? clanField.split(',').map(clan => clan.trim()) : [];
    return clanList.length >= 2; // Check if player is part of two or more clans
  }

  filterPlayers(value: string): void {
    const filterValue = value.toLowerCase();
    this.filteredPlayersMembers = this.players.filter(player => 
      player.playername.toLowerCase().includes(filterValue)
    );
  } 

  onSubmit(): void {
    if (this.addClanForm.valid) {
        const { clan, clantag, cl, wa, clan_image, flag } = this.addClanForm.value;

        // Join selected members into a comma-separated string
        const selectedMembersString = this.membersSelect.value.join(', ');

        // Submit data to Google Sheets
        this.clanService.createClan(
            environment.SPREADSHEET_ID,
            'USER_ENTERED',
            clan,
            clantag,
            cl,
            wa,
            clan_image,
            flag,
            this.addClanForm.value.last30days,
            this.addClanForm.value.last365days,
            this.addClanForm.value.win,
            this.addClanForm.value.loss,
            this.addClanForm.value.draw,
            selectedMembersString,
            this.addClanForm.value.preelo,
            this.addClanForm.value.totalwars
        ).subscribe({
            next: (response) => {
                console.log('Clan added:', response);

                // Update clan field for each selected member
                this.membersSelect.value.forEach((username: string) => {
                    this.clanService.updatePlayerClan(environment.SPREADSHEET_ID, 'Players', username, clan, 'add').subscribe({
                        next: (res) => console.log(`Updated clan for ${username}`, res),
                        error: (err) => console.error(`Failed to update clan for ${username}`, err)
                    });
                });

                // Update clan field for clan leader (cl) if selected
                if (cl && !this.membersSelect.value.includes(cl)) {
                    this.clanService.updatePlayerClan(environment.SPREADSHEET_ID, 'Players', cl, clan, 'add').subscribe({
                        next: (res) => console.log(`Updated clan for clan leader ${cl}`, res),
                        error: (err) => console.error(`Failed to update clan for clan leader ${cl}`, err)
                    });
                }

                // Update clan field for war arranger (wa) if selected
                if (wa && !this.membersSelect.value.includes(wa)) {
                    this.clanService.updatePlayerClan(environment.SPREADSHEET_ID, 'Players', wa, clan, 'add').subscribe({
                        next: (res) => console.log(`Updated clan for war arranger ${wa}`, res),
                        error: (err) => console.error(`Failed to update clan for war arranger ${wa}`, err)
                    });
                }

                // Reset form and provide feedback
                this.addClanForm.reset();
            },
            error: (error) => {
                console.error('Error adding clan:', error);
            }
        });
    }
  }

  public getSelectedMembersCount(): number {
    return this.membersSelect?.value?.length || 0; // Use value instead of selectedOptions
  }

  updateMembers() {
    console.log('this.membetsSelect', this.membersSelect)
    console.log('this.membersSelect.value', this.membersSelect.value)
    console.log('this.membersSelect.value.selected', this.membersSelect.value.selected)
    const selectedMembers = this.membersSelect.value.map(option => option);
    console.log('Updated members:', selectedMembers); 
  }
}