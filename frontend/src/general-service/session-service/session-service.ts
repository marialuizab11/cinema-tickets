import { Injectable } from '@angular/core';
import { SessionModel } from '../../app/core/models/session.model';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private baseUrl = 'http://localhost:3000/sessoes';

  async getSessions(): Promise<SessionModel[]> {
    const response = await fetch(this.baseUrl);
    return response.json();
  }

  async getSessionById(id: number): Promise<SessionModel> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    return response.json();
  }

}
