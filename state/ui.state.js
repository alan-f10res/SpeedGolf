const UI_ACTIONS = {
  SET_CURRENT_ROUND: "set-current-round",
  CLEAR_CURRENT_ROUND: "clear-current-round"
};
export const currentRoundId = (state = null, action = {}) => {
  switch (action.type) {
    case UI_ACTIONS.CLEAR_CURRENT_ROUND:
      return null;
    case UI_ACTIONS.SET_CURRENT_ROUND:
      return action.roundId;
    default:
      return state;
  }
};

export const setCurrentRound = roundId => dispatch => {
  dispatch({
    type: UI_ACTIONS.SET_CURRENT_ROUND,
    roundId
  });
};

export const clearCurrentRound = () => dispatch => {
  dispatch({
    type: UI_ACTIONS.CLEAR_CURRENT_ROUND
  });
};
