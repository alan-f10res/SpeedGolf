import React, { Component, PureComponent } from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";

import { getStore } from "../../state/dataTree";
import { Comment } from "./comment";
import CommentInput from "./commentInput";
import { RESOURCE_CONSTANTS } from "../../api/resourceConstants.api";
import { getCurrentUserId } from "../../lib/userUtility";
import { createCommentOnRoundAPI } from "../../api/comments.api";
import { refreshAppData } from "../../state/currentUser.state";
import { FEED_ITEM_TYPE } from "../../api/feed.api";

export class Comments extends Component {
  submitComment = async comment => {
    let commentParams = {
      content: comment,
      createdAt: Date.now(),
      parentId: this.props.roundId,
      parentType: RESOURCE_CONSTANTS.ROUNDS,
      userId: getCurrentUserId()
    };

    await createCommentOnRoundAPI(commentParams).then(() => {
      getStore().dispatch(refreshAppData());
      Alert.alert("Success", "You comment has posted successfully", [
        { text: "Ok", onPress: Actions.pop }
      ]);
    });
  };

  getComments = () => {
    const { roundId, roundLookup, feed } = this.props;
    const round = roundLookup[roundId];
    if (round) {
      // if its your own round, this is the way
      return round.comments;
    } else {
      // if not, you must check feed items
      for (let i = 0; i < feed.length; i++) {
        let feedItem = feed[i];
        if (
          feedItem.feedItemType === FEED_ITEM_TYPE.ROUND_LOGGED &&
          feedItem.id === roundId
        ) {
          return feedItem.comments;
        }
      }
    }
  };

  render() {
    const comments = this.getComments();
    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <View style={{ flex: 1 }}>
            {comments.length === 0 ? (
              <View
                style={{
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    textAlign: "center"
                  }}
                >
                  No comments yet. Be the first to leave a comment.
                </Text>
              </View>
            ) : null}
            {comments.map(commentObject => {
              return <Comment comment={commentObject} key={commentObject.id} />;
            })}
          </View>
          <CommentInput onSubmit={this.submitComment} />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    feed: state.feed,
    roundLookup: state.roundLookup
  };
};

Comments = connect(mapStateToProps)(Comments);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 20,
    marginBottom: 40
  },
  addComentContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center"
  },
  commentInput: {
    paddingLeft: 10,
    height: 50,
    flex: 1
  },
  responsesContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "pink"
  }
});
