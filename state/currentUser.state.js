import { getUserDetails, updateUser } from "../api/users.api";
import { uploadProfileImageAPI } from "../api/images.api";
import { loadAllGolfProperties } from "./golfProperties.state";
import { loadAllGolfCourses } from "./golfCourses.state";
import { loadRounds } from "./rounds.state";
import { loadAllPlayers } from "./players.state";
import { loadFollowers, loadFollowing } from "./follows.state";
import { loadTeeSets } from "./teeSets.state";
import {
  endFeedLoading,
  getFeedForCurrentUser,
  setFeedLoading
} from "./feed.state";

import { Actions } from "react-native-router-flux";
import { getCurrentUserId } from "../lib/userUtility";
import { getUserFollowers, getUserFollowing } from "../api/follows.api";
import { getRoundsForUser } from "../api/rounds.api";
import {
  getCommentsForListOfUsersAPI,
  getRoundsForListOfUserAPI
} from "../api/feed.api";

const ACTIONS = {
  SET_CURRENT_USER: "set-current-user",
  SET_PROFILE_IMAGE_URL: "set-profile-image-url",
  UPDATE_CURRENT_USER: "update-current-user"
};
export const currentUser = (state = {}, action = {}) => {
  switch (action.type) {
    case ACTIONS.SET_CURRENT_USER:
      return action.userObject;
    case ACTIONS.UPDATE_CURRENT_USER:
      return {
        ...state,
        ...action.newTraits
      };
    case ACTIONS.SET_PROFILE_IMAGE_URL:
      return {
        ...state,
        profileImageURI: action.profileImageURI
      };
    default:
      return state;
  }
};

export const setCurrentUser = userObject => dispatch => {
  dispatch({
    type: ACTIONS.SET_CURRENT_USER,
    userObject
  });
};

export const updateCurrentUser = newTraits => dispatch => {
  dispatch({
    type: ACTIONS.UPDATE_CURRENT_USER,
    newTraits
  });
};

export const refreshAppData = () => async dispatch => {
  const userId = getCurrentUserId();
  dispatch(setFeedLoading());

  const userDetails = await getUserDetails(userId);
  dispatch(updateCurrentUser(userDetails));

  const followers = await getUserFollowers(userId);
  const following = await getUserFollowing(userId);
  const rounds = await getRoundsForUser();
  const unsortedRoundFeedItems = await getRoundsForListOfUserAPI(following);

  dispatch(loadFollowers(followers));
  dispatch(loadFollowing(following));
  dispatch(loadRounds(rounds));
  dispatch(getFeedForCurrentUser(unsortedRoundFeedItems));

  dispatch(refreshCourseData());

  dispatch(endFeedLoading());
};

export const refreshCourseData = () => dispatch => {
  dispatch(loadAllGolfProperties());
  dispatch(loadAllGolfCourses());
  dispatch(loadTeeSets());
  dispatch(loadAllPlayers());
};

export const updateUserProfileImage = (uri, userId) => async dispatch => {
  await uploadProfileImageAPI(uri, userId)
    .then(response => {
      let newProfileUrl = response.downloadURL;

      dispatch({
        type: ACTIONS.SET_PROFILE_IMAGE_URL,
        profileImageURI: newProfileUrl
      });

      updateUser(userId, {
        profileImageURI: newProfileUrl
      });
    })
    .catch(error => {
      console.warn("Image Upload Error: ", error);
    });
};
