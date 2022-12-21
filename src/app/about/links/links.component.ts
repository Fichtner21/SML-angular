import { Component, OnInit } from '@angular/core';
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-links',
  templateUrl: './links.component.html',
  styleUrls: ['./links.component.scss']
})
export class LinksComponent implements OnInit {
  arrowRightIcon = faCircleArrowRight;

  constructor() { }

  ngOnInit(): void {
  }

}
