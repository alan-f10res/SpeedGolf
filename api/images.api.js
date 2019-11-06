import firebase from "react-native-firebase";
import { updateUser } from "./users.api";

const getProfileImageRef = userId => {
  return `/users/${userId}/profilePicture.jpg`;
};

export const createBucketReference = (bucketName, pathname) => {
  return `gs://${bucketName}/${pathname}`;
}
export const uploadProfileImageAPI = async (uri, userId) => {
  let ref = firebase.storage().ref(getProfileImageRef(userId));
  return await ref.putFile(uri);
};

export const retrieveProfilePicture = async userId => {
  let ref = firebase.storage().ref(getProfileImageRef(userId));
  return ref.getDownloadURL().then(url => {
    return url;
  });
};

const getCourseImageRef = courseId => {
  return `/golfCourses/${courseId}/courseImage.jpg`;
};

export const uploadCourseImage = async (uri, courseId) => {
  let ref = firebase.storage().ref(getCourseImageRef(courseId));
  await ref.putFile(uri).then(response => {
      let newCourseImageURL = response.downloadURL;
      return newCourseImageURL
    })
    .catch(error => {
      console.warn("Image Upload Error: ", error);
    });
}