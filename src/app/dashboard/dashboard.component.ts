import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { AuthenticationService } from '../core/authentication/authentication.service';
import { WeatherService, WeatherContext } from '../shared/services/weather.service';
import { UnitService } from '../shared/services/unit.service';

export interface WeatherObject {
  temp: string;
  humidity: string;
  windSpeed: string;
  windDeg: string;
  iconSrc: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isLoading: boolean;
  city = '';
  unit = '';
  noDataFetched: boolean;
  weatherObj: WeatherObject = {
    temp: 'N/A',
    humidity: 'N/A',
    windSpeed: 'N/A',
    windDeg: 'N/A',
    iconSrc: 'N/A'
  };

  constructor(
    private authService: AuthenticationService,
    private weatherService: WeatherService,
    private unitService: UnitService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.unit = this.authService.credentials.unit;

    if (navigator.geolocation) {
      if (this.authService.credentials.location) {
        // Location alredy searched
        this.getWeatherByCityName(this.authService.credentials.location);
      } else {
        // First login, use geolocation
        navigator.geolocation.getCurrentPosition(position => {
          this.getWeatherByLocation(position);
        });
      }
    } else {
      // Use a value for setting the app in geolocation is not supported
      this.getWeatherByCityName('Ljubljana');
    }
  }

  getWeatherByLocation(position: any) {
    this.getWeatherData({ lat: position.coords.latitude, long: position.coords.longitude });
  }

  getWeatherByCityName(cityName: any) {
    this.getWeatherData({ q: cityName });
  }

  setUnit(unit: any): void {
    this.unit = unit;
    this.unitService.setUnit(unit);
  }

  // HELPERS

  private getWeatherData(params: WeatherContext): void {
    // Make request to get the location
    this.weatherService
      .getWeatherData(params)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((weatherData: any) => {
        // TODO: DISPLAY error ce je
        if (weatherData.error) {
          this.noDataFetched = true;
        } else {
          this.noDataFetched = false;
          this.processWeatherObject(weatherData);
        }
      });
  }

  // Prepare data for frontend
  private processWeatherObject(weatherData: any): void {
    let currCredentials = this.authService.credentials;
    currCredentials.location = weatherData.name;
    this.authService.setCredentials(currCredentials);
    this.city = weatherData.name;

    this.weatherObj.temp = weatherData.main.temp + this.unitService.getTempDisplayUnit();
    this.weatherObj.humidity = weatherData.main.humidity + ' %';
    this.weatherObj.iconSrc = `http://openweathermap.org/img/w/${weatherData.weather[0].icon}.png`;
    this.weatherObj.windSpeed = weatherData.wind.speed + this.unitService.getWindDisplayUnit();

    // This is often not present
    if (weatherData.wind.deg) {
      this.weatherObj.windDeg = weatherData.wind.deg + ' degrees';
    }
  }
}
