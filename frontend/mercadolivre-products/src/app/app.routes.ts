import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { HelloWorldComponent } from './components/hello-world/hello-world.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AddProductAutoComponent } from './components/add-product-auto/add-product-auto.component';
import { SearchListComponent } from './components/search-list/search-list.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'hello', component: HelloWorldComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'add-product-auto', component: AddProductAutoComponent },
  { path: 'searches', component: SearchListComponent }
];
