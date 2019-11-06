const ACTIONS = {
  TOGGLE_ROUND_SEARCH: "toggle-round-search",
  CLOSE_ROUND_SEARCH: "close-round-search",
  SHOW_ROUND_SEARCH: "show-round-search",
  TOGGLE_ROUND_SORT: "toggle-round-sort",
  CLOSE_ROUND_SORT: "close-round-sort",
  SHOW_ROUND_SORT: "show-round-sort"
};

const defaultState = {
  showSearch: false,
  showSort: false
};

export const roundsDisplay = (state = { ...defaultState }, action = {}) => {
  switch (action.type) {
    case ACTIONS.TOGGLE_ROUND_SEARCH:
      return {
        ...state,
        showSearch: !state.showSearch
      };
    case ACTIONS.CLOSE_ROUND_SEARCH:
      return {
        ...state,
        showSearch: false
      };
    case ACTIONS.SHOW_ROUND_SEARCH:
      return {
        ...state,
        showSearch: true
      };

    case ACTIONS.TOGGLE_ROUND_SORT:
      return {
        ...state,
        showSort: !state.showSort
      };
    case ACTIONS.CLOSE_ROUND_SORT:
      return {
        ...state,
        showSort: false
      };
    case ACTIONS.SHOW_ROUND_SORT:
      return {
        ...state,
        showSort: true
      };

    case "RESET_ALL":
      return { ...defaultState };
    default:
      return state;
  }
};

export const toggleRoundSearch = () => dispatch => {
  dispatch({
    type: ACTIONS.TOGGLE_ROUND_SEARCH
  });
};

export const closeRoundSearch = () => dispatch => {
  dispatch({
    type: ACTIONS.CLOSE_ROUND_SEARCH
  });
};

export const showRoundSearch = () => dispatch => {
  dispatch({
    type: ACTIONS.SHOW_ROUND_SEARCH
  });
};

export const toggleRoundSort = () => dispatch => {
  dispatch({
    type: ACTIONS.TOGGLE_ROUND_SORT
  });
};

export const closeRoundSort = () => dispatch => {
  dispatch({
    type: ACTIONS.CLOSE_ROUND_SORT
  });
};

export const showRoundSort = () => dispatch => {
  dispatch({
    type: ACTIONS.SHOW_ROUND_SORT
  });
};
