import React, { Component } from "react";
import { View, Text, StatusBar, ScrollView, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { STYLES } from "../../styles/styles";
import { FloatingActionButton } from "../sharedComponents/floatingActionButton";
import { CourseCard } from "./courseCard";
import { COLORS } from "../../styles/colors";
import { SearchBar, Button } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { flattenPropertiesAndCourses } from "../../lib/courseUtility";

export class Courses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSearch: false,
      query: ""
    };
  }

  resetSearchQuery = () => {
    this.updateSearchQuery("");
  };

  updateSearchQuery = newQuery => {
    this.setState({
      query: newQuery
    });
  };

  getDisplayedCourses = () => {
    let { courseList } = this.props;
    let { query } = this.state;

    if (!query) {
      return courseList;
    }

    let coursesOut = [];
    query = query.toLowerCase();

    for (let i = 0; i < courseList.length; i++) {
      let course = courseList[i];
      let courseString = (
        course.courseName +
        course.propertyName +
        course.fullAddress
      ).toLowerCase();

      if (courseString.indexOf(query) > -1) {
        coursesOut.push(course);
      }
    }

    return coursesOut;
  };

  getCoursesEmptyState = () => {
    return (
      <ScrollView
        style={{
          width: "100%"
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 20
          }}
        >
          <Text>No courses found for query "{this.state.query}"</Text>
          <Button
            buttonStyle={{ minWidth: 200 }}
            onPress={() => {
              this.resetSearchQuery();
              this.search.clearText();
            }}
            title="Clear Search"
          />

          <Button
            buttonStyle={{ minWidth: 200 }}
            onPress={() => {
              this.resetSearchQuery();
              Actions.suggestACourse();
            }}
            title="Suggest a Course"
            backgroundColor={COLORS.blue}
          />
        </View>
      </ScrollView>
    );
  };

  launchDetailCard = course => {
                                 return null;
                                 // todo when courseDetailCard is ready, link this up again
                                 // let { id } = course;
                                 //
                                 // Actions.courseDetailCard({
                                 //   id,
                                 //   imageUrl: this.state.imageUrl,
                                 //   course
                                 // });
                               };

  mapFilteredCoursesToRows = filteredCourses => {
    return (
      <ScrollView
        style={{
          width: "100%"
        }}
      >
        {filteredCourses.map(course => {
          return (
            <CourseCard
              key={course.id}
              id={course.id}
              courseName={course.courseName}
              propertyName={course.propertyName}
              imageUrl={course.imageUrl}
              fullAddress={course.fullAddress}
              onSelectCallback={() => this.launchDetailCard(course)}
            />
          );
        })}
      </ScrollView>
    );
  };

  render() {
    const { courseList } = this.props;
    const { showSearch, query } = this.state;
    const filteredCourses = this.getDisplayedCourses();

    return (
      <View style={STYLES.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.coursesHeaderContainer}>
          <Text style={styles.coursesHeaderText}>
            {courseList.length} Courses in Speedgolf Database:
          </Text>
          {showSearch ? (
            <SearchBar
              ref={search => (this.search = search)}
              autoCorrect={false}
              lightTheme
              onChangeText={newText => this.updateSearchQuery(newText)}
              onClearText={() => {
                if (query) {
                  this.resetSearchQuery();
                } else {
                  this.setState({
                    showSearch: false
                  });
                }
              }}
              placeholder="Search courses"
              clearIcon={{ color: "#86939e", name: "close" }}
              containerStyle={{
                backgroundColor: "white",
                borderWidth: 0
              }}
              inputStyle={{
                borderWidth: 0
              }}
              style={{
                borderWidth: 0
              }}
            />
          ) : null}
        </View>
        {filteredCourses.length > 0
          ? this.mapFilteredCoursesToRows(filteredCourses)
          : this.getCoursesEmptyState()}
        <FloatingActionButton
          iconName="search"
          fabCallback={() =>
            this.setState({ showSearch: !this.state.showSearch })
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  coursesHeaderContainer: {
    width: "100%",
    padding: 16,
    justifyContent: "flex-start",
    backgroundColor: COLORS.pureWhite,
    borderBottomColor: COLORS.lightGrey,
    borderBottomWidth: 0.5
  },
  coursesHeaderText: {
    color: COLORS.blue,
    textAlign: "left",
    fontSize: 18,
    fontWeight: "bold"
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

Courses = connect(mapStateToProps)(Courses);
