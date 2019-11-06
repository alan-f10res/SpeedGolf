import { getGolfProperties } from "../api/golfProperties.api";

const ACTIONS = {
  LOAD_PROPERTIES: "load-properties"
};

export const golfPropertiesList = (state = [], action = {}) => {
  switch (action.type) {
    case ACTIONS.LOAD_PROPERTIES:
      return action.golfPropertiesList;
    default:
      return state;
  }
};

export const golfPropertiesLookup = (state = {}, action = {}) => {
  switch (action.type) {
    case ACTIONS.LOAD_PROPERTIES:
      return action.golfPropertiesLookup;
    default:
      return state;
  }
}

export const loadAllGolfProperties = () => async dispatch => {
  await getGolfProperties().then(golfProperties => {
    dispatch({
      type: ACTIONS.LOAD_PROPERTIES,
      golfPropertiesList: golfProperties.list,
      golfPropertiesLookup: golfProperties.lookup
    });
  });
};
