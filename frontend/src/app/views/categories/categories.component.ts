import { Component, OnInit } from '@angular/core';
import { DictionaryService } from '../../services/dictionary/dictionary.service';
import { Tematic } from '../../model/tematic.model';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, FormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit{
  newTematic: String = '';
  tematics: Tematic [] = [];
  showAddCategoryModal = false;

  constructor(private dictionaryService: DictionaryService){}

  ngOnInit(){
    this.loadCategories();
  }

  loadCategories(){
    this.dictionaryService.getTematics().subscribe({
      next: (tematic) => {
        this.tematics = tematic;
      },
      error: (err) => {
        console.error('Error cargando jugadores', err);
      }
    });
  }

  openModal(): void {
    this.showAddCategoryModal = true;
  }

  closeModal(): void {
    this.showAddCategoryModal = false;
    // opcional: limpiar el formulario al cerrar
    this.newTematic = '';
  }

  saveTematic(){
    this.dictionaryService.addTematic(this.newTematic).subscribe({
      next: (created) => {
        this.loadCategories();
        this.showAddCategoryModal = false;
        this.newTematic = '';
      },
      error: (err) => {
        console.error('Error en el POST:', err);
      }
    });
  }
}
