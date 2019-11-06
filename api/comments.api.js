import { create, get, update } from "./base.api";
import { RESOURCE_CONSTANTS } from "./resourceConstants.api";

export const createCommentOnRoundAPI = async commentParams => {
  let cleanedComment = cleanComment(commentParams);

  // create new comment
  let newCommentId = await create(RESOURCE_CONSTANTS.COMMENTS, cleanedComment);
  let oldRoundRef = await get(
    RESOURCE_CONSTANTS.ROUNDS,
    commentParams.parentId
  );
  let oldComments = oldRoundRef.comments;
  let newCommentObject = {
    ...commentParams,
    id: newCommentId
  };
  let newRoundComments = [...oldComments, newCommentObject];

  await update(RESOURCE_CONSTANTS.ROUNDS, commentParams.parentId, {
    comments: newRoundComments
  });

  return newCommentId;
};

const cleanComment = commentParams => {
  return {
    ...commentParams
  };
};

export const updateComment = async (id, newCommentObject) => {
  let oldRoundRef = await get(
    RESOURCE_CONSTANTS.ROUNDS,
    newCommentObject.parentId
  );

  let oldComments = oldRoundRef.comments;
  // remove old comment

  let oldCommentIndex = oldComments.findIndex(
    el => el.id === newCommentObject.id
  );
  oldComments.splice(oldCommentIndex);

  let newRoundComments = [...oldComments, newCommentObject];

  await update(RESOURCE_CONSTANTS.ROUNDS, newCommentObject.parentId, {
    comments: newRoundComments
  });

  return id;
};
