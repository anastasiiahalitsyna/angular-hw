import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { WeatherDataService } from './weather-data.service';
import { WeatherDetail } from './weather-detail';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let weatherDataServiceSpy: jasmine.SpyObj<WeatherDataService>;
    let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

    beforeEach(async () => {
        const weatherDataServiceMock = jasmine.createSpyObj('WeatherDataService', ['getAllWeatherData']);
        const toastrServiceMock = jasmine.createSpyObj('ToastrService', ['success', 'warning', 'error']);

        await TestBed.configureTestingModule({
            declarations: [],
            providers: [
                { provide: WeatherDataService, useValue: weatherDataServiceMock },
                { provide: ToastrService, useValue: toastrServiceMock }

            ],
            imports: [],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        weatherDataServiceSpy = TestBed.inject(WeatherDataService) as jasmine.SpyObj<WeatherDataService>;
    });

    it('should create the component', () => {
        expect(component).toBeTruthy();
    });

    describe('readItems()', () => {
        it('should populate weatherDetails with data from WeatherDataService', () => {
            const mockWeatherData: WeatherDetail[] = [
                { id: 1, city: 'London', description: 'Cloudy', temprature: 15 },
                { id: 2, city: 'New York', description: 'Sunny', temprature: 22 }
            ];

            weatherDataServiceSpy.getAllWeatherData.and.returnValue(mockWeatherData);

            component.readItems();

            expect(weatherDataServiceSpy.getAllWeatherData).toHaveBeenCalled();
            expect(component.weatherDetails).toEqual(mockWeatherData);
        });
    });

    describe('refreshDashboard()', () => {
        it('should call readItems to refresh weatherDetails', () => {

            spyOn(component, 'readItems');

            component.refreshDashboard();

            expect(component.readItems).toHaveBeenCalled();
        });
    });
});
