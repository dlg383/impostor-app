import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Player } from '../../model/player.model';

const apiPlayer = environment.API_URL + '/players';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private http: HttpClient) { }

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(apiPlayer);
  }

  addPlayer(player: Player){
    return this.http.post<Player>(
      apiPlayer + '/add',
      player
    ); 
  }

  selectImpostors(impostorCount: number): Observable<void> {
    return this.http.post<void>(
      apiPlayer + '/select-impostors',
      { impostorCount }
    );
  }
}
