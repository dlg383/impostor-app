import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PlayerService } from '../../services/players/player.service';
import { Player } from '../../model/player.model';
import { NgFor, NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterLink, NgFor, NgStyle, NgIf],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit{
  word!: string;
  players: Player[] = [];

  currentIndex = 0;
  reveal = 0;

  dragging = false;
  private startY = 0;
  private boxHeight = 1;

  constructor(private playerService: PlayerService, private router: Router) {}
  
  ngOnInit() {
    this.word = history.state.word;
    if (!this.word) {
      alert('No hay palabra en el state, quizá se entró directo a /game');
      // aquí puedes hacer un fallback: pedir una nueva palabra, redirigir, etc.
    }

    this.loadPlayers();
  }

  loadPlayers(): void {
    this.playerService.getPlayers().subscribe({
      next: (players) => {
        this.players = players;
      },
      error: (err) => {
        console.error('Error cargando jugadores', err);
      }
    });
  }

  getRandomPlayer(): Player | null {
    if (!this.players || this.players.length === 0) return null;

    const index = Math.floor(Math.random() * this.players.length);
    return this.players[index];
  }

  get currentPlayer() {
    return this.players?.[this.currentIndex];
  }

  get isLastPlayer(): boolean {
    return this.currentIndex >= (this.players?.length ?? 0) - 1;
  }

  get secretText(): string {
    if (!this.currentPlayer) return '';
    return this.currentPlayer.impostor ? 'Eres impostor' : 'La palabra es: ' +  this.word;
  }

  get coverStyle(): Record<string, string> {
    // persiana: cuanto más reveal, menos tapa (altura)
    const remaining = 100 - this.reveal;
    return { height: `${remaining}%` };
  }

  onSecretDown(ev: PointerEvent, el: HTMLElement): void {
    this.dragging = true;
    this.reveal = 0;

    this.startY = ev.clientY;
    this.boxHeight = Math.max(1, el.getBoundingClientRect().height);

    // Para seguir recibiendo eventos aunque el dedo salga del elemento
    el.setPointerCapture?.(ev.pointerId);
  }

  onSecretMove(ev: PointerEvent, el: HTMLElement): void {
    if (!this.dragging) return;

    const dy = this.startY - ev.clientY; // subir = positivo
    const percent = (dy / this.boxHeight) * 100;

    this.reveal = Math.max(0, Math.min(100, percent));
  }

  onSecretUp(ev: PointerEvent, el: HTMLElement): void {
    if (!this.dragging) return;

    this.dragging = false;
    this.reveal = 0; // al soltar se vuelve a tapar
    el.releasePointerCapture?.(ev.pointerId);
  }

  nextPlayer(): void {
    this.reveal = 0;
    this.dragging = false;

    if (this.isLastPlayer) {
      const randomPlayer = this.getRandomPlayer();

      if (randomPlayer) {
        this.router.navigate(['/result'], {
          state: {
            word: this.word,
            randomPlayerName: randomPlayer.name
          }
        });
      }
      return; 
    }
    this.currentIndex++;
  }
}
