import { create, getAll } from "./base.api";
import { RESOURCE_CONSTANTS } from "./resourceConstants.api";
import firebase from "react-native-firebase";

const DEBUG = true;

// create new for course
export const saveNewTeeSetAPI = async newTeeSetObject => {
  let cleanedTeeSet = cleanTeeSetInfo(newTeeSetObject);
  let newTeeSetId = await create(RESOURCE_CONSTANTS.TEE_SET, cleanedTeeSet);

  return newTeeSetId;
};

// get all
export const getAllTeeSetsAPI = async () => {
  const teesSnapshot = await getAll(RESOURCE_CONSTANTS.TEE_SET);
  let listOut = [];
  let lookupOut = {};
  let lookupByCourseOut = {};

  teesSnapshot.forEach(doc => {
    let docData = { ...doc.data(), id: doc.id };
    listOut.push(docData);
    lookupOut[docData.id] = docData;
    if (!lookupByCourseOut[docData.golfCourseId]) {
      lookupByCourseOut[docData.golfCourseId] = {};
    }
    lookupByCourseOut[docData.golfCourseId][docData.teeSetName] = docData;
  });

  return {
    list: listOut,
    lookup: lookupOut,
    lookupByCourseOut
  };
};

// get all for course
export const getTeesForCourseAPI = async courseId => {
  return await firebase
    .firestore()
    .collection(RESOURCE_CONSTANTS.TEE_SET)
    .where("golfCourseId", "==", courseId)
    .get()
    .then(querySnapshot => {
      if (querySnapshot) {
        return querySnapshot.docs;
      } else {
        return null;
      }
    })
    .catch(error => {
      return error;
    });
};

const cleanTeeSetInfo = rawInfo => {
  return {
    confirmed: false,
    ...rawInfo
  };
};
