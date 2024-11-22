import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherDataService } from '../weather-data.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-search-bar',
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  @Output() refreshDashboard = new EventEmitter<void>();

  searchedValue: string = '';
  loading: boolean = false;

  constructor(private service: WeatherDataService,
    private notifier: ToastrService
  ) {
  }

  search(val: string): void {
    if (!val || val.length < 2) {
      this.notifier.warning('Oops!', 'Please enter the input!');
      return;
    }
    this.loading = true;
    if (this.service.findItemInLocalStorage(val)) {
      this.loading = false;
      this.notifier.warning('Oops!', 'We have this city already');
      return;
    }
    this.service.findWeatherDataByCity(val)
      .subscribe({
        next: found => {
          this.service.saveItem(found);
          this.searchedValue = '';
          this.refreshDashboard.emit();
          this.notifier.success('Success!', 'City is added to the dashboard');
        },
        error: err => {
          this.loading = false;
          if (err.status === 404) {
            this.notifier.warning('Oops!', 'Failed to find the city');
          } else {
            this.notifier.error('Oops!', 'Failed to communicate with the data provider');
          }
        },
        complete: () => {
          this.loading = false;
        }
      });
  }
}
