import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { Word } from '../../model/word.model';
import { Tematic } from '../../model/tematic.model';
import { Observable } from 'rxjs';

const apiDictionary = environment.API_URL + '/dictionary'

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {
  constructor(private http: HttpClient) { }

  getTematics(): Observable<Tematic[]> {
    return this.http.get<Tematic[]>(apiDictionary + '/tematics');
  }

  addTematic(label: String){
    return this.http.post<Word>(
      apiDictionary + '/tematics',
      { label }
    ); 
  }

  getWord(): Observable<Word> {
    return this.http.get<Word>(apiDictionary + '/random-word');
  }
}
