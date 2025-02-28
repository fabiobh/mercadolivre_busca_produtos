import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HelloWorldComponent } from './components/hello-world/hello-world.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'hello', component: HelloWorldComponent }
];
