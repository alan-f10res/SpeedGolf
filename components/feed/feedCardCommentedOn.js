import React, { Component } from "react";
import { View, Image, Text } from "react-native";
import { connect } from "react-redux";
import moment from "moment";

import { STYLES } from "../../styles/styles";

export class CommentedOn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recipient: "Scott"
    };
  }
  render() {
    let commentor = this.props.playerLookup[this.props.commentorId];
    let commentorName =
      commentor && `${commentor.firstName} ${commentor.lastName}`;
    let imageUrl = commentor && commentor.profileImageURI;

    return (
      <View style={STYLES.feedCardContainer}>
        <View style={STYLES.imageContainer}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={STYLES.imageStyle} />
          ) : (
            <Image
              source={require("../../images/genericGolfCourse.jpeg")}
              style={STYLES.imageStyle}
              resizeMode="contain"
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
              <Text style={{ fontWeight: "bold" }}>{commentorName} </Text>
              commented: {this.props.content}
            </Text>
            <Text style={STYLES.bodyText}>
              {moment(this.props.createdAt).fromNow()}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    playerLookup: state.playerLookup
  };
};

CommentedOn = connect(mapStateToProps)(CommentedOn);
