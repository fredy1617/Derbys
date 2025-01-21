import { createStore } from 'redux';

const initialState = {
  notify_derbys: 0,
};

export const updateDerbys = (value) => {
  return {
    type: 'UPDATE_DERBYS',
    payload: value,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_DERBYS':
      return {
        ...state,
        notify_derbys: action.payload,
      };
    default:
      return state;
  }
};

export const store = createStore(reducer);
