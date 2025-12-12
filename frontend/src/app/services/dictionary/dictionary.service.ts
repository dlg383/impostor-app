import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Word } from '../../model/word.model';
import { Tematic } from '../../model/tematic.model';
import { map, Observable } from 'rxjs';

const apiDictionary = environment.API_URL + '/dictionary'

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  constructor(private http: HttpClient) { }

  getTematics(): Observable<Tematic[]> {
    return this.http.get<Tematic[]>(apiDictionary + '/tematics');
  }

  toggleTematic(key: string): Observable<any> {
    return this.http.patch(apiDictionary + `/${encodeURIComponent(key)}/toggle`, {});
  }

  getNumTematic(): Observable<number> {
    return this.http.get<Tematic[]>(apiDictionary + '/tematics').pipe(
      map(tematics => tematics.filter(t => t.activa === true).length)
    );
  }

  getTematicWords(tematicKey: String): Observable<Word[]>{
    return this.http.get<Word[]>(apiDictionary + `/tematic-words/${tematicKey}`);
  }

  getNumberTematicWords(tematicKey: String): Observable<number>{
    return this.http.get<Word[]>(apiDictionary + `/tematic-words/${tematicKey}`).pipe(
      map(words => words.length)
    );
  }

  addTematic(label: String){
    return this.http.post<Word>(
      apiDictionary + '/tematics',
      { label }
    ); 
  }

  addWord(tematicKey: String, wordText: String) {
    return this.http.post(
      apiDictionary + `/tematics/${tematicKey}/words`, 
      { wordText }
    );
  }

  getRandomWord(): Observable<Word> {
    return this.http.get<Word>(apiDictionary + '/random-word');
  }
}
