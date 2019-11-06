import {
  addUserFollowsPlayerAPI,
  getUserFollowers,
  getUserFollowing,
  removeUserFollowsPlayerAPI,
  addPlayerFollowedByUser
} from "../api/follows.api";

const ACTIONS = {
  LOAD_FOLLOWERS: "load-followers",
  LOAD_FOLLOWING: "load-following",
  START_FOLLOWING_PLAYER: "start-following-player",
  UNFOLLOW_PLAYER: "unfollow-player"
};
export const followers = (state = [], action = {}) => {
  switch (action.type) {
    case ACTIONS.LOAD_FOLLOWERS:
      return action.followers;
    case "RESET_ALL":
      return [];
    default:
      return state;
  }
};

export const following = (state = [], action = {}) => {
  switch (action.type) {
    case ACTIONS.LOAD_FOLLOWING:
      return action.following;
    case ACTIONS.START_FOLLOWING_PLAYER:
      return [...state, action.playerId];
    case ACTIONS.UNFOLLOW_PLAYER:
      return action.newList;
    case "RESET_ALL":
      return [];
    default:
      return state;
  }
};

export const loadFollowers = followers => dispatch => {
  if (followers) {
    dispatch({
      type: ACTIONS.LOAD_FOLLOWERS,
      followers
    });
  }
};

export const loadFollowing = following => dispatch => {
  if (following) {
    dispatch({
      type: ACTIONS.LOAD_FOLLOWING,
      following
    });
  }
};

export const followPlayer = playerId => async (dispatch, getState) => {
  const state = getState();
  const userId = state.currentUser.id;
  const existingFollowing = state.following;
  if (existingFollowing.indexOf(playerId) >= 0) {
    return;
  }
  let newList = [...existingFollowing, playerId];

  await addUserFollowsPlayerAPI(userId, newList);
  await addPlayerFollowedByUser(userId, playerId);

  dispatch({
    type: ACTIONS.START_FOLLOWING_PLAYER,
    playerId
  });
};

export const unFollowPlayer = playerId => async (dispatch, getState) => {
  const state = getState();
  const userId = state.currentUser.id;
  const existingFollowing = state.following;

  let indexOfPlayer = existingFollowing.indexOf(playerId);

  if (!(indexOfPlayer >= 0)) {
    console.warn("Doesn't follow that player");
    return;
  }

  let newList = [...existingFollowing];
  newList.splice(indexOfPlayer, 1);

  await removeUserFollowsPlayerAPI(userId, newList);

  dispatch({
    type: ACTIONS.UNFOLLOW_PLAYER,
    newList
  });
};
