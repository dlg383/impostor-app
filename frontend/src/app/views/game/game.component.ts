import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PlayerService } from '../../services/players/player.service';
import { Player } from '../../model/player.model';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [RouterLink, NgFor],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit{
  word!: string;
  players: Player[] = [];

  constructor(private playerService: PlayerService) {}
  
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
}
