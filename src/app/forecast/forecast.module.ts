import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ForeCastRoutingModule } from './forecast-routing.module';
import { ForeCastComponent } from './forecast.component';
import { SharedModule } from '../shared';

@NgModule({
  imports: [CommonModule, TranslateModule, ForeCastRoutingModule, SharedModule],
  declarations: [ForeCastComponent]
})
export class ForeCastModule {}
