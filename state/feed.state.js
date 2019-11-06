import {
  getRoundsForListOfUserAPI,
  getCommentsForListOfUsersAPI,
  FEED_ITEM_TYPE
} from "../api/feed.api";
import { convertDateArrayToMoment } from "../lib/formatters";
import moment from "moment";
import { loadFollowers } from "./follows.state";
import { getCurrentUserId } from "../lib/userUtility";

const FEED_ACTIONS = {
  LOAD_FEED: "load-feed",
  START_FEED_LOADING: "start-feed-loading",
  END_FEED_LOADING: "end-feed-loading"
};

export const feed = (state = [], action = {}) => {
  switch (action.type) {
    case FEED_ACTIONS.LOAD_FEED:
      return action.feedList;
    case "RESET_ALL":
      return [];
    default:
      return state;
  }
};

export const feedLoading = (state = true, action = {}) => {
  switch (action.type) {
    case FEED_ACTIONS.END_FEED_LOADING:
    case FEED_ACTIONS.LOAD_FEED:
      return false;
    case FEED_ACTIONS.START_FEED_LOADING:
      return true;
    case "RESET_ALL":
      return false;
    default:
      return state;
  }
};

export const setFeedLoading = () => dispatch => {
  dispatch({
    type: FEED_ACTIONS.START_FEED_LOADING
  });
};

export const endFeedLoading = () => dispatch => {
  dispatch({
    type: FEED_ACTIONS.END_FEED_LOADING
  });
};

const convertTimeToMilliseconds = feedItem => {
  return feedItem.feedItemType === FEED_ITEM_TYPE.ROUND_LOGGED
    ? convertDateArrayToMoment(feedItem.datePlayed).valueOf()
    : moment(feedItem.createdAt).valueOf();
};

export const getFeedForCurrentUser = unsortedRoundFeedItems => async dispatch => {
  let listOut = [...unsortedRoundFeedItems.list];

  let sortedListOut = listOut.sort((a, b) => {
    const aMilli = convertTimeToMilliseconds(a);
    const bMilli = convertTimeToMilliseconds(b);

    if (aMilli > bMilli) {
      return -1;
    } else if (bMilli > aMilli) {
      return 1;
    } else {
      return 0;
    }
  });

  dispatch({
    type: FEED_ACTIONS.LOAD_FEED,
    feedList: sortedListOut
  });
};
