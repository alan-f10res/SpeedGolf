import firebase from "react-native-firebase";

export const getCurrentUserId = () => {
  return firebase.auth().currentUser.toJSON().uid;
};
