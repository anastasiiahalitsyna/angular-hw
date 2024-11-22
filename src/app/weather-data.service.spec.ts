import { TestBed } from '@angular/core/testing';
import { WeatherDataService } from './weather-data.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { WeatherDetail } from './weather-detail';

describe('WeatherDataService', () => {
    let serviceUnderTest: WeatherDataService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WeatherDataService,
                provideHttpClient(),
                provideHttpClientTesting(),
            ]
        });
        serviceUnderTest = TestBed.inject(WeatherDataService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(serviceUnderTest).toBeTruthy();
    });

    describe('findItemInLocalStorage', () => {
        const testCity = 'TestCity';

        afterEach(() => {
            localStorage.clear();
        });

        it('should return true if the city exists in localStorage', () => {
            
            localStorage.setItem(testCity.toLowerCase(), 'someData');

            
            const result = serviceUnderTest.findItemInLocalStorage(testCity);

            
            expect(result).toBeTrue();
        });

        it('should return false if the city does not exist in localStorage', () => {
            
            const result = serviceUnderTest.findItemInLocalStorage(testCity);

            
            expect(result).toBeFalse();
        });

        it('should handle case-insensitive keys', () => {
            
            localStorage.setItem(testCity.toLowerCase(), 'someData');

            
            const result = serviceUnderTest.findItemInLocalStorage(testCity.toUpperCase());

            
            expect(result).toBeTrue();
        });
    });

    describe('deleteItem', () => {
        const testCity = 'TestCity';

        afterEach(() => {
            localStorage.clear();
        });


        it('should delete the existing item from localstorage', () => {
            localStorage.setItem(testCity.toLowerCase(), 'someData');

            serviceUnderTest.deleteItem(testCity);

            let item = localStorage.getItem(testCity.toLowerCase());
            expect(item).toBeNull();
        });

    });


    describe('saveItem', () => {
        const weatherItem: WeatherDetail = {
            id: 1,
            city: 'London',
            description: 'Sunny',
            temprature: 32
        }

        afterEach(() => {
            localStorage.clear();
        });


        it('should add the given item from localstorage in json format', () => {

            serviceUnderTest.saveItem(weatherItem);

            let item = localStorage.getItem(weatherItem.city.toLowerCase());

            expect(item).toBeTruthy();
            expect(item).toEqual('{"id":1,"city":"London","description":"Sunny","temprature":32}');
        });

    });


    describe('getAllWeatherData', () => {
        let weatherItem1 = '{"id":1,"city":"London","description":"Rainy","temprature":21}';
        let weatherItem2 = '{"id":2,"city":"Roma","description":"Sunny","temprature":32}';
        let weatherItem3 = '{"id":3,"city":"Lisbon","description":"Sunny","temprature":30}';
        let weatherItem4 = '{"id":4,"city":"Prague","description":"Snowing","temprature":2}';


        afterEach(() => {
            localStorage.clear();
        });


        it('should add the given item from localstorage in json format', () => {

            localStorage.setItem('london', weatherItem1);
            localStorage.setItem('roma', weatherItem2);
            localStorage.setItem('lisbon', weatherItem3);
            localStorage.setItem('prague', weatherItem4);

            const actualWeatherItems = serviceUnderTest.getAllWeatherData();

            expect(actualWeatherItems)
                .toHaveSize(4);
            const weather1 = actualWeatherItems[0];
            expect(weather1.city).toEqual('London');
            expect(weather1.description).toEqual('Rainy');
            expect(weather1.temprature).toEqual(21);
            expect(weather1.id).toEqual(1);

            const weather2 = actualWeatherItems[1];
            expect(weather2.city).toEqual('Roma');
            expect(weather2.description).toEqual('Sunny');
            expect(weather2.temprature).toEqual(32);
            expect(weather2.id).toEqual(2);

            const weather3 = actualWeatherItems[2];
            expect(weather3.city).toEqual('Lisbon');
            expect(weather3.description).toEqual('Sunny');
            expect(weather3.temprature).toEqual(30);
            expect(weather3.id).toEqual(3);

            const weather4 = actualWeatherItems[3];
            expect(weather4.city).toEqual('Prague');
            expect(weather4.description).toEqual('Snowing');
            expect(weather4.temprature).toEqual(2);
            expect(weather4.id).toEqual(4);
        });

    });







    describe('findWeatherDataByCity', () => {
        it('should perform an HTTP GET request and return transformed WeatherDetail', () => {
            const city = 'London';
            const mockResponse = {
                id: 1,
                name: 'London',
                weather: [{ description: 'light rain' }],
                main: { temp: 280.32 }
            };

            const expectedWeatherDetail: WeatherDetail = {
                id: 1,
                city: 'London',
                description: 'light rain',
                temprature: 7
            };

            serviceUnderTest.findWeatherDataByCity(city)
                .subscribe((weatherDetail) => {
                    expect(weatherDetail).toEqual(expectedWeatherDetail);
                });

            const req = httpTestingController.expectOne(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=xxxxx`
            );

            expect(req.request.method)
                .toBe('GET');
            expect(req.request.headers.get('Accept'))
                .toBe('application/json');

            req.flush(mockResponse);
        });
    });

});

