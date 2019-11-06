import { RESOURCE_CONSTANTS } from "./resourceConstants.api";
import { getAll, create } from "./base.api";

export const getGolfProperties = async () => {
  let propertiesSnapshot = await getAll(RESOURCE_CONSTANTS.GOLF_PROPERTIES);
  let listOut = [];
  let lookupOut = {};

  propertiesSnapshot.forEach(doc => {
    let docData = { ...doc.data(), id: doc.id };
    listOut.push(docData);
    lookupOut[doc.id] = docData;
  });

  return {
    list: listOut,
    lookup: lookupOut
  };
};

export const saveNewGolfPropertyAPI = async newGolfPropertyObject => {
  let cleanedObject = cleanGolfProperty(newGolfPropertyObject);

  // create will return the id of the new object by default
  return await create(
    RESOURCE_CONSTANTS.GOLF_PROPERTIES,
    cleanedObject
  );
};

const cleanGolfProperty = rawInfo => {
  return {
    confirmed: false,
    propertyName: '',
    email: '',
    phone: '',
    website: '',
    fullAddress: '',
    geopoint: null,
    teeTimeUrl: '',
    ...rawInfo,
  };
};
