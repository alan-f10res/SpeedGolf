import { getAllTeeSetsAPI } from "../api/teeSet.api";

const ACTIONS = {
  LOAD_TEE_SETS: "load-tee-sets"
};

export const teeSetList = (state = [], action = {}) => {
  switch (action.type) {
    case ACTIONS.LOAD_TEE_SETS:
      return action.list;
    default:
      return state;
  }
};

// Look up tee set by tee set id
export const teeSetLookup = (state = {}, action = {}) => {
  switch (action.type) {
    case ACTIONS.LOAD_TEE_SETS:
      return action.lookup;
    default:
      return state;
  }
};

// Look up tee sets for a given course id
export const teeSetCourseLookup = (state = {}, action = {}) => {
  switch (action.type) {
    case ACTIONS.LOAD_TEE_SETS:
      return action.lookupByCourseOut;
    default:
      return state;
  }
};

export const loadTeeSets = () => async dispatch => {
  const teeResponse = await getAllTeeSetsAPI();

  dispatch({
    type: ACTIONS.LOAD_TEE_SETS,
    list: teeResponse.list,
    lookup: teeResponse.lookup,
    lookupByCourseOut: teeResponse.lookupByCourseOut
  });
};
