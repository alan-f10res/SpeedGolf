import React, { Component } from "react";
import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import moment from "moment";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { COLORS } from "../../styles/colors";
import Icon from "react-native-vector-icons/FontAwesome";

export class Comment extends Component {
  render() {
    // Pull comment object out of props
    const { comment, currentUser } = this.props;
    // Pull data needed to display a comment out of comment object
    const { content, createdAt, userId } = comment;

    const playerObject = this.props.playerLookup[userId];

    const avatar = playerObject.profileImageURI;
    const name = `${playerObject.firstName} ${playerObject.lastName}`;

    const isOwnComment = userId === currentUser.id;

    return (
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          {avatar ? (
            <Image
              resizeMode="contain"
              style={styles.avatar}
              source={{ uri: avatar }}
            />
          ) : (
            <Icon
              name={this.props.icon || "user"}
              size={20}
              color={COLORS.mediumGrey}
            />
          )}
        </View>
        <View style={styles.contentContainer}>
          <Text>
            <Text style={[styles.text, styles.name]}>{name}</Text>{" "}
            <Text style={styles.text}>{content}</Text>
          </Text>
          <Text style={[styles.text, styles.created]}>
            {moment(createdAt).fromNow()}
          </Text>
          {isOwnComment ? (
            <TouchableOpacity
              onPress={() => {
                Actions.editComment({
                  comment
                });
              }}
            >
              <Text
                style={{
                  textDecorationLine: "underline",
                  textAlign: "right"
                }}
              >
                Edit Comment
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    playerLookup: state.playerLookup,
    currentUser: state.currentUser
  };
};

Comment = connect(mapStateToProps)(Comment);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row"
  },
  avatarContainer: {
    alignItems: "center",
    marginLeft: 5,
    paddingTop: 10,
    width: 40
  },
  contentContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#EEE",
    padding: 5
  },
  avatar: {
    borderWidth: 1,
    borderColor: "#EEE",
    // borderRadius: 13,
    width: 26,
    height: 26
  },
  text: {
    color: "#000",
    fontSize: 15
  },
  name: {
    fontWeight: "bold"
  },
  created: {
    color: "#BBB"
  }
});
