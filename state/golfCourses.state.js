import { getGolfCourses } from "../api/golfCourses.api";

const ACTIONS = {
  LOAD_GOLF_COURSES: "load-golf-courses"
};
export const golfCourseList = (state = [], action = {}) => {
  switch (action.type) {
    case ACTIONS.LOAD_GOLF_COURSES:
      return action.golfCoursesList;
    default:
      return state;
  }
};

export const golfCourseLookup = (state = {}, action = {}) => {
  switch (action.type) {
    case ACTIONS.LOAD_GOLF_COURSES:
      return action.golfCoursesLookup;
    default:
      return state;
  }
}

export const loadAllGolfCourses = () => async dispatch => {
  await getGolfCourses().then(golfCourses => {
    dispatch({
      type: ACTIONS.LOAD_GOLF_COURSES,
      golfCoursesList: golfCourses.list,
      golfCoursesLookup: golfCourses.lookup
    });
  });
};
