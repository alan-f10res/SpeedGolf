export const flattenPropertiesAndCourses = (
  golfCourseList,
  golfPropertiesLookup
) => {
  let output = [];

  for (let i = 0; i < golfCourseList.length; i++) {
    let golfCourse = golfCourseList[i];
    let golfProperty = golfPropertiesLookup[golfCourse.golfPropertyId];

    // only show confirmed courses and properties

    let mergedObject = {
      ...golfProperty,
      ...golfCourse,
      id: golfCourse.id
    };

    output.push(mergedObject);
  }

  return output;
};
