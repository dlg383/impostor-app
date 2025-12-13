import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PlayerService } from '../../services/players/player.service';
import { DictionaryService } from '../../services/dictionary/dictionary.service';
import { switchMap } from 'rxjs';
import { NgIf, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, NgIf, FormsModule, NgStyle],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  numImpostor = 1;
  minImpostors = 1;
  playersCount = 0;
  categoriesCount = 0;

  constructor(private playerService: PlayerService, private dictionaryService: DictionaryService, private router: Router){}

  ngOnInit() {
    this.numberPlayersAndCategories();
  }

  initGame() {
    this.playerService.selectImpostors(this.numImpostor).pipe(
      // Cuando termine de seleccionar impostores, pedimos la palabra
      switchMap(() => this.dictionaryService.getRandomWord())
    ).subscribe({
      next: (response) => {
        const word = response;

        // Navegamos al componente /game pasando la palabra en el state
        this.router.navigate(['/game'], {
          state: { word }   // <-- aquí viaja la palabra
        });
      },
      error: (err) => {
        console.error('Error al iniciar juego', err);
      }
    });
  }

  numberPlayersAndCategories(){
    this.playerService.getNumPlayers().subscribe(n => this.playersCount = n);
    this.dictionaryService.getNumTematic().subscribe(n => this.categoriesCount = n);
  }

  get maxImpostors(): number {
    return Math.max(1, Math.floor(this.playersCount / 3));
  }

  get canStart(): boolean {
    return this.playersCount >= 3 && this.categoriesCount >= 1 && this.numImpostor <= this.maxImpostors;
  }

  clampImpostors(): void {
    if (this.numImpostor < this.minImpostors) this.numImpostor = this.minImpostors;
    if (this.numImpostor > this.maxImpostors) this.numImpostor = this.maxImpostors;
  }

  decreaseImpostors(): void {
    this.numImpostor--;
    this.clampImpostors();
  }

  increaseImpostors(): void {
    this.numImpostor++;
    this.clampImpostors();
  }
}