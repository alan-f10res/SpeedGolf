import { update } from "./base.api";
import { RESOURCE_CONSTANTS } from "./resourceConstants.api";

export const updateLikedByList = async (roundId, newLikedByList) => {
  await update(RESOURCE_CONSTANTS.ROUNDS, roundId, {
    likedBy: newLikedByList
  })
    .then(() => {
      return newLikedByList;
    })
    .catch(error => {
      console.warn("Error: ", error);
    });
};
