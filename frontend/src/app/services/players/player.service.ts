import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

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

  getNumPlayers(): Observable<number> {
    return this.http.get<Player[]>(apiPlayer).pipe(
      map(players => players.length)
    );
  }
  
  addPlayer(player: Player){
    return this.http.post<Player>(
      apiPlayer + '/add',
      player
    ); 
  }

  deletePlayer(name: string){
    return this.http.delete(apiPlayer + `/delete/${encodeURIComponent(name)}`)
  }

  selectImpostors(impostorCount: number): Observable<void> {
    return this.http.post<void>(
      apiPlayer + '/select-impostors',
      { impostorCount }
    );
  }
}
