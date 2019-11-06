import React, { Component } from "react";
import { View, TextInput, Dimensions, Alert } from "react-native";
import { Actions } from "react-native-router-flux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "react-native-elements";
import { getStore } from "../../state/dataTree";

import { LoadingOverlay } from "../sharedComponents/loadingOverlay";
import { COLORS } from "../../styles/colors";
import { updateComment } from "../../api/comments.api";
import { loadRounds } from "../../state/rounds.state";

export class EditComment extends Component {
  constructor(props) {
    super(props);
    const { comment } = this.props;
    const { id, content, createdAt } = comment;

    this.state = {
      id,
      content,
      createdAt,
      isLoading: false
    };
  }

  onSubmitComment = async () => {
    this.startLoading();
    let newComment = {
      ...this.props.comment,
      createdAt: Date.now(),
      content: this.state.content
    };

    const { id } = this.state;
    await updateComment(id, newComment).then(() => {
      // update rounds
      getStore().dispatch(loadRounds());

      setTimeout(() => {
        this.showSuccessModal();
        this.endLoading();
      }, 1500);
    });
  };

  showSuccessModal = () => {
    Alert.alert(
      "Success",
      "Your review has been recorded.",
      [
        {
          text: "OK",
          onPress: () => {
            Actions.pop();
          }
        }
      ],
      { cancelable: true }
    );
  };

  isSubmissionValid = () => {
    return !!this.state.content;
  };

  startLoading = () => {
    this.setState({
      isLoading: true
    });
  };

  endLoading = () => {
    this.setState({
      isLoading: false
    });
  };

  render() {
    return (
      <KeyboardAwareScrollView
        style={{ flex: 1, paddingBottom: 200, backgroundColor: "white" }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between"
          }}
        >
          <View style={{ flex: 1 }}>
            <TextInput
              style={{
                width: Dimensions.get("window").width,
                borderColor: "gray",
                borderBottomWidth: 1,
                padding: 10,
                minHeight: 200
              }}
              multiline={true}
              textAlignVertical={"top"}
              placeholder={"Your comment here"}
              value={this.state.content}
              onChangeText={content => this.setState({ content })}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around",
              padding: 20
            }}
          >
            <Button
              title="Cancel"
              onPress={Actions.pop}
              color={COLORS.pureWhite}
              backgroundColor={COLORS.blue}
            />
            <Button
              title={this.state.id ? "Update Comment" : "Submit Comment"}
              onPress={this.onSubmitComment}
              color={COLORS.pureWhite}
              backgroundColor={COLORS.blue}
              disabled={!this.isSubmissionValid()}
            />
          </View>
        </View>
        {this.state.isLoading ? <LoadingOverlay /> : null}
      </KeyboardAwareScrollView>
    );
  }
}
