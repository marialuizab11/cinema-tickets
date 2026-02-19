import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SessaoService } from '../../services/sessao.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sessao',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule],
  template: `
  <div class="page-box">
    <div class="register-box"> 
      <div class="register-wrapper">
        <h1 class="auth-title">CADASTRO SESSÃO</h1>
        <form class="form-login" [formGroup]="sessaoForm" (ngSubmit)="onSubmit()">
          
          <div class="form-row">
            <div class="form-col">
              <label>Filme<span class="required">*</span></label>
              
                <ng-select 
                  class="custom-select" 
                  [items]="filmes" 
                  bindLabel="titulo" 
                  bindValue="id" 
                  formControlName="filmeId"
                  placeholder="Selecione um filme..."
                  [clearable]="false">
                </ng-select>
            </div>
            
          </div>

          <div class="form-row">

            <div class="form-col">
              <label>Horário<span class="required">*</span></label>
              <input type="time" formControlName="horario">
            </div>
            
            <div class="form-col">
              <label>Sala<span class="required">*</span></label>
              <select formControlName="salaId">
                <option [value]="null" disabled>Selecione a sala</option>
                <option *ngFor="let s of salas" [value]="s.id">Sala {{s.numero}} (Capacidade: {{s.capacidade}})</option>
              </select>
            </div>

          </div>

          <div class="form-row">

            <div class="form-col">
              <label>Classificação Indicativa<span class="required">*</span></label>
              <select formControlName="classificacao">
                <option value="Livre">Livre</option>
                <option value="10">10 anos</option>
                <option value="12">12 anos</option>
                <option value="14">14 anos</option>
                <option value="16">16 anos</option>
                <option value="18">18 anos</option>
              </select>
            </div>

            <div class="form-col">
              <label>Tipo de Áudio<span class="required">*</span></label>
              <select formControlName="tipo">
                <option value="Dublado">Dublado</option>
                <option value="Legendado">Legendado</option>
              </select>
            </div>

          </div>

          <p class="section-title">PERÍODO DE EXIBIÇÃO</p>

          <div class="form-row">
            <div class="form-col">
              <label>Data Inicial<span class="required">*</span></label>
              <input type="date" formControlName="dataInicio">
            </div>
            <div class="form-col">
              <label>Data Final<span class="required">*</span></label>
              <input type="date" formControlName="dataFim">
            </div>
          </div>

          <button type="submit" [disabled]="sessaoForm.invalid || isLoading">
            <span *ngIf="!isLoading">Cadastrar sessão</span>
            <span *ngIf="isLoading">PROCESSANDO...</span>
          </button>
        </form>
      </div>
    </div>
    <div class="img-box"></div>
  </div>
  `,
  styleUrl: './sessao.css'
})

export class Sessao implements OnInit {
  private service = inject(SessaoService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  sessaoForm: FormGroup;
  filmes: any[] = [];
  salas: any[] = [];
  isLoading = false;

  constructor() {
    this.sessaoForm = this.fb.group({
      filmeId: [null, Validators.required],
      filmeTituloAux: ['', Validators.required],
      salaId: [null, Validators.required],
      horario: ['', Validators.required],
      tipo: ['Dublado', Validators.required],
      classificacao: ['Livre', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required]
    });
  }

  get filmeTituloAux() { return this.sessaoForm.get('filmeTituloAux'); }
  get salaId() { return this.sessaoForm.get('salaId'); }
  get horario() { return this.sessaoForm.get('horario'); }
  get tipo() { return this.sessaoForm.get('tipo'); }
  get classificacao() { return this.sessaoForm.get('classificacao'); }
  get dataInicio() { return this.sessaoForm.get('dataInicio'); }
  get dataFim() { return this.sessaoForm.get('dataFim'); }

  ngOnInit() {
    this.service.listarFilmes().subscribe(res => this.filmes = res);
    this.service.listarSalas().subscribe(res => this.salas = res);
  }

  onFilmeSelected(event: any) {
    const filme = this.filmes.find(f => f.titulo === event.target.value);
    this.sessaoForm.get('filmeId')?.setValue(filme ? filme.id : null);
  }

  async onSubmit() {
    if (this.sessaoForm.invalid) {
      this.sessaoForm.markAllAsTouched(); 
      return;
    }

    if (this.isLoading) return;

    const { dataInicio, dataFim, filmeTituloAux, ...dadosForm } = this.sessaoForm.value;
    
    const dInicio = new Date(dataInicio + 'T00:00:00');
    const dFim = new Date(dataFim + 'T00:00:00');

    if (dFim < dInicio) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'A data final deve ser maior que a inicial.',
        confirmButtonColor: '#c91432'
      });
      return;
    }

    this.isLoading = true;
    try {
      let dataAtual = new Date(dInicio);
      
      while (dataAtual <= dFim) {
        const payload = {
          ...dadosForm,
          data: dataAtual.toISOString().split('T')[0]
        };

        await firstValueFrom(this.service.salvarSessao(payload));
        dataAtual.setDate(dataAtual.getDate() + 1);
      }

      await Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: 'Todas as sessões do período foram criadas.',
        confirmButtonColor: '#c91432'
      });
      
      this.sessaoForm.reset({ tipo: 'Dublado', classificacao: 'Livre' });

    } catch (error: any) {
      const msg = error.error?.detail || 'Erro ao comunicar com o servidor.';
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: msg,
        confirmButtonColor: '#c91432'
      });
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}