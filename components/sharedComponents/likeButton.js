import React, { Component } from "react";
import { StyleSheet, TouchableHighlight, View, Text } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { COLORS } from "../../styles/colors";

// NOTE: Currently, this like button is specific to Rounds in the Feed.
// You will need to update the API callback to make it generalized for other types of items.
// You will also need to ensure new items have a 'likedBy' array field in the data base.

export class LikeButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLiked: false,
      likeCount: this.props.likeCount
    };
  }

  toggleLike = () => {
    const { isLiked, likeCount } = this.state;
    let newLikeCount = isLiked ? likeCount - 1 : likeCount + 1;
    this.setState({
      isLiked: !isLiked,
      likeCount: newLikeCount
    });
  };

  render() {
    const { isLiked, likeCount } = this.state;
    const buttonBackgroundColor = isLiked ? COLORS.blue : COLORS.lightGrey;
    const iconColor = isLiked ? COLORS.pureWhite : COLORS.blue;
    const buttonText = isLiked ? "Liked" : "Like ";

    return (
      <TouchableHighlight
        style={[
          styles.touchableButton,
          { backgroundColor: buttonBackgroundColor }
        ]}
        onPress={this.toggleLike}
      >
        <View style={styles.innerContainer}>
          <Icon
            name="hand-rock-o"
            color={iconColor}
            size={12}
            style={{
              transform: [{ rotate: "90deg" }]
            }}
          />
          <Text style={[styles.buttonText, { color: iconColor }]}>
            {buttonText} ({likeCount})
          </Text>
        </View>
      </TouchableHighlight>
    );
  }
}

// export class LikeButton extends PureComponent {
//   constructor(props) {
//     super(props);
//
//     this.state = { isLoading: false };
//   }
//
//   startLoadng = () => {
//     this.setState({
//       isLoading: true
//     });
//   };
//
//   endLoading = () => {
//     this.setState({
//       isLoading: false
//     });
//   };
//
//   toggleLike = async () => {
//     this.startLoadng();
//
//     const isLikedByCurrentUser = this.isLikedByCurrentUser();
//     const likedByCopy = [...this.props.likedBy];
//
//     if (isLikedByCurrentUser) {
//       // remove user id from array
//       let currentUserIdIndex = likedByCopy.indexOf(this.props.userId);
//       likedByCopy.splice(currentUserIdIndex, 1);
//     } else {
//       // add user id to array
//       likedByCopy.push(this.props.userId);
//     }
//
//     // update array api call
//     await updateLikedByList(this.props.roundId, likedByCopy).then(
//       // this.props.dispatch(refreshAppData())
//     );
//
//     this.endLoading();
//   };
//
//   isLikedByCurrentUser = () => {
//     return this.props.likedBy.includes(this.props.userId);
//   };
//
//   render() {
//     const isLiked = this.isLikedByCurrentUser();
//     const buttonBackgroundColor = isLiked ? COLORS.blue : COLORS.lightGrey;
//     const iconColor = isLiked ? COLORS.pureWhite : COLORS.blue;
//     const buttonText = isLiked ? "Liked" : "Like ";
//
//     return (
//       <Button
//         activityIndicatorStyle={{
//           shadowColor: iconColor,
//           height: 20,
//           width: 20
//         }}
//         buttonStyle={[
//           styles.touchableButton,
//           { backgroundColor: buttonBackgroundColor }
//         ]}
//         title={buttonText}
//         onPress={this.toggleLike}
//         loading={this.state.isLoading}
//         textStyle={{ color: iconColor }}
//         fontSize={12}
//         icon={{
//           name: "thumbs-up",
//           type: "font-awesome",
//           color: iconColor,
//           size: 12
//         }}
//       />
//     );
//   }
// }

const styles = StyleSheet.create({
  touchableButton: {
    height: 30,
    backgroundColor: COLORS.lightGrey,
    paddingHorizontal: 10,
    paddingVertical: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  buttonText: {
    paddingLeft: 5,
    fontSize: 12
  },
  innerContainer: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  }
});
