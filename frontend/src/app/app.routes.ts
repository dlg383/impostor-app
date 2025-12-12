import { Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { PlayersComponent } from './views/players/players.component';
import { CategoriesComponent } from './views/categories/categories.component';
import { GameComponent } from './views/game/game.component';
import { CategoryComponent } from './views/category/category.component';
import { ResultComponent } from './views/result/result.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'players', component: PlayersComponent},
  {path: 'categories', component: CategoriesComponent},
  {path: 'game', component: GameComponent},
  {path: 'category', component: CategoryComponent},
  {path: 'result', component: ResultComponent}
];
