import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/players/player.service';
import { Router, RouterLink } from '@angular/router';
import { Player } from '../../model/player.model';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf],
  templateUrl: './result.component.html',
  styleUrl: './result.component.css'
})
export class ResultComponent implements OnInit{
  word: String = '';
  playerName: String = '';
  impostors: String[] = [];
  showResults = false;

  constructor(private playerService: PlayerService, private router: Router) {}
    
  ngOnInit() {
    const state = history.state as { word?: String; randomPlayerName?: String };

    this.word = state.word ?? '';
    this.playerName = state.randomPlayerName ?? '';

    if (!this.word) {
      alert('No hay palabra en el state, quizá se entró directo a /game');
      // aquí puedes hacer un fallback: pedir una nueva palabra, redirigir, etc.
    }

    this.loadImpostors();
  }

  loadImpostors(): void {
    this.playerService.getPlayers().subscribe({
      next: (players) => {
        this.impostors = players
              .filter(p => p.impostor === true)
              .map(p => p.name);
      },
      error: (err) => {
        console.error('Error cargando jugadores', err);
      }
    });
  }
}
