import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Adicionar Novo Produto</h1>
      
      <div *ngIf="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
        {{ successMessage }}
      </div>
      
      <div *ngIf="errorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ errorMessage }}
      </div>
      
      <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="query">
            Termo de Busca
          </label>
          <input 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="query" 
            type="text" 
            formControlName="query"
            placeholder="Ex: smartphone, notebook, etc">
          <p *ngIf="productForm.get('query')?.invalid && productForm.get('query')?.touched" class="text-red-500 text-xs italic">
            Termo de busca é obrigatório
          </p>
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="title">
            Título do Produto
          </label>
          <input 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="title" 
            type="text" 
            formControlName="title"
            placeholder="Nome do produto">
          <p *ngIf="productForm.get('title')?.invalid && productForm.get('title')?.touched" class="text-red-500 text-xs italic">
            Título é obrigatório
          </p>
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="price">
            Preço
          </label>
          <input 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="price" 
            type="number" 
            formControlName="price"
            placeholder="0.00">
          <p *ngIf="productForm.get('price')?.invalid && productForm.get('price')?.touched" class="text-red-500 text-xs italic">
            Preço é obrigatório e deve ser maior que zero
          </p>
        </div>
        
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="permalink">
            Link do Produto
          </label>
          <input 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="permalink" 
            type="text" 
            formControlName="permalink"
            placeholder="https://...">
          <p *ngIf="productForm.get('permalink')?.invalid && productForm.get('permalink')?.touched" class="text-red-500 text-xs italic">
            Link do produto é obrigatório e deve ser uma URL válida
          </p>
        </div>
        
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="thumbnail">
            URL da Imagem
          </label>
          <input 
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
            id="thumbnail" 
            type="text" 
            formControlName="thumbnail"
            placeholder="https://...">
          <p *ngIf="productForm.get('thumbnail')?.invalid && productForm.get('thumbnail')?.touched" class="text-red-500 text-xs italic">
            URL da imagem é obrigatória
          </p>
        </div>
        
        <div class="flex items-center justify-between">
          <button 
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
            type="submit"
            [disabled]="productForm.invalid || isSubmitting">
            {{ isSubmitting ? 'Salvando...' : 'Salvar Produto' }}
          </button>
          <a 
            class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" 
            routerLink="/">
            Voltar para Lista
          </a>
        </div>
      </form>
      
      <div *ngIf="previewData" class="mt-8">
        <h2 class="text-xl font-bold mb-4">Prévia do Produto</h2>
        <div class="border rounded-lg p-4 shadow-sm">
          <img [src]="previewData.thumbnail" [alt]="previewData.title" class="w-full h-48 object-cover mb-2">
          <h2 class="text-lg font-semibold mb-2">{{ previewData.title }}</h2>
          <p class="text-xl text-green-600 font-bold mb-2">R$ {{ previewData.price }}</p>
          <a [href]="previewData.permalink" target="_blank" class="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Ver Link
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
export class AddProductComponent {
  productForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  previewData: any = null;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      query: ['', Validators.required],
      title: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0.01)]],
      permalink: ['', [Validators.required, Validators.pattern('https?://.+')]],
      thumbnail: ['', Validators.required]
    });

    // Update preview when form changes
    this.productForm.valueChanges.subscribe(values => {
      if (this.productForm.valid) {
        this.previewData = values;
      }
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.productForm.controls).forEach(key => {
        const control = this.productForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const productData = {
      ...this.productForm.value,
      // Ensure price is a number
      price: parseFloat(this.productForm.value.price)
    };

    this.supabaseService.insertProduct(productData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = 'Produto adicionado com sucesso!';
        this.productForm.reset();
        
        // Redirect to product list after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = `Erro ao adicionar produto: ${error.message || 'Erro desconhecido'}`;
        console.error('Error adding product:', error);
      }
    });
  }
}