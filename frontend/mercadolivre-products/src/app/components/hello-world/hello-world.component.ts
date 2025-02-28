import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-hello-world',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-3xl font-bold">Função para atualizar tabela ativada</h1>
      <p *ngIf="updateStatus" class="mt-2 text-green-600">{{ updateStatus }}</p>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class HelloWorldComponent implements OnInit {
  updateStatus: string = '';

  constructor(private supabaseService: SupabaseService) {}

  ngOnInit() {
    this.supabaseService.updateLastAccess().subscribe({
      next: () => {
        this.updateStatus = 'Tabela atualizada com sucesso!';
      },
      error: (error) => {
        this.updateStatus = 'Erro ao atualizar a tabela: ' + error.message;
      }
    });
  }
}