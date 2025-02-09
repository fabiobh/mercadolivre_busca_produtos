import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

interface Product {
  id: number;
  title: string;
  price: number;
  link: string;
  thumbnail: string;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">- Mercado Livre Products -</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let product of products" class="border rounded-lg p-4 shadow-sm">
          <img [src]="product.thumbnail" [alt]="product.title" class="w-full h-48 object-cover mb-2">
          <h2 class="text-lg font-semibold mb-2">{{ product.title }}</h2>
          <p class="text-xl text-green-600 font-bold mb-2">R$ {{ product.link }}</p>
          <a [href]="product.link" target="_blank" class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            View Product
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    try {
      this.products = await this.supabaseService.getProducts();
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }
}