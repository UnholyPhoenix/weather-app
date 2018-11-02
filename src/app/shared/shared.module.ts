import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderComponent } from './loader/loader.component';
import { WeatherService } from './services/weather.service';
import { UnitService } from './services/unit.service';

@NgModule({
  imports: [CommonModule],
  declarations: [LoaderComponent],
  exports: [LoaderComponent],
  providers: [WeatherService, UnitService]
})
export class SharedModule {}
