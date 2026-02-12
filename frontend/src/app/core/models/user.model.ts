export interface User {
  nome: string;
  email: string;
  senha?: string;
  celular: string;
  cpf: string;
  role: 'CLIENT';
}