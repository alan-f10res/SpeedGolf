import firebase from "react-native-firebase";
import { getCurrentUserId } from "../lib/userUtility";

const DEBUG = true;

export const get = async (resource, id) => {
  return await firebase
    .firestore()
    .collection(resource)
    .doc(id)
    .get()
    .then(result => {
      if (DEBUG) {
        // console.log('get result = ', result)
        // console.log('get result.exists = ', result.exists)
        // console.log('get result.data() = ', result.data())
      }
      if (result.exists) {
        return result.data();
      } else {
        return null;
      }
    })
    .catch(error => {
      return error;
    });
};

export const getAll = async resource => {
  if (DEBUG) {
  }
  return await firebase
    .firestore()
    .collection(resource)
    .get()
    .then(querySnapshot => {
      if (DEBUG) {
      }
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

export const getAllForCurrentUser = async resource => {
  const userId = getCurrentUserId();

  return await firebase
    .firestore()
    .collection(resource)
    .where("userId", "==", userId)
    // .orderBy("datePlayed", "desc") // todo put this in once you've added an index to firestore
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

export const getWhere = async (resource, fieldPath, operation, soughtValue) => {
  return await firebase
    .firestore()
    .collection(resource)
    .where(fieldPath, operation, soughtValue)
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

export const create = async (resource, newObject) => {
  return await firebase
    .firestore()
    .collection(resource)
    .add(newObject)
    .then(async docRef => {
      return docRef.id;
    })
    .catch(error => {
      return error;
    });
};

export const update = async (resource, id, updatedObject) => {
  return await firebase
    .firestore()
    .collection(resource)
    .doc(id)
    .set(updatedObject, { merge: true })
    .then(() => {
      return null;
    })
    .catch(error => {
      return error;
    });
};

// same as update, except merge is off
export const replace = async (resource, id, updatedObject) => {
  return await firebase
    .firestore()
    .collection(resource)
    .doc(id)
    .set(updatedObject)
    .then(() => {
      return null;
    })
    .catch(error => {
      return error;
    });
};

export const destroy = async (resource, id) => {
  return await firebase
    .firestore()
    .collection(resource)
    .doc(id)
    .delete()
    .then(() => {})
    .catch(error => {});
};
