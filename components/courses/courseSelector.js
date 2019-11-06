import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { connect } from "react-redux";
import { COLORS } from "../../styles/colors";
import { CourseCard } from "./courseCard";
import { Actions } from "react-native-router-flux";
import { flattenPropertiesAndCourses } from "../../lib/courseUtility";

const enterOwnOption = {
  id: 0,
  location: "",

  name: "Enter A Course"
};

export class CourseSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: ""
    };
  }

  filterData = query => {
    let { courseList } = this.props;

    if (!courseList) {
      return [enterOwnOption];
    }

    query = query.toLowerCase();
    let dataOut = [];

    let courseKeys = Object.keys(courseList);

    courseKeys.forEach((courseKey, index) => {
      let rowData = courseList[courseKey];
      let rowDataString = rowData.courseName + rowData.propertyName; // add back location search later
      rowDataString = rowDataString.toLowerCase();
      if (rowDataString.indexOf(query) > -1) {
        dataOut.push(rowData);
      }
    });
    dataOut.push(enterOwnOption);
    return dataOut;
  };

  render() {
    const { query } = this.state;
    const { onSelectCallback, styleOverride } = this.props;
    let data = this.filterData(query);

    return (
      <View style={styleOverride}>
        <View style={[styles.autocompleteContainer]}>
          <Autocomplete
            hideResults={!query || query.length === 0}
            autoCapitalize="none"
            autoCorrect={false}
            data={data}
            defaultValue={query}
            containerStyle={{ marginVertical: 10 }}
            onChangeText={text => this.setState({ query: text })}
            listStyle={{ position: "relative", zIndex: 4 }}
            renderItem={course => {
              if (course.id === 0) {
                return (
                  <TouchableOpacity
                    style={{
                      borderWidth: 1,
                      borderColor: COLORS.lightGrey,
                      backgroundColor: COLORS.pureWhite,
                      flexDirection: "row",
                      minHeight: 150,
                      width: "100%",
                      paddingHorizontal: 10
                    }}
                    onPress={() => {
                      Actions.suggestACourse({
                        submitCallback: suggestionObject => {
                          onSelectCallback(suggestionObject);
                        }
                      });
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        paddingVertical: 2,
                        fontWeight: "bold"
                      }}
                    >
                      Enter Unlisted Course
                    </Text>
                  </TouchableOpacity>
                );
              } else {
                return (
                  <CourseCard
                    id={course.id}
                    key={course.id}
                    onSelectCallback={() => {
                      onSelectCallback(course.id);
                    }}
                    courseName={course.courseName}
                    propertyName={course.propertyName}
                    imageUrl={course.imageUrl}
                    hideButtons={true}
                    courseObject={course}
                  />
                );
              }
            }}
            placeholder="Select Course or 'Other' To Enter a New Course"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: "relative",
    right: 0,
    top: 0,
    zIndex: 3
  },
  container: {
    backgroundColor: "#F5FCFF",
    flex: 1,
    paddingTop: 25
  },
  itemText: {
    fontSize: 15,
    margin: 2
  },
  descriptionContainer: {
    // `backgroundColor` needs to be set otherwise the
    // autocomplete input will disappear on text input.
    backgroundColor: "#F5FCFF",
    marginTop: 8
  },
  infoText: {
    textAlign: "center"
  },
  titleText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center"
  },
  directorText: {
    color: "grey",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center"
  },
  openingText: {
    textAlign: "center"
  }
});

const mapStateToProps = (state, ownProps) => {
  let { golfCourseList, golfPropertiesLookup } = state;

  let courseList = flattenPropertiesAndCourses(
    golfCourseList,
    golfPropertiesLookup
  );

  return {
    ...ownProps,
    courseList
  };
};

CourseSelector = connect(mapStateToProps)(CourseSelector);
