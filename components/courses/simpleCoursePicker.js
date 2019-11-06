// NOTE: this is only for the Suggest a Course Form (so far)
// there is also an additional picker for "courses" called courseSelector.js (at the time of writing)
// which is really used to pick a hybrid property / course option

import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import Autocomplete from "react-native-autocomplete-input";

const otherOption = {
  id: 0,
  courseName: "Other"
};

export class SimpleCourseSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: ""
    };
  }

  filterData = query => {
    let { golfPropertyCourseList, golfCourseLookup } = this.props;

    if (!golfPropertyCourseList) {
      return [otherOption];
    }

    query = query.toLowerCase();
    let dataOut = [];

    golfPropertyCourseList.forEach((golfCourse, index) => {
      let rowDataString = golfCourse.courseName.toLowerCase();
      if (rowDataString.indexOf(query) > -1) {
        dataOut.push(golfCourse);
      }
    });
    dataOut.push(otherOption);
    return dataOut;
  };

  render() {
    const { query } = this.state;
    const { styleOverride } = this.props;
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
            renderItem={golfCourse => {
              return (
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    paddingLeft: 5
                  }}
                  onPress={() => {
                    this.props.selectCallback(golfCourse);
                    this.setState({
                      query: ""
                    });
                  }}
                >
                  <Text>{golfCourse.courseName}</Text>
                </TouchableOpacity>
              );
            }}
            placeholder="Select Property or Pick 'Other' to Enter a New Property"
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

const mapStateToProps = state => {
  let { golfCourseLookup } = state;

  return {
    golfCourseLookup
  };
};

SimpleCourseSelector = connect(mapStateToProps)(SimpleCourseSelector);
