import { createStore } from 'redux';

const initialState = {
  notify_trips: 0,
  notify_inspection: 0,
  notify_earrings: 0,
  notify_expiration: 0,
  notify_orders: 0,
  notify_revision: 0,
  notify_missing: 0,
};

export const updateTrips = (value) => {
  return {
    type: 'UPDATE_TRIPS',
    payload: value,
  };
};

export const updateInspection = (value) => {
  return {
    type: 'UPDATE_INSPECTION',
    payload: value,
  };
};

export const updateMissing = (value) => {
  return {
    type: 'UPDATE_MISSING',
    payload: value,
  };
};

export const updateRevision = (value) => {
  return {
    type: 'UPDATE_REVISION',
    payload: value,
  };
};

export const updateEarrings = (value) => {
  return {
    type: 'UPDATE_EARRINGS',
    payload: value,
  };
};

export const updateExpiration = (value) => {
  return {
    type: 'UPDATE_EXPIRATION',
    payload: value,
  };
};

export const updateOrders = (value) => {
  return {
    type: 'UPDATE_ORDERS',
    payload: value,
  };
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_TRIPS':
      return {
        ...state,
        notify_trips: action.payload,
      };
    case 'UPDATE_INSPECTION':
      return {
        ...state,
        notify_inspection: action.payload,
      };
    case 'UPDATE_REVISION':
      return {
        ...state,
        notify_revision: action.payload,
      };
    case 'UPDATE_EARRINGS':
      return {
        ...state,
        notify_earrings: action.payload,
      };
    case 'UPDATE_EXPIRATION':
      return {
        ...state,
        notify_expiration: action.payload,
      };
    case 'UPDATE_ORDERS':
      return {
        ...state,
        notify_orders: action.payload,
      };
    case 'UPDATE_MISSING':
      return {
        ...state,
        notify_missing: action.payload,
      };
    default:
      return state;
  }
};

export const store = createStore(reducer);
