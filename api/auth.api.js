import firebase from "react-native-firebase";

export const createUserAuth = async (email, password) => {
  return await firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(apiResponse => {
      return apiResponse;
    })
    .catch(error => {
      return { error: error };
    });
};