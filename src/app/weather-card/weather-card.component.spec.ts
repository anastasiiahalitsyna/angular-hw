import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeatherCardComponent } from './weather-card.component';
import { WeatherDataService } from '../weather-data.service';
import { WeatherDetail } from '../weather-detail';
import { EventEmitter } from '@angular/core';

describe('WeatherCardComponent', () => {
  let component: WeatherCardComponent;
  let fixture: ComponentFixture<WeatherCardComponent>;
  let weatherDataServiceSpy: jasmine.SpyObj<WeatherDataService>;

  beforeEach(async () => {
    const weatherDataServiceMock = jasmine.createSpyObj('WeatherDataService', ['deleteItem']);

    await TestBed.configureTestingModule({
      declarations: [],
      providers: [
        { provide: WeatherDataService, useValue: weatherDataServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherCardComponent);
    component = fixture.componentInstance;
    weatherDataServiceSpy = TestBed.inject(WeatherDataService) as jasmine.SpyObj<WeatherDataService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('removeCard', () => {
    it('should call deleteItem on the service and emit refreshDashboard', () => {
      const cityName = 'London';
      const refreshDashboardSpy = spyOn(component.refreshDashboard, 'emit');

      component.removeCard(cityName);

      expect(weatherDataServiceSpy.deleteItem).toHaveBeenCalledWith(cityName);
      expect(refreshDashboardSpy).toHaveBeenCalled();
    });
  });
});
