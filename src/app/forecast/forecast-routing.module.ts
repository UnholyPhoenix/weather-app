import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { extract } from '@app/core';
import { Shell } from '@app/shell/shell.service';
import { ForeCastComponent } from './forecast.component';

const routes: Routes = [
  Shell.childRoutes([{ path: 'forecast', component: ForeCastComponent, data: { title: extract('Forecast') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ForeCastRoutingModule {}
