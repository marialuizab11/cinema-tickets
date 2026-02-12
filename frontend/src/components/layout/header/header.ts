import { Component } from '@angular/core';
import { AuthService } from '../../../auth/service/auth-service';

@Component({
  selector: 'app-header',
  imports: [],
  template: `
    <header class="header">
      <div class="main-header">
          <a href="/" class="logo-wrapper">
              <img src="ticket.png" class="logo-img">
              <h1 class="logo-title">Cinema-Tickets</h1>
          </a>
          <button type="button" *ngIf="authService.isAuthenticated()" class="logout-button" (click)="onLogout()">
            <span class="logout-text"> Sair </span>
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
          </button>
      </div>
    </header>
  `,
  styleUrl: './header.css',
})
export class Header {
  constructor(private authService: AuthService) {}

  onLogout() {
    this.authService.logout();
  }
}