import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-add-product-auto',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <div *ngIf="status === 'success'" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        Produto adicionado com sucesso
      </div>
      
      <div *ngIf="status === 'error'" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        Parametros invalidos
      </div>
    </div>
  `
})
export class AddProductAutoComponent implements OnInit {
  status: 'idle' | 'success' | 'error' = 'idle';
  
  constructor(
    private route: ActivatedRoute,
    private supabaseService: SupabaseService
  ) {}

  ngOnInit() {
    // Subscribe to query params to get the POST data
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        try {
          // Parse the JSON data from the query parameter
          const productData = JSON.parse(params['data']);
          this.processProductData(productData);
        } catch (error) {
          console.error('Error parsing JSON data:', error);
          this.status = 'error';
        }
      }
    });
  }

  private processProductData(data: any) {
    // Validate the product data
    if (this.validateProductData(data)) {
      // Ensure price is a number
      const productData: Product = {
        ...data,
        price: parseFloat(data.price)
      };

      // Insert the product
      this.supabaseService.insertProduct(productData).subscribe({
        next: () => {
          this.status = 'success';
        },
        error: (error) => {
          console.error('Error adding product:', error);
          this.status = 'error';
        }
      });
    } else {
      this.status = 'error';
    }
  }

  private validateProductData(data: any): boolean {
    // Check if all required fields are present and valid
    if (!data) return false;
    
    const requiredFields = ['query', 'title', 'price', 'permalink', 'thumbnail'];
    for (const field of requiredFields) {
      if (!data[field]) return false;
    }
    
    // Validate price is a valid number
    const price = parseFloat(data.price);
    if (isNaN(price) || price <= 0) return false;
    
    // Validate permalink is a valid URL
    try {
      new URL(data.permalink);
    } catch {
      return false;
    }
    
    return true;
  }
}

// example to use
// http://localhost:4200/add-product-auto?data=%7B%22query%22:%22smartphone%22,%22title%22:%22iPhone%2013%22,%22price%22:%223999.99%22,%22permalink%22:%22https:%2F%2Fexample.com%2Fiphone13%22,%22thumbnail%22:%22https:%2F%2Fexample.com%2Fiphone13.jpg%22%7D