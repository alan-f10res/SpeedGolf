import { compose, createStore, combineReducers, applyMiddleware } from "redux";
import { createLogger } from "redux-logger";
import promiseMiddleware from "redux-promise";
import thunk from "redux-thunk";
import { persistStore, autoRehydrate } from "redux-persist";
import { AsyncStorage } from "react-native";

// Import the specific reducers
import { roundsDisplay } from "./roundsDisplay";
import { golfCourseList, golfCourseLookup } from "./golfCourses.state";
import { currentUser } from "./currentUser.state";
import {
  golfPropertiesLookup,
  golfPropertiesList
} from "./golfProperties.state";
import { roundsList, roundLookup } from "./rounds.state";
import { playerList, playerLookup } from "./players.state";
import { followers, following } from "./follows.state";
import { teeSetCourseLookup, teeSetList, teeSetLookup } from "./teeSets.state";
import { feed, feedLoading } from "./feed.state";
import { currentRoundId } from "./ui.state";

// Generates our store.
// This injects the proper middleware in the proper situtations.
export const configureStore = () => {
  const middleware = [thunk, promiseMiddleware];

  // logger is used if we are in development mode
  if (__DEV__) {
    middleware.push(createLogger());
  }

  return createStore(
    combineReducers({
      currentUser,
      roundsDisplay,
      golfCourseList,
      golfCourseLookup,
      golfPropertiesLookup,
      golfPropertiesList,
      roundsList,
      roundLookup,
      playerList,
      playerLookup,
      followers,
      following,
      teeSetCourseLookup,
      teeSetList,
      teeSetLookup,
      feed,
      feedLoading,
      currentRoundId
    }),
    applyMiddleware(...middleware),
    compose(autoRehydrate())
  );
};

// Build the store
let store = configureStore();

const configurePersist = () =>
  persistStore(store, {
    storage: AsyncStorage
  });
export let persistControl = configurePersist();
export const getStore = () => store;
export const getState = () => store.getState();

export const resetStore = () => {
  if (persistControl) {
    persistControl.pause();
    persistControl.purge();
    store.dispatch({
      type: "RESET_ALL"
    });
    persistControl.resume();
  }
};
