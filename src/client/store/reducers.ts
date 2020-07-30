import { UserToken } from '@common/GQLTypes';
import { logger } from './middlewares';

export interface IState {
  loginToken?: UserToken,
}

export const initialState: IState = {
  loginToken: undefined,
};

export const createInitialState = () => initialState;

const rootReducer = (prevState, action) => {
  if (Object.keys(action).every((k) => prevState[k] === action[k])) return prevState;

  const state = {
    ...prevState,
    ...action,
  };

  logger(action, prevState, state);

  return state;
};

export default rootReducer;
