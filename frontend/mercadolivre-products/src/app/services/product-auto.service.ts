import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductAutoService {
  constructor(private http: HttpClient) {}

  addProduct(productData: Product): Observable<any> {
    return this.http.post('/api/add-product-auto', productData);
  }
}