export interface Player {
  name: String,
  impostor: Boolean
}

export class Player implements Player{
  constructor(){
    this.name = "";
    this.impostor = false;
  }

  clean(){
    this.name = "";
    this.impostor = false;
  }
}