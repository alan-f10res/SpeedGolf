import { get, getAll, getWhere } from "./base.api";
import { RESOURCE_CONSTANTS } from "./resourceConstants.api";
import { formatDate } from "../lib/formatters";

export const FEED_ITEM_TYPE = {
  ROUND_LOGGED: "round-logged",
  COMMENT_POSTED: "comment-posted"
};

export const getRoundsForListOfUserAPI = async (listOfUserIds = []) => {
  let listOut = [];
  let lookupOut = {};

  for (let i = 0; i < listOfUserIds.length; i++) {
    let userId = listOfUserIds[i];
    let usersRoundsSnapshot = await getWhere(
      RESOURCE_CONSTANTS.ROUNDS,
      "userId",
      "==",
      userId
    );

    usersRoundsSnapshot.forEach(doc => {
      let docData = {
        ...doc.data(),
        feedItemType: FEED_ITEM_TYPE.ROUND_LOGGED,
        id: doc.id
      };
      listOut.push(docData);
      lookupOut[doc.id] = docData;
    });
  }

  return {
    list: listOut,
    lookup: lookupOut
  };
};

export const getCommentsForListOfUsersAPI = async (listOfUserIds = []) => {
  let listOut = [];
  let lookupOut = {};

  for (let i = 0; i < listOfUserIds.length; i++) {
    let userId = listOfUserIds[i];
    let usersRoundsSnapshot = await getWhere(
      RESOURCE_CONSTANTS.COMMENTS,
      "userId",
      "==",
      userId
    );

    usersRoundsSnapshot.forEach(doc => {
      let docData = {
        ...doc.data(),
        feedItemType: FEED_ITEM_TYPE.COMMENT_POSTED,
        id: doc.id
      };
      listOut.push(docData);
      lookupOut[doc.id] = docData;
    });
  }

  return {
    list: listOut,
    lookup: lookupOut
  };
};
