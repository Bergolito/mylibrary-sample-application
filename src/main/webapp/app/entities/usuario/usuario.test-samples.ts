import { IUsuario, NewUsuario } from './usuario.model';

export const sampleWithRequiredData: IUsuario = {
  id: 6575,
};

export const sampleWithPartialData: IUsuario = {
  id: 21586,
  nome: 'beside',
};

export const sampleWithFullData: IUsuario = {
  id: 1624,
  nome: 'phooey meh apud',
  email: 'Sirineu44@yahoo.com',
  senha: 'to merry',
};

export const sampleWithNewData: NewUsuario = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
