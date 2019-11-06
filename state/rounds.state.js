import { getRoundsForUser } from "../api/rounds.api";

const ACTIONS = {
  LOAD_ROUNDS: "load-rounds"
};

export const roundsList = (state = [], action = {}) => {
  switch (action.type) {
    case ACTIONS.LOAD_ROUNDS:
      return action.roundsList;
    default:
      return state;
  }
};

export const roundLookup = (state = {}, action = {}) => {
  switch (action.type) {
    case ACTIONS.LOAD_ROUNDS:
      return action.roundLookup;
    default:
      return state;
  }
};

export const loadRounds = rounds => dispatch => {
  dispatch({
    type: ACTIONS.LOAD_ROUNDS,
    roundsList: rounds.list,
    roundLookup: rounds.lookup
  });
};
