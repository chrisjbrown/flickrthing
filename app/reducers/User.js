import { RECEIVE_ACCESS_TOKEN } from '../constants/ActionTypes';

export type userStateType = {
  token: string
};

type actionType = {
  type: string
};

const INITIAL_STATE = {
  token: null,
};

export default function user(state: Shape = INITIAL_STATE, action: actionType) {
  switch (action.type) {
    case RECEIVE_ACCESS_TOKEN:
      return Object.assign({}, state, { token: action.payload.token });
    default:
      return state;
  }
}
