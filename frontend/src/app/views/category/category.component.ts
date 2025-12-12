import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Word } from '../../model/word.model';
import { DictionaryService } from '../../services/dictionary/dictionary.service';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, FormsModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.css'
})
export class CategoryComponent implements OnInit{
  tematiKey!: String;
  newWord = ''
  words: Word[] = [];
  showAddWordModal = false;
  
  constructor(private router: Router, private dictionaryService: DictionaryService){}

  ngOnInit(){
    this.getState();
    this.loadWords();
  }

  getState(){
    const state = this.router.getCurrentNavigation()?.extras.state as { id?: String } | undefined;

    // Si vienes desde navegación normal, lo tendrás aquí:
    if (state?.id != null) {
      this.tematiKey = state.id;
      return;
    }

    // Si recargas la página, getCurrentNavigation() puede ser null: usa history.state
    this.tematiKey = history.state?.id;
  }

  loadWords(){
    this.dictionaryService.getTematicWords(this.tematiKey).subscribe({
      next: (words) => {
        this.words = words;
      },
      error: (er) => {
        console.error('Error cargando palabras', er);
      }
    })
  }

  openModal(): void {
    this.showAddWordModal = true;
  }

  closeModal(): void {
    this.showAddWordModal = false;
    // opcional: limpiar el formulario al cerrar
    this.newWord = '';
  }

  saveWord(){
    this.dictionaryService.addWord(this.tematiKey, this.newWord).subscribe({
      next: (created) => {
        this.loadWords();
        this.showAddWordModal = false;
        this.newWord = '';
      },
      error: (err) => {
        console.error('Error en el POST:', err);
      }
    });
  }

  deleteWord(word: Word){
    alert("Palabra borrada")
  }
}
