import {Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef} from '@angular/core';
import {NgttRound, NgttTournament} from '../declarations/interfaces';

@Component({
  selector: 'ngtt-single-elimination-tree',
  templateUrl: './single-elimination-tree.component.html',
  styleUrls: ['./single-elimination-tree.component.scss']
})
export class SingleEliminationTreeComponent implements OnInit, OnChanges {
  @Input() matchTemplate: TemplateRef<any>;
  @Input() tournament: NgttTournament;

  public winnersBracket: NgttRound[];
  public final: NgttRound;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('tournament') && changes.tournament.currentValue) {
      this.winnersBracket = this.tournament.rounds.filter(round => {
        return round.type === 'Winnerbracket';
      });
    }
    console.log(this.winnersBracket);
    this.final = this.tournament.rounds.filter(round => {
      return round.type === 'Final';
    }).shift();
    console.log(this.final);
  }

}
