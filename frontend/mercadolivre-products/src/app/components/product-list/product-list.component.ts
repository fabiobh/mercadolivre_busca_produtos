import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

interface Product {
  id: number;
  title: string;
  price: number;
  permalink: string;
  thumbnail: string;
  query: string;  // Add query field
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Mercado Livre Products</h1>
      <div *ngFor="let group of groupedProducts | keyvalue" class="mb-8">
        <h2 class="text-xl font-bold mb-4 text-gray-700">Busca: "{{ group.key }}"</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div *ngFor="let product of group.value" class="border rounded-lg p-4 shadow-sm">
            <img [src]="product.thumbnail" [alt]="product.title" class="w-full h-48 object-cover mb-2">
            <h2 class="text-lg font-semibold mb-2">{{ product.title }}</h2>
            <p class="text-xl text-green-600 font-bold mb-2">R$ {{ product.price }}</p>
            <a [href]="product.permalink" target="_blank" class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Ver Produto
            </a>
          </div>
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
  groupedProducts: Map<string, Product[]> = new Map();

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    try {
      this.products = await this.supabaseService.getProducts();
      this.groupProducts();
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  private groupProducts() {
    const grouped = this.products.reduce((acc, product) => {
      const query = product.query || 'Outros';
      if (!acc.has(query)) {
        acc.set(query, []);
      }
      acc.get(query)?.push(product);
      return acc;
    }, new Map<string, Product[]>());

    this.groupedProducts = grouped;
  }
}