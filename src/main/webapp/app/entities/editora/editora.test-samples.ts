import { IEditora, NewEditora } from './editora.model';

export const sampleWithRequiredData: IEditora = {
  id: 19526,
};

export const sampleWithPartialData: IEditora = {
  id: 15349,
};

export const sampleWithFullData: IEditora = {
  id: 13870,
  nome: 'pfft',
};

export const sampleWithNewData: NewEditora = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
