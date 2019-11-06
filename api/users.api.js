import { get, getAll, update } from "./base.api";
import { RESOURCE_CONSTANTS } from "./resourceConstants.api";
import { uploadProfileImageAPI } from "./images.api";

export const getUserDetails = async id => {
  return await get(RESOURCE_CONSTANTS.USERS, id);
};

export const createUser = async ({
  id,
  firstName,
  lastName,
  email,
  username,
  profileImageURI
}) => {
  let newUserObject = {
    firstName,
    lastName,
    email,
    username,
    profileImageURI
  };

  if (profileImageURI) {
    await uploadProfileImageAPI(profileImageURI, id).then(response => {
      let uploadedProfileImage = response.downloadURL;
      newUserObject[profileImageURI] = uploadedProfileImage;
    });
  }

  return await update(RESOURCE_CONSTANTS.USERS, id, newUserObject);
};

export const updateUser = async (id, updateObject, newImageURI = null) => {
  if (newImageURI) {
    const imageUploadResponse = await uploadProfileImageAPI(newImageURI, id);
    updateObject.profileImageURI = imageUploadResponse.downloadURL;
  }

  return await update(RESOURCE_CONSTANTS.USERS, id, updateObject);
};

export const getAllUsers = async () => {
  let playersSnapshot = await getAll(RESOURCE_CONSTANTS.USERS);
  let listOut = [];
  let lookupOut = {};

  playersSnapshot.forEach(doc => {
    let docData = { ...doc.data(), id: doc.id };
    listOut.push(docData);
    lookupOut[doc.id] = docData;
  });

  return {
    list: listOut,
    lookup: lookupOut
  };
};
