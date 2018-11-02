import { Injectable } from '@angular/core';
import { AuthenticationService } from '../../core/authentication/authentication.service';

@Injectable()
export class UnitService {
  unit = '';
  constructor(private authService: AuthenticationService) {
    this.unit = this.authService.credentials.unit;
  }

  setUnit(unit: string): void {
    let currCredentials = this.authService.credentials;
    if (unit === 'metric') {
      currCredentials.unit = 'metric';
    } else {
      currCredentials.unit = 'imperial';
    }

    this.unit = unit;
    this.authService.setCredentials(currCredentials);
  }

  getWindDisplayUnit(): string {
    if (this.unit === 'metric') {
      return ' meter/sec';
    }
    return ' miles/hour';
  }

  getWindDegDisplayUnit(): string {
    return ' degrees';
  }

  getTempDisplayUnit(): string {
    if (this.unit === 'metric') {
      return ' C°';
    }
    return ' F°';
  }
}
