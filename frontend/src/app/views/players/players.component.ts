import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/players/player.service';
import { Player } from '../../model/player.model';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, FormsModule],
  templateUrl: './players.component.html',
  styleUrl: './players.component.css'
})
export class PlayersComponent implements OnInit{
  players: Player[] = [];
  newPlayer: Player = new Player();
  showAddPlayerModal = false;
  

  constructor(private playerService: PlayerService) {}
  
  ngOnInit() {
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

  openModal(): void {
    this.showAddPlayerModal = true;
  }

  closeModal(): void {
    this.showAddPlayerModal = false;
    // opcional: limpiar el formulario al cerrar
    this.newPlayer.clean();
  }

  savePlayer(){
    this.playerService.addPlayer(this.newPlayer).subscribe({
      next: (response) => {
        this.loadPlayers();
        this.showAddPlayerModal = false;
        this.newPlayer.clean();
      },
      error: (err) => {
        console.error('Error en el POST:', err);
      }
    });
  }

  deletePlayer(player: String){
    const name = player.toString();

    this.playerService.deletePlayer(name).subscribe({
      next: () => {
        // si tienes el array players cargado, lo actualizas:
        this.players = this.players.filter(p => p.name !== name);
      },
      error: (err) => {
        console.error('Error borrando jugador', err);
      }
    });
  }
}
