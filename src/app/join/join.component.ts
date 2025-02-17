import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {
  mohshUrl: string = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const ip = params['ip'];
      const password = params['password'] ? `?password=${params['password']}` : '';

      if (ip) {
        this.mohshUrl = `mohsh://${ip}${password}`;
        window.location.href = this.mohshUrl; // Automatyczne przekierowanie
      }
    });
  }
}