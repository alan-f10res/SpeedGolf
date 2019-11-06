import React, { Component } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";

import { STYLES } from "../../styles/styles";
import { LikeButton } from "../sharedComponents/likeButton";
import { CommentButton } from "../comments/commentButton";

export class RoundPostedCard extends Component {
  getPlayerName = () => {
    const playerId = this.props.playerId;
    const playerObject = this.props.playerLookup[playerId];
    if (playerObject) {
      return `${playerObject.firstName} ${playerObject.lastName}`;
    }
  };

  getCourseName = () => {
    const { golfCourseId, golfCourseLookup, golfPropertiesLookup } = this.props;
    const golfCourse = golfCourseLookup[golfCourseId];
    if (!golfCourse) {
      return `Invalid round, please delete: ${this.props.roundId}`;
    }
    const golfPropertyId = golfCourse.golfPropertyId;
    const golfProperty = golfPropertiesLookup[golfPropertyId];

    return `${golfProperty.propertyName} - ${golfCourse.courseName}`;
  };

  goToProfilePage = () => {
    console.log("pressed go to profile");
    Actions.profilePage({
      id: this.props.playerId
    })
  };

  render() {
    return (
      <View style={[STYLES.feedCardContainer, this.props.style]}>
        <View style={STYLES.imageContainer}>
          {this.props.imageUrl ? (
            <Image
              source={{ uri: this.props.imageUrl }}
              style={STYLES.imageStyle}
            />
          ) : (
            <Image
              source={require("../../images/golferBig.jpg")}
              style={STYLES.imageStyle}
              resizeMode={"contain"}
            />
          )}
        </View>
        <View style={STYLES.textSection}>
          <View
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "space-between"
            }}
          >
            <Text style={STYLES.bodyText}>
              <Text
                style={{ fontWeight: "bold" }}
                onPress={this.goToProfilePage}
              >
                {this.getPlayerName()}{" "}
              </Text>
              posted a round
            </Text>
            <Text style={STYLES.bodyText}>
              SGS: {this.props.speedgolfScore} ({this.props.totalStrokes}{" "}
              strokes in {this.props.totalTime})
            </Text>
            <Text style={STYLES.bodyText}>{this.props.dateTime}</Text>
            <Text style={[STYLES.bodyText, { fontStyle: "italic" }]}>
              {this.getCourseName()}
            </Text>
            <View
              style={{
                flex: 0,
                flexDirection: "row",
                justifyContent: "space-between",
                marginVertical: 8
              }}
            >
              <LikeButton
                likeCount={this.props.likeCount || 0}
                userId={this.props.currentUser.id}
                likedBy={this.props.likedBy}
                roundId={this.props.roundId}
                dispatch={this.props.dispatch}
              />
              <View style={{ width: 5 }} />
              <CommentButton
                comments={this.props.comments}
                roundId={this.props.roundId}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    currentUser: state.currentUser,
    playerLookup: state.playerLookup,
    golfPropertiesLookup: state.golfPropertiesLookup,
    golfCourseLookup: state.golfCourseLookup
  };
};

RoundPostedCard = connect(mapStateToProps)(RoundPostedCard);
