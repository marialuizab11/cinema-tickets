import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth-service';
import { AuthMock } from '../mock/auth-mock';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {

  const router = inject(Router);
  
  const token = localStorage.getItem('token');

  if (!token) {
    console.warn('Acesso negado: Nenhum token encontrado no localStorage.');
    return router.createUrlTree(['/login']); // ou [''] para a home
  }

  const requiredRole = route.data?.['role'];
  
  return true;
};
