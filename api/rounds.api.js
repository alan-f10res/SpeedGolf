import { get, create, update, getAllForCurrentUser, destroy } from "./base.api";
import { RESOURCE_CONSTANTS } from "./resourceConstants.api";
import firebase from "react-native-firebase";

export const createRound = async roundParams => {
  let cleanedRoundObject = cleanRoundObject(roundParams);
  let newRoundId = await create(RESOURCE_CONSTANTS.ROUNDS, cleanedRoundObject);

  if (cleanedRoundObject.imageUrl) {
    await uploadRoundImageAPI(newRoundId, cleanedRoundObject.imageUrl).then(
      async downloadURL => {
        // console.log("downloadURL = ", downloadURL);
        // console.log("newRoundId = ", newRoundId);
        await update(RESOURCE_CONSTANTS.ROUNDS, newRoundId, {
          imageUrl: downloadURL
        });
      }
    );
  }

  return newRoundId;
};

export const updateRound = async roundParams => {
  let existingRound;
  await get(RESOURCE_CONSTANTS.ROUNDS, roundParams.id)
    .then(existingResponse => {
      // console.log("got existingResponse = ", existingResponse);
      existingRound = existingResponse;
      return existingResponse;
    })
    .catch(getError => {
      // console.log("get round error: ", getError);
      return getError;
    });
  // console.log("update path existingRound = ", existingRound);

  if (existingRound && existingRound.imageUrl !== roundParams.imageUrl && roundParams.imageUrl) {
    await uploadRoundImageAPI(roundParams.id, roundParams.imageUrl)
      .then(async downloadURL => {
        roundParams.imageUrl = downloadURL;
      })
      .catch(error => {
      });
  }

  await update(RESOURCE_CONSTANTS.ROUNDS, roundParams.id, roundParams);

  return roundParams.id;
};

const cleanRoundObject = roundParams => {
  return {
    ...roundParams,
    likedBy: [],
    comments: []
  };
};
const roundImageRef = roundId => {
  return `/rounds/${roundId}/roundImage.jpg`;
};

const uploadRoundImageAPI = async (roundId, uri) => {
  let ref = firebase.storage().ref(roundImageRef(roundId));
  return await ref
    .putFile(uri)
    .then(response => {

      return response.downloadURL;
    })
    .catch(error => {

      return error;
    });
};

export const getRound = roundId => {};

export const getRoundsForUser = async (userId) => {
  let roundsSnapshot = await getAllForCurrentUser(RESOURCE_CONSTANTS.ROUNDS, userId);

  let listOut = [];
  let lookupOut = {};

  roundsSnapshot.forEach(doc => {
    let docData = { ...doc.data(), id: doc.id };
    listOut.push(docData);
    lookupOut[doc.id] = docData;
  });

  return {
    list: listOut,
    lookup: lookupOut
  };
};

export const deleteRound = async roundId => {
  return await destroy(RESOURCE_CONSTANTS.ROUNDS, roundId);
};
