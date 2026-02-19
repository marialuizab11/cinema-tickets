import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SessaoService } from '../../services/sessao.service';
import { firstValueFrom } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sessao',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
  <div class="page-box">
    <div class="register-box"> 
      <div class="register-wrapper">
        <h1 class="auth-title">CADASTRO SESSÃO</h1>
        <form class="form-login" [formGroup]="sessaoForm" (ngSubmit)="onSubmit()">
          
          <div class="form-row">
            <div class="form-col">
              <label>Filme<span class="required">*</span></label>
              <div class="input-group">
                <select formControlName="filmeId">
                  <option *ngFor="let f of filmes" [value]="f.id">{{f.titulo}}</option>
                </select>
              </div>
            </div>
            <div class="form-col">
              <label>Sala<span class="required">*</span></label>
              <div class="input-group">
                <select formControlName="salaId">
                  <option *ngFor="let s of salas" [value]="s.id">{{s.nome}}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-col">
              <label>Horário<span class="required">*</span></label>
              <div class="input-group">
                <input type="time" formControlName="horario">
              </div>
            </div>
            <div class="form-col">
              <label>Classificação</label>
              <div class="input-group">
                <select formControlName="classificacao">
                  <option value="Livre">Livre</option>
                  <option value="12">12 anos</option>
                  <option value="14">14 anos</option>
                  <option value="16">16 anos</option>
                  <option value="18">18 anos</option>
                </select>
              </div>
            </div>
          </div>

          <p class="section-title">PERÍODO DA CAMPANHA</p>

          <div class="form-row">
            <div class="form-col">
              <label>Início<span class="required">*</span></label>
              <div class="input-group">
                <input type="date" formControlName="dataInicio">
              </div>
            </div>
            <div class="form-col">
              <label>Fim<span class="required">*</span></label>
              <div class="input-group">
                <input type="date" formControlName="dataFim">
              </div>
            </div>
          </div>

          <button type="submit" [disabled]="sessaoForm.invalid || isLoading">
            FINALIZAR CADASTRO
          </button>
        </form>
      </div>
    </div>
    <div class="img-box"></div>
  </div>
  `,
  styleUrl: './sessao.css',
})
export class Sessao implements OnInit {
  private sessaoService = inject(SessaoService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  sessaoForm: FormGroup;
  isLoading = false;
  filmes: any[] = [];
  salas: any[] = [];

  constructor() {
    this.sessaoForm = this.fb.group({
      filmeId: [null, Validators.required],
      salaId: [null, Validators.required],
      horario: ['', Validators.required],
      classificacao: ['Livre', Validators.required],
      dataInicio: ['', Validators.required],
      dataFim: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.sessaoService.listarFilmes().subscribe(res => this.filmes = res);
    this.sessaoService.listarSalas().subscribe(res => this.salas = res);
  }

  async onSubmit() {
    if (this.sessaoForm.invalid) return;

    const { dataInicio, dataFim, ...payloadBase } = this.sessaoForm.value;
    const dInicio = new Date(dataInicio + 'T00:00:00');
    const dFim = new Date(dataFim + 'T00:00:00');

    if (dFim < dInicio) {
      Swal.fire('Erro', 'A data fim deve ser maior que a de início', 'error');
      return;
    }

    this.isLoading = true;

    try {
      let dataAtual = new Date(dInicio);
      while (dataAtual <= dFim) {
        const payload = {
          ...payloadBase,
          data: dataAtual.toISOString().split('T')[0]
        };
        
        await firstValueFrom(this.sessaoService.salvarSessao(payload));
        dataAtual.setDate(dataAtual.getDate() + 1);
      }

      Swal.fire('Sucesso!', 'Sessões cadastradas no período!', 'success');
      this.sessaoForm.reset({ classificacao: 'Livre' });
    } catch (error) {
      Swal.fire('Erro', 'Falha ao integrar com o servidor.', 'error');
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }
}