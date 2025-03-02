import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { Search } from '../../models/search.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-search-list',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Histórico de Pesquisas</h1>
        <a routerLink="/" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Voltar para Produtos
        </a>
      </div>
      
      <div *ngIf="loading" class="text-center py-8">
        <p class="text-gray-600">Carregando pesquisas...</p>
      </div>
      
      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {{ error }}
      </div>
      
      <div *ngIf="!loading && !error && searches.length === 0" class="text-center py-8">
        <p class="text-gray-600">Nenhuma pesquisa encontrada.</p>
      </div>
      
      <div *ngIf="!loading && searches.length > 0" class="bg-white shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Termo de Pesquisa
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data de Criação
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr *ngFor="let search of searches">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ search.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ search.query }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ search.created_at | date:'dd/MM/yyyy HH:mm' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a [routerLink]="['/']" [queryParams]="{query: search.query}" class="text-blue-600 hover:text-blue-900">
                  Ver Produtos
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SearchListComponent implements OnInit {
  searches: Search[] = [];
  loading = true;
  error = '';

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    try {
      this.loading = true;
      this.searches = await this.supabaseService.getSearches();
      this.loading = false;
    } catch (error: any) {
      this.loading = false;
      this.error = `Erro ao carregar pesquisas: ${error.message || 'Erro desconhecido'}`;
      console.error('Error fetching searches:', error);
    }
  }
}