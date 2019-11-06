import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";

import { COLORS } from "../../styles/colors";
import { MoreButton } from "./moreButton";
import { MapButton } from "./mapButton";
import { RequestTeeTimeButton } from "./requestTeeTimeButton";
import { FiveStarRating } from "../sharedComponents/fiveStarRating";

export class CourseCard extends Component {
  pluralCheck = itemCount => {
    if (itemCount === 0 || itemCount > 1 || !itemCount) {
      return "s";
    }
  };

  safeCallback = () => {
    let { onSelectCallback } = this.props;
    if (onSelectCallback && typeof onSelectCallback === "function") {
      onSelectCallback();
    }
  };

  attachPendingBanner = () => {
    return !this.props.golfCourse.confirmed ? (
      <View style={{ width: "100%", height: 20, backgroundColor: COLORS.blue }}>
        <Text
          style={{
            color: COLORS.pureWhite,
            textAlign: "center",
            fontWeight: "bold"
          }}
        >
          Course Under Review
        </Text>
      </View>
    ) : null;
  };

  render() {
    const { hideButtons, golfCourse, golfProperty } = this.props;
    return (
      <TouchableOpacity
        style={[styles.feedCardContainer, this.props.styleOverride]}
        onPress={this.safeCallback}
        key={this.props.id}
      >
        {golfCourse.imageUrl ? (
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: golfCourse.imageUrl }}
              style={styles.imageStyle}
              resizeMode="contain"
            />
          </View>
        ) : (
          <View style={styles.imageContainer}>
            <Image
              source={require("../../images/genericGolfCourse.jpeg")}
              style={styles.imageStyle}
              resizeMode="contain"
            />
          </View>
        )}

        <View style={styles.textContainer}>
          {this.attachPendingBanner()}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Text style={[styles.bodyText, { fontWeight: "bold" }]}>
              {golfProperty && golfProperty.propertyName
                ? `${golfProperty.propertyName} - `
                : null}
              {golfCourse.courseName}
            </Text>
            {this.props.onClearCallback ? (
              <TouchableOpacity
                onPress={this.props.onClearCallback}
                style={{ position: "absolute", right: 0, top: 0 }}
              >
                <Icon name="close" color={COLORS.blue} size={20} />
              </TouchableOpacity>
            ) : null}
          </View>

          <Text>{golfProperty && golfProperty.fullAddress}</Text>
          {!hideButtons ? (
            <View
              style={{
                flex: 0,
                flexDirection: "column",
                marginVertical: 8,
                justifyContent: "space-between"
              }}
            >
              <Text>
                <Text style={{ fontWeight: "bold" }}>Par:</Text>{" "}
                {golfCourse.par || "N/A"}
              </Text>
              <Text>
                <Text style={{ fontWeight: "bold" }}>Slope:</Text>{" "}
                {golfCourse.slope || "N/A"}
              </Text>
              <Text style={{ fontWeight: "bold" }}>Ratings:</Text>
            </View>
          ) : null}
          {!hideButtons ? (
            <View style={styles.reviewRow}>
              <Text style={styles.ratingText}>
                {golfCourse.averageRating || 0}
              </Text>
              <View style={styles.ratingIconsRow}>
                <FiveStarRating
                  communityRating={golfCourse.averageRating || 0}
                  starSize={20}
                />
              </View>
              <TouchableOpacity
                onPress={() =>
                  Actions.courseReviews({
                    courseId: golfCourse.id
                  })
                }
              >
                <Text style={{ textDecorationLine: "underline" }}>
                  ({golfCourse.reviewCount || "0"} Review
                  {this.pluralCheck(golfCourse.reviewCount)})
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {!hideButtons ? (
            <View style={styles.buttonsRow}>
              <MapButton />
              <RequestTeeTimeButton
                golfCourse={golfCourse}
                golfProperty={golfProperty}
                courseId={golfCourse.id}
              />
              <MoreButton
                moreCallback={() => {
                  Alert.alert("Starting in version 2.0, you'll be able to...");
                }}
              />
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const courseLookup = state.golfCourseLookup;
  const propertyLookup = state.golfPropertiesLookup;
  const id = ownProps.id;

  const golfCourse = courseLookup[id];
  if (golfCourse) {
    const golfPropertyId = golfCourse.golfPropertyId;
    const golfProperty = propertyLookup[golfPropertyId];
    return {
      golfCourse,
      golfProperty
    };
  } else {
    // to protect against case where the items were not reloaded fast enough
    console.warn(
      "Course could not be found in the list, returning empty course info for id ",
      id
    );
    return {
      golfCourse: {},
      golfProperty: {}
    };
  }
};

CourseCard = connect(mapStateToProps)(CourseCard);

const styles = StyleSheet.create({
  feedCardContainer: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    backgroundColor: COLORS.pureWhite,
    flexDirection: "row",
    height: 250,
    width: "100%"
  },
  imageContainer: {
    width: "40%",
    height: 250,
    borderColor: "grey",
    borderWidth: 0,
    padding: 8,
    overflow: "hidden",
    flex: 0
  },
  imageStyle: {
    flex: 1,
    height: 250,
    width: undefined,
    aspectRatio: 1
  },
  textContainer: {
    padding: 8,
    flex: 1,
    flexDirection: "column"
  },
  reviewRow: {
    flex: 0,
    flexDirection: "row",
    marginBottom: 8,
    justifyContent: "space-between",
    alignItems: "center"
  },
  buttonsRow: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8
  },
  bodyText: {
    fontSize: 16,
    paddingVertical: 2
  },
  ratingText: {
    color: COLORS.orange
  },
  ratingIconsRow: {
    flex: 0,
    flexDirection: "row"
  }
});
