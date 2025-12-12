export interface Word{
  tematicLabel?: String;
  word: string;
  uses: Number;
}

export class Word implements Word{
  constructor(){
    this.tematicLabel = '';
    this.word = '';
    this.uses = 0;
  }
}