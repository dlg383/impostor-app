import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PlayerService } from '../../services/players/player.service';
import { DictionaryService } from '../../services/dictionary/dictionary.service';
import { switchMap } from 'rxjs';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  numberImp = 1
  constructor(private playerService: PlayerService, private dictionaryService: DictionaryService, private router: Router){}

  initGame() {
    this.playerService.selectImpostors(this.numberImp).pipe(
      // Cuando termine de seleccionar impostores, pedimos la palabra
      switchMap(() => this.dictionaryService.getWord())
    ).subscribe({
      next: (response) => {
        const word = response.word;

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
}