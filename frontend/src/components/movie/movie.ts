import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MoviesService } from '../../general-service/movies-service/movies-service';
import { SessionService } from '../../general-service/session-service/session-service';
import { RoomService } from '../../general-service/room-service/room-service';
import { MovieModel } from '../../app/core/models/movie.model';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionModel } from '../../app/core/models/session.model';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie.html',
  styleUrl: './movie.css',
})
export class Movie implements OnInit {

  movie?: MovieModel;
  
  sessions: SessionModel[] = [];
  filteredSessions: SessionModel[] = [];
  currentDate: string = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];

  constructor(
    private moviesService: MoviesService,
    private sessionService: SessionService,
    private roomService: RoomService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      const movieId = Number(params.get('id'));

      if (movieId) {
        this.movie = await this.moviesService.getMoviesById(movieId);
        const todasAsSessoes = await this.sessionService.getSessions();
        const todasAsSalas = await this.roomService.getRooms();

        this.sessions = todasAsSessoes
          .filter(sessao => Number(sessao.filmeId) === movieId)
          .map(sessao => ({
            ...sessao,
            sala: todasAsSalas.find(sala => Number(sala.id) === Number(sessao.salaId))
          }));

        console.log('Sessões prontas com a sala:', this.sessions);

        this.filterByDate(this.currentDate);
        this.cdr.detectChanges();
      }
    });
  }

  filterByDate(evento: any) {
    const selectedDate = typeof evento === 'string' ? evento : evento.target.value;
    this.currentDate = selectedDate;
    
    this.filteredSessions = this.sessions.filter(sessao => 
      sessao.inicio.split('T')[0] === selectedDate
    );
  }

  getPoster(): string {
    return '/images/' + this.movie?.poster;
  }

  getBackdropImage(): string {
    return '/images/' + this.movie?.backdrop;
  }
}
