import { getAllForCurrentUser, update, replace, get } from "./base.api";
import { RESOURCE_CONSTANTS } from "./resourceConstants.api";

export const getUserFollowers = async userId => {
  let followerSnapshot = await get(RESOURCE_CONSTANTS.FOLLOWERS, userId);
  if (followerSnapshot) {
    let listOut = [];
    const docKeys = Object.values(followerSnapshot);

    for (let i = 0; i < docKeys.length; i++) {
      let followerId = docKeys[i];
      listOut.push(followerId);
    }
    return listOut;
  }
};

export const getUserFollowing = async userId => {
  let followingSnapshot = await get(RESOURCE_CONSTANTS.FOLLOWING, userId);
  if (followingSnapshot) {
    let listOut = [];
    const docKeys = Object.values(followingSnapshot);
    for (let i = 0; i < docKeys.length; i++) {
      let followingId = docKeys[i];
      listOut.push(followingId);
    }

    return listOut;
  }
};

export const addUserFollowsPlayerAPI = async (userId, followedIds) => {
  // pass new list
  // push new list to api using merge
  await update(RESOURCE_CONSTANTS.FOLLOWING, userId, followedIds)
    .then(() => {
      return followedIds;
    })
    .catch(error => {
      console.warn("Error: ", error);
    });
};

export const removeUserFollowsPlayerAPI = async (userId, followedIds) => {
  await replace(RESOURCE_CONSTANTS.FOLLOWING, userId, followedIds)
    .then(() => {
      return followedIds;
    })
    .catch(error => {
      console.warn("Error: ", error);
    });
};

export const addPlayerFollowedByUser = async (userId, playerId) => {
  let currentFollowers = await getUserFollowers(playerId);
  // get followers for player id
  // update the array with new one

  let newFollowers = currentFollowers
    ? [...currentFollowers, userId]
    : [userId];

  await update(RESOURCE_CONSTANTS.FOLLOWERS, playerId, newFollowers)
    .then(() => {
      return newFollowers;
    })
    .catch(error => {
      console.warn("Error: ", error);
    });
};
