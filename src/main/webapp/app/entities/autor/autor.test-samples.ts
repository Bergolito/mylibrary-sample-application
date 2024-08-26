import { IAutor, NewAutor } from './autor.model';

export const sampleWithRequiredData: IAutor = {
  id: 24670,
};

export const sampleWithPartialData: IAutor = {
  id: 9312,
};

export const sampleWithFullData: IAutor = {
  id: 31529,
  nome: 'or',
};

export const sampleWithNewData: NewAutor = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
