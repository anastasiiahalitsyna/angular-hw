import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { WeatherDataService } from '../weather-data.service';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { of, throwError } from 'rxjs';
import { EventEmitter } from '@angular/core';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let weatherDataServiceSpy: jasmine.SpyObj<WeatherDataService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const weatherDataServiceMock = jasmine.createSpyObj('WeatherDataService', ['findItemInLocalStorage', 'findWeatherDataByCity', 'saveItem']);
    const toastrServiceMock = jasmine.createSpyObj('ToastrService', ['success', 'warning', 'error']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, CommonModule],
      declarations: [],
      providers: [
        { provide: WeatherDataService, useValue: weatherDataServiceMock },
        { provide: ToastrService, useValue: toastrServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;

    weatherDataServiceSpy = TestBed.inject(WeatherDataService) as jasmine.SpyObj<WeatherDataService>;
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('search()', () => {
    it('should show a warning if the city already exists in localStorage', () => {
      const cityName = 'London';
      weatherDataServiceSpy.findItemInLocalStorage.and.returnValue(true);

      component.search(cityName);

      expect(weatherDataServiceSpy.findItemInLocalStorage).toHaveBeenCalledWith(cityName);
      expect(toastrServiceSpy.warning).toHaveBeenCalledWith('Oops!', 'We have this city already');
      expect(component.loading).toBeFalse();
    });

    it('should add a city if it does not exist in localStorage and API call succeeds', () => {
      const cityName = 'Paris';
      const mockWeatherDetail = { id: 123, city: cityName, description: 'clear sky', temprature: 15 };
      weatherDataServiceSpy.findItemInLocalStorage.and.returnValue(false);
      weatherDataServiceSpy.findWeatherDataByCity.and.returnValue(of(mockWeatherDetail));

      spyOn(component.refreshDashboard, 'emit');

      component.search(cityName);

      expect(weatherDataServiceSpy.findItemInLocalStorage).toHaveBeenCalledWith(cityName);
      expect(weatherDataServiceSpy.findWeatherDataByCity).toHaveBeenCalledWith(cityName);
      expect(weatherDataServiceSpy.saveItem).toHaveBeenCalledWith(mockWeatherDetail);
      expect(component.refreshDashboard.emit).toHaveBeenCalled();
      expect(toastrServiceSpy.success).toHaveBeenCalledWith('Success!', 'City is added to the dashboard');
      expect(component.loading).toBeFalse();
    });

    it('should show a warning if the city is not found (404 error)', () => {
      const cityName = 'InvalidCity';
      weatherDataServiceSpy.findItemInLocalStorage.and.returnValue(false);
      weatherDataServiceSpy.findWeatherDataByCity.and.returnValue(
        throwError(() => ({ status: 404 }))
      );

      component.search(cityName);

      expect(weatherDataServiceSpy.findItemInLocalStorage).toHaveBeenCalledWith(cityName);
      expect(weatherDataServiceSpy.findWeatherDataByCity).toHaveBeenCalledWith(cityName);
      expect(toastrServiceSpy.warning).toHaveBeenCalledWith('Oops!', 'Failed to find the city');
      expect(component.loading).toBeFalse();
    });

    it('should show an error if the API call fails with another error', () => {
      const cityName = 'UnknownErrorCity';
      weatherDataServiceSpy.findItemInLocalStorage.and.returnValue(false);
      weatherDataServiceSpy.findWeatherDataByCity.and.returnValue(
        throwError(() => ({ status: 500 }))
      );

      component.search(cityName);

      expect(weatherDataServiceSpy.findItemInLocalStorage).toHaveBeenCalledWith(cityName);
      expect(weatherDataServiceSpy.findWeatherDataByCity).toHaveBeenCalledWith(cityName);
      expect(toastrServiceSpy.error).toHaveBeenCalledWith('Oops!', 'Failed to communicate with the data provider');
      expect(component.loading).toBeFalse();
    });
  });
});
