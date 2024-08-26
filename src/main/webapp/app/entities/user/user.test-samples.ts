import { IUser } from './user.model';

export const sampleWithRequiredData: IUser = {
  id: 16973,
  login: 'Yl',
};

export const sampleWithPartialData: IUser = {
  id: 26788,
  login: 'k@Xn\\rMspHu\\.M\\W5L',
};

export const sampleWithFullData: IUser = {
  id: 9679,
  login: 'ZBWx@O\\ur',
};
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
