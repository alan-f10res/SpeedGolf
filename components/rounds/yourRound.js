import React, { Component } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";

import { COLORS } from "../../styles/colors";
import { CommentButton } from "../comments/commentButton";
import { formatDate } from "../../lib/formatters";

export class YourRound extends Component {
  getRoundComments = () => {
    const { id, roundLookup } = this.props;
    const round = roundLookup[id];
    return round.comments;
  };

  render() {
    const {
      id,
      key,
      roundLookup,
      golfCourseLookup,
      golfPropertiesLookup
    } = this.props;
    if (!id || !roundLookup || !golfCourseLookup) {
      return null;
    }

    const roundData = roundLookup[id];

    if (!roundData) {
      console.warn("No round data yet");
      return null;
    }
    const {
      imageUrl,
      roundType,
      golfCourseId,
      roundComment,
      scoreCardType,
      totalStrokes,
      totalMinutes,
      totalSeconds,
      fairwaysInRegulation,
      greensInRegulation,
      puttsTaken,
      heartRate,
      elevationGain,
      exertionLevel,
      scores,
      speedgolfScore,
      totalTime,
      datePlayed
    } = roundData;

    const golfCourse = golfCourseLookup[golfCourseId];
    if (!golfCourse) {
      return null;
    }
    const golfProperty = golfPropertiesLookup[golfCourse.golfPropertyId];

    return (
      <TouchableOpacity
        style={styles.feedCardContainer}
        key={key}
        onPress={() =>
          Actions.roundSummaryFullPage({
            roundId: id
          })
        }
      >
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.imageStyle} />
          ) : (
            <Image
              source={require("../../images/golferMedium.jpg")}
              style={styles.imageStyle}
            />
          )}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.bodyText, { fontWeight: "bold" }]}>
            {speedgolfScore} ({totalStrokes} strokes in {totalTime})
          </Text>
          <Text style={[styles.bodyText, { fontStyle: "italic" }]}>
            {golfProperty && golfProperty.propertyName} -{" "}
            {golfCourse && golfCourse.courseName}
          </Text>
          <Text style={styles.bodyText}>
            {formatDate(datePlayed) || "Unknown Date"}
          </Text>
          <View
            style={{
              flex: 0,
              flexDirection: "row",
              marginVertical: 8
            }}
          >
            <CommentButton comments={this.getRoundComments()} roundId={id} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = state => {
  return {
    roundLookup: state.roundLookup,
    golfCourseLookup: state.golfCourseLookup,
    golfPropertiesLookup: state.golfPropertiesLookup
  };
};

YourRound = connect(mapStateToProps)(YourRound);

const styles = StyleSheet.create({
  feedCardContainer: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    backgroundColor: COLORS.pureWhite,
    flex: 1,
    flexDirection: "row",
    minHeight: 150
  },
  imageContainer: {
    width: "30%",
    borderColor: "grey",
    borderWidth: 0,
    padding: 8,
    overflow: "hidden"
  },
  imageStyle: {
    flex: 1,
    height: undefined,
    width: 250,
    aspectRatio: 1
  },
  textContainer: {
    padding: 8,
    flex: 1,
    flexDirection: "column"
  },
  bodyText: {
    fontSize: 16,
    paddingVertical: 2
  }
});
