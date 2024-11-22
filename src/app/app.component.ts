import { Component } from '@angular/core';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { WeatherCardComponent } from './weather-card/weather-card.component';
import { WeatherDetail } from './weather-detail';
import { WeatherDataService } from './weather-data.service';

@Component({
  selector: 'app-root',
  imports: [ SearchBarComponent, WeatherCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  weatherDetails: WeatherDetail[] = [];

  constructor(private serviceInj: WeatherDataService) {
    this.readItems();
  };

  readItems(): void {
    this.weatherDetails = this.serviceInj.getAllWeatherData()
  }

  refreshDashboard(): void {
    this.readItems();
  }

}
