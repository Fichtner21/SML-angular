import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SeasonService {
  private startYear = 2023;

  constructor() {}

  getSeason(): { season: number; dateRange: string } {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-based, so 0 = January, 11 = December

    // Calculate the season number
    const yearDifference = currentYear - this.startYear;
    const quarter = Math.floor(currentMonth / 3); // 0 = Q1, 1 = Q2, 2 = Q3, 3 = Q4
    const seasonNumber = yearDifference * 4 + quarter + 1;

    // Corrected: Calculate the start and end dates of the current quarter
    let quarterStartMonth = quarter * 3; // Start month of the current quarter
    const startDate = new Date(currentYear, quarterStartMonth, 1);
    const endDate = new Date(currentYear, quarterStartMonth + 3, 0); // Last day of the quarter

    // Format date range correctly
    const dateRange = `${startDate.toLocaleDateString('pl-PL')} - ${endDate.toLocaleDateString('pl-PL')}`;

    return { season: seasonNumber, dateRange };
  }
}
