import { IAuthority, NewAuthority } from './authority.model';

export const sampleWithRequiredData: IAuthority = {
  name: '7cfea685-3982-4957-8b95-893717caceed',
};

export const sampleWithPartialData: IAuthority = {
  name: 'd3c64736-5222-47ff-ab0f-66d1b14408c7',
};

export const sampleWithFullData: IAuthority = {
  name: 'a5ee7274-0e16-4032-96a7-fd5e74c9c07d',
};

export const sampleWithNewData: NewAuthority = {
  name: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
