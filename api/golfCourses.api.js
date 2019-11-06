import { RESOURCE_CONSTANTS } from "./resourceConstants.api";
import { getAll, getWhere, create, update } from "./base.api";
import firebase from "react-native-firebase";

const DEBUG = true;

const getGolfCourseImageRef = golfCourseId => {
  return `/golfCourses/${golfCourseId}/courseImage.jpg`;
};

export const getGolfCourses = async () => {
  let propertiesSnapshot = await getAll(RESOURCE_CONSTANTS.GOLF_COURSES);
  let listOut = [];
  let lookupOut = {};

  propertiesSnapshot.forEach(async doc => {
    let docData = { ...doc.data(), id: doc.id };
    listOut.push(docData);
    lookupOut[doc.id] = docData;

    let holesSnapshot = await getGolfHolesForCourse(doc.id);

    holesSnapshot.forEach(async holeDoc => {});
  });

  return {
    list: listOut,
    lookup: lookupOut
  };
};

// can get course holes now
export const getGolfHolesForCourse = async courseId => {
  let courseRef = firebase
    .firestore()
    .collection(RESOURCE_CONSTANTS.GOLF_COURSES)
    .doc(courseId);

  let holesRef = courseRef.collection(RESOURCE_CONSTANTS.COURSE_HOLES);
  return await holesRef
    .get()
    .then(querySnapshot => {
      if (querySnapshot) {
        return querySnapshot;
      } else {
        return null;
      }
    })
    .catch(error => {
      return error;
    });
};

export const saveNewCourseAPI = async newCourseObject => {
  let cleanedObject = cleanCourseInfo(newCourseObject);
  let newCourseId = await create(
    RESOURCE_CONSTANTS.GOLF_COURSES,
    cleanedObject
  );

  if (cleanedObject.imageUrl) {
    let courseImageUploadResponse = await uploadGolfCourseImageAPI(
      newCourseId,
      cleanedObject.imageUrl
    );
    let newCourseImageUrl = courseImageUploadResponse.downloadURL;
    await update(RESOURCE_CONSTANTS.GOLF_COURSES, newCourseId, {
      imageUrl: newCourseImageUrl
    });
  }

  return newCourseId;
};

const uploadGolfCourseImageAPI = async (courseId, uri) => {
  let ref = firebase.storage().ref(getGolfCourseImageRef(courseId));
  return await ref.putFile(uri);
};

const cleanCourseInfo = rawInfo => {
  return {
    confirmed: false,
    golfPropertyId: null,
    courseName: "",
    par: "",
    slope: "",
    imageUrl: "",
    ...rawInfo
  };
};
