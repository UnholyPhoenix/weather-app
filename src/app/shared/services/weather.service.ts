import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthenticationService } from '../../core/authentication/authentication.service';

const routes = {
  weather: (c: WeatherContext) => {
    let queryParams = '/weather';

    if (c.q) {
      queryParams += `?q=${c.q}`;
    } else if (c.lat && c.long) {
      queryParams += `?lat=${c.lat}&lon=${c.long}`;
    }

    // Add APPID which is needded for the requests to work
    queryParams += `&units=${c.units}&APPID=${c.APIID}`;
    return queryParams;
  },
  forecast: (c: WeatherContext) => {
    let queryParams = '/forecast';

    if (c.q) {
      queryParams += `?q=${c.q}`;
    } else if (c.lat && c.long) {
      queryParams += `?lat=${c.lat}&lon=${c.long}`;
    }

    // Add APPID which is needded for the requests to work
    queryParams += `&units=${c.units}&APPID=${c.APIID}`;
    return queryParams;
  }
};

export interface WeatherContext {
  q?: string;
  lat?: string;
  long?: string;
  APIID?: string;
  units?: string;
}

@Injectable()
export class WeatherService {
  constructor(private httpClient: HttpClient, private authService: AuthenticationService) {}

  getWeatherData(context: WeatherContext): Observable<string> {
    context.APIID = this.authService.credentials.apiId;
    context.units = this.authService.credentials.unit;
    return this.httpClient
      .cache(false)
      .get(routes.weather(context))
      .pipe(
        map((response: any) => response),
        catchError(() => of({ error: 'Error, could not fetch weather data' }))
      );
  }

  getForecastData(context: WeatherContext): Observable<string> {
    context.APIID = this.authService.credentials.apiId;
    context.units = this.authService.credentials.unit;
    return this.httpClient
      .cache(false)
      .get(routes.forecast(context))
      .pipe(
        map((response: any) => response),
        catchError(() => of({ error: 'Error, could not fetch weather data' }))
      );
  }
}
