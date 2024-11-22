import { Component, EventEmitter, Input, Output } from '@angular/core';
import { WeatherDetail } from '../weather-detail';
import { WeatherDataService } from '../weather-data.service';

@Component({
  selector: 'app-weather-card',
  imports: [],
  templateUrl: './weather-card.component.html',
  styleUrl: './weather-card.component.css'
})
export class WeatherCardComponent {
  @Input() weatherDetail!: WeatherDetail;
  @Output() refreshDashboard = new EventEmitter<void>();

  constructor(private service: WeatherDataService){

  }

  removeCard(city: string): void {
    this.service.deleteItem(city);
    this.refreshDashboard.emit();
  }
}
