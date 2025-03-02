import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Observable, from } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  updateLastAccess(): Observable<any> {
    return from(this.supabase.rpc('update_last_access'));
  }

  callUpdateInternalData(): Observable<any> {
    const headers = {
      'Authorization': `Bearer ${environment.supabase.anonKey}`,
      'Content-Type': 'application/json'
    };

    return from(
      fetch(`${environment.supabase.url}/functions/v1/update-internal-data`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({}) // Add request body if needed
      }).then(response => response.json())
    );
  }

  async getProducts(): Promise<Product[]> {
    const { data, error } = await this.supabase
      .from('mercadolibre_products')
      .select('*');

    if (error) throw error;
    return data || [];
  }
  
  insertProduct(product: Product): Observable<any> {
    return from(
      this.supabase
        .from('mercadolibre_products')
        .insert(product)
        .select()
    );
  }
  
  insertProducts(products: Product[]): Observable<any> {
    return from(
      this.supabase
        .from('mercadolibre_products')
        .insert(products)
        .select()
    );
  }

  async getSearches(): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('mercadolibre_searchs')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}