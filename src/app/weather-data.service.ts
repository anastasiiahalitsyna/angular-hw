import { Injectable } from '@angular/core';
import { WeatherDetail } from './weather-detail';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {

  constructor(private httpClient: HttpClient) {
  }


  findWeatherDataByCity(city: string): Observable<WeatherDetail> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.append('Accept', 'application/json');
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=xxxxx`;
    return this.httpClient.get(url, { headers: headers })
      .pipe(map((res: any) => {
        let wd: WeatherDetail = {
          id: res.id,
          city: res.name,
          description: res.weather[0].description,
          temprature: this.convertToCelcius(res.main.temp)
        };
        return wd;
      }));
  }

  getAllWeatherData(): WeatherDetail[] {
    let storedItems: WeatherDetail[] = [];
    for (var i = 0; i < localStorage.length; i++) {
      let keyName = localStorage.key(i) || '';
      let item = localStorage.getItem(keyName) || '';
      let parsedItem = JSON.parse(item)
      let weatherItem: WeatherDetail = {
        id: parsedItem.id,
        city: parsedItem.city,
        temprature: parsedItem.temprature,
        description: parsedItem.description
      }
      storedItems.push(weatherItem);
    }
    return storedItems.sort((w1, w2) => w1.id - w2.id);
  }

  saveItem(itemToSave: WeatherDetail): void {
    localStorage.setItem(itemToSave.city.toLowerCase(), JSON.stringify(itemToSave));
  }

  deleteItem(city: string): void {
    localStorage.removeItem(city.toLowerCase());
  }

  findItemInLocalStorage(city: string): boolean {
    return localStorage.getItem(city.toLowerCase()) != null;
  }

  
  private convertToCelcius(tempKelvin: number): number {
    return Math.round(tempKelvin -  273.15);
  }
}
