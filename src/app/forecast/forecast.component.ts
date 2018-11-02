import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../shared/services/weather.service';
import { AuthenticationService } from '../core/authentication/authentication.service';
import { finalize } from 'rxjs/operators';
import { UnitService } from '@app/shared/services/unit.service';

import * as _ from 'lodash';
import { Chart } from 'chart.js';

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export interface ForeCastObject {
  temp: string;
  windDeg: string;
  iconSrc: string;
  day?: string;
}

export interface ForeCastObjectResponse {
  dt: number;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: [
    {
      id: number;
      main: string;
      description: string;
      icon: string;
    }
  ];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
  day: string;
}

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss']
})
export class ForeCastComponent implements OnInit {
  isLoading: boolean;
  foreCasts: ForeCastObject[] = [];
  chart: any;
  foreCasts3Hours: any[] = [];
  days: string[] = [];
  unit = '';
  noDataFetched: boolean;

  constructor(
    private authService: AuthenticationService,
    private weatherService: WeatherService,
    private unitService: UnitService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.weatherService
      .getForecastData({ q: this.authService.credentials.location })
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe((forecsatData: any) => {
        if (forecsatData.error) {
          this.noDataFetched = true;
        } else {
          this.noDataFetched = false;
          this.processForeCastData(forecsatData.list);
        }
      });

    this.unit = this.unitService.getTempDisplayUnit();
  }

  private processForeCastData(foreCastData: any[]): void {
    this.foreCasts = this.setUpForecasts(foreCastData);
    this.chart = new Chart('canvas', {
      type: 'line',
      data: {
        labels: this.days, // days
        datasets: [
          {
            data: this.foreCasts3Hours, // temperatures
            borderColor: 'rgba(255, 255, 255, 0.2)',
            borderWidth: 2,
            pointBackgroundColor: 'transparent',
            pointBorderColor: 'orange',
            pointBorderWidth: 3,
            pointHoverBorderColor: 'orange',
            pointHoverBorderWidth: 10,
            lineTension: 0
          }
        ]
      },
      options: {
        elements: {
          point: {
            radius: 6,
            hitRadius: 6,
            hoverRadius: 6
          }
        },
        tooltips: {
          backgroundColor: 'transparent',
          displayColors: false,
          bodyFontSize: 14,
          callbacks: {
            label: function(tooltipItems, data) {
              return tooltipItems.yLabel;
            }
          }
        },
        legend: {
          display: false,
          labels: {
            fontColor: 'black',
            fontSize: 14
          }
        },
        scales: {
          xAxes: [
            {
              display: true
            }
          ],
          yAxes: [
            {
              display: true
            }
          ]
        }
      }
    });
  }

  // Creates array of forecast object which are displayed in frontend
  private setUpForecasts(foreCastData: any[]): ForeCastObject[] {
    let allForeCasts: ForeCastObject[] = [];
    let [day1, day2, day3, day4, day5] = this.setUpDays();

    // Get forecasts for every day by date
    let filteredForecast1 = this.filterForcastByDay(foreCastData, day1);
    let filteredForecast2 = this.filterForcastByDay(foreCastData, day2);
    let filteredForecast3 = this.filterForcastByDay(foreCastData, day3);
    let filteredForecast4 = this.filterForcastByDay(foreCastData, day4);
    let filteredForecast5 = this.filterForcastByDay(foreCastData, day5);

    // Add forecast object to array which will be displayed
    this.createForeCastObject(allForeCasts, filteredForecast1[0]);
    this.createForeCastObject(allForeCasts, filteredForecast2[0]);
    this.createForeCastObject(allForeCasts, filteredForecast3[0]);
    this.createForeCastObject(allForeCasts, filteredForecast4[0]);
    this.createForeCastObject(allForeCasts, filteredForecast5[0]);

    // Add tempratures for the next 3 hours per day, which is needed for the chart
    this.filterForeCastForNext3Hours(filteredForecast1, day1);
    this.filterForeCastForNext3Hours(filteredForecast2, day2);
    this.filterForeCastForNext3Hours(filteredForecast3, day3);
    this.filterForeCastForNext3Hours(filteredForecast4, day4);
    this.filterForeCastForNext3Hours(filteredForecast5, day5);

    return allForeCasts;
  }

  // HELPERS

  // Gets forecast for the nex 3 hours per day
  private filterForeCastForNext3Hours(foreCastsPerDay: any[], day: string): void {
    let d = new Date();

    let filteredForeCast = _.filter(foreCastsPerDay, (foreCastObject: ForeCastObjectResponse) => {
      let foreCastHour = +foreCastObject.dt_txt.split(' ')[1].split(':')[0];

      // Take only the forecast for the next hours and not the current period
      if (foreCastHour > d.getHours() + 3) {
        return foreCastObject.dt_txt.includes(day);
      }
    });

    this.days.push(this.getDay(filteredForeCast[0].dt_txt));
    this.foreCasts3Hours.push(filteredForeCast[0].main.temp);
  }

  // Prepares the object which will be displayed
  private createForeCastObject(foreCastArray: ForeCastObject[], newForeCastObj: any): void {
    let foreCast: ForeCastObject = {
      temp: newForeCastObj.main.temp + this.unitService.getTempDisplayUnit(),
      windDeg: newForeCastObj.wind.deg + this.unitService.getWindDegDisplayUnit(),
      iconSrc: `http://openweathermap.org/img/w/${newForeCastObj.weather[0].icon}.png`,
      day: this.getDay(newForeCastObj.dt_txt)
    };

    foreCastArray.push(foreCast);
  }

  // Get all forecast for one day by date
  private filterForcastByDay(forecastData: any[], day: string): any[] {
    let filteredForeCast = _.filter(forecastData, (foreCastObject: ForeCastObjectResponse) =>
      foreCastObject.dt_txt.includes(day)
    );
    return filteredForeCast;
  }

  // Creates 5 days with the starting day as today
  private setUpDays(): string[] {
    let days: string[] = [];
    let d = new Date();

    // New day, last forecast is till 21 in the evening
    if (d.getHours() > 21) {
      d.setDate(d.getDate() + 1);
    }

    for (let index = 0; index < 5; index++) {
      let day = this.formatDate(d);
      d.setDate(d.getDate() + 1);
      days.push(day);
    }

    return days;
  }

  // Formating the date to be the same as the format fro the api
  private formatDate(d: Date): string {
    let date = '';
    let month = `${d.getMonth() + 1}`;
    let day = `${d.getDate()}`;

    if (d.getMonth() + 1 < 10) {
      month = '0' + (d.getMonth() + 1);
    }

    if (d.getDate() < 10) {
      day = '0' + d.getDate();
    }

    date = d.getFullYear() + '-' + month + '-' + day;
    return date;
  }

  // Get the day name
  private getDay(date_string: string): string {
    let day = new Date(date_string);
    var dayName = days[day.getDay()];

    return dayName;
  }
}
