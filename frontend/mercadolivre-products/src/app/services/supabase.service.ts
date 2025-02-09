import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://nthtncabtsotgnzolywo.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHRuY2FidHNvdGduem9seXdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNDAzMDQsImV4cCI6MjA1NDYxNjMwNH0.UE0S07819FIlbKFusQBYCratk_95lxQW2i1oITaIU2c'
    );
  }

  async getProducts() {
    const { data, error } = await this.supabase
      .from('mercadolibre_products')
      .select('*');

    if (error) throw error;

    if (data) {
      return data.map(product => ({
        ...product,
        image: product.image || 'https://via.placeholder.com/300x300?text=No+Image'
      }));
    }

    return [];
  }
}