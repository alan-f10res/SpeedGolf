import { get, getWhere, update, create } from "./base.api";
import { RESOURCE_CONSTANTS } from "./resourceConstants.api";
import firebase from "react-native-firebase";
// post a review

const cleanReviewObject = rawReviewObject => {
  // authorId
  // authorName
  // authorAvatarUri
  // reviewText
  // createdAt
  // courseId
  // ratingSpeedgolfFriendliness
  // ratingGolfChallenge
  // ratingRunningChallenge
  // ratingOverall - this is the one we will average into the community rating

  return {
    ...rawReviewObject
  };
};

export const updateReviewAPI = async reviewObject => {
  let cleanedReview = cleanReviewObject(reviewObject);

  let updatedReviewId = await update(
    RESOURCE_CONSTANTS.REVIEWS,
    reviewObject.id,
    cleanedReview
  );

  await updateReviewMetaData(reviewObject.courseId, reviewObject.ratingOverall);

  return updatedReviewId;
};

export const saveNewReviewAPI = async reviewObject => {
  let cleanedReview = cleanReviewObject(reviewObject);
  let newReviewId = await create(RESOURCE_CONSTANTS.REVIEWS, cleanedReview);

  await updateReviewMetaData(reviewObject.courseId, reviewObject.ratingOverall);

  return newReviewId;
};

const updateReviewMetaData = async (courseId, newRating) => {
  if (!newRating) {
    return;
  }

  // get course object
  let course = await get(RESOURCE_CONSTANTS.GOLF_COURSES, courseId);
  let reviewsSnapshot = await getWhere(
    RESOURCE_CONSTANTS.REVIEWS,
    "courseId",
    "==",
    courseId
  );

  let totalRating = 0;
  let totalRatingCount = 0;

  reviewsSnapshot.forEach(doc => {
    let reviewData = doc.data();

    totalRating += reviewData.ratingOverall;
    totalRatingCount += 1;
  });

  let averageRating = (totalRating / totalRatingCount).toFixed(1);

  // update course object
  await update(RESOURCE_CONSTANTS.GOLF_COURSES, courseId, {
    reviewCount: totalRatingCount,
    averageRating: averageRating
  });
};

// get reviews where courseId = x
export const getReviewsForCourse = async courseId => {
  return await firebase
    .firestore()
    .collection(RESOURCE_CONSTANTS.REVIEWS)
    .where("courseId", "==", courseId)
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

// get reviews where authorId in [friendGroup]
