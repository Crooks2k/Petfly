import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamplePagePage } from './pages/example-page/example-page.page';

const routes: Routes = [{ path: '', component: ExamplePagePage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExampleFeatureRoutingModule {}
