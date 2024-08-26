import { ILivro, NewLivro } from './livro.model';

export const sampleWithRequiredData: ILivro = {
  id: 25032,
};

export const sampleWithPartialData: ILivro = {
  id: 7836,
  ano: 7143,
  isbn: 'zowie stumbling',
  capa: '../fake-data/blob/hipster.png',
  capaContentType: 'unknown',
};

export const sampleWithFullData: ILivro = {
  id: 23854,
  titulo: 'double yum',
  subtitulo: 'victoriously ukulele',
  ano: 26319,
  numPags: 592,
  isbn: 'shirk trivial',
  sinopse: 'although',
  formato: 'DIGITAL',
  capa: '../fake-data/blob/hipster.png',
  capaContentType: 'unknown',
};

export const sampleWithNewData: NewLivro = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
