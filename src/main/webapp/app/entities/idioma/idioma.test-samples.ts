import { IIdioma, NewIdioma } from './idioma.model';

export const sampleWithRequiredData: IIdioma = {
  id: 1679,
};

export const sampleWithPartialData: IIdioma = {
  id: 17621,
  nome: 'star palpate',
};

export const sampleWithFullData: IIdioma = {
  id: 15928,
  nome: 'marvelous',
  descricao: 'quicker however',
};

export const sampleWithNewData: NewIdioma = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
