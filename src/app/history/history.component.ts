import { Component } from '@angular/core';

@Component({
  selector: 'app-history',
  imports: [],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent {
  isStartDateFilled = false;
  isEndDateVisible = false;

  onStartDateChange(event: any): void {
    // Check if the start date is filled
    this.isStartDateFilled = event.target.value !== '';
  }

}
