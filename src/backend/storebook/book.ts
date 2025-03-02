export interface BookDetails {
  title: string,
  author: string,
  genre: string,
  year: number,
  image: string,
}

export class Book {
  readonly title: string;
  readonly author: string;
  readonly genre: string;
  readonly year: number;
  readonly image: string;

  constructor({title, author, genre, year, image}: BookDetails) {
    this.title = title;
    this.author = author;
    this.genre = genre;
    this.year = year;
    this.image = image;
  }
}
