import React, { Component } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  ScrollView,
  Alert
} from "react-native";
import { Button, FormLabel } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { FiveStarRating } from "../sharedComponents/fiveStarRating";
import { COLORS } from "../../styles/colors";
import { saveNewReviewAPI, updateReviewAPI } from "../../api/reviews.api";
import { loadAllGolfCourses } from "../../state/golfCourses.state";
import { LoadingOverlay } from "../sharedComponents/loadingOverlay";

export class PostReview extends Component {
  constructor(props) {
    super(props);

    const { review } = this.props;

    if (review) {
      const {
        reviewText,
        ratingSpeedgolfFriendliness,
        ratingGolfChallenge,
        ratingRunningChallenge,
        ratingOverall,
        isLoading,
        id
      } = review;
      this.state = {
        reviewId: id,
        reviewText,
        ratingSpeedgolfFriendliness,
        ratingGolfChallenge,
        ratingRunningChallenge,
        ratingOverall,
        isLoading
      };
    } else {
      this.state = {
        reviewId: null,
        reviewTex: "",
        ratingSpeedgolfFriendliness: null,
        ratingGolfChallenge: null,
        ratingRunningChallenge: null,
        ratingOverall: null,
        isLoading: false
      };
    }
  }

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

  isSubmissionValid = () => {
    return !!this.state.reviewText;
  };

  onSubmitReview = async () => {
    this.startLoading();

    const { currentUser, course } = this.props;

    const {
      reviewText,
      ratingSpeedgolfFriendliness,
      ratingGolfChallenge,
      ratingRunningChallenge,
      ratingOverall,
      reviewId
    } = this.state;

    let reviewObject = {
      id: reviewId,
      reviewId,
      authorId: currentUser.id,
      authorName: `${currentUser.firstName} ${currentUser.lastName}`,
      authorAvatarUri: currentUser.profileImageURI,
      reviewText,
      createdAt: Date.now(),
      courseId: course.id,
      ratingSpeedgolfFriendliness,
      ratingGolfChallenge,
      ratingRunningChallenge,
      ratingOverall
    };

    if (!reviewId) {
      // brand new review
      await saveNewReviewAPI(reviewObject).then(() => {
        this.props.dispatch(loadAllGolfCourses());

        setTimeout(() => {
          this.props.forceUpdateReviews();
          this.showSuccessModal();
          this.endLoading();
        }, 1500);
      });
    } else {
      // udpate existing review
      await updateReviewAPI(reviewObject).then(() => {
        this.props.dispatch(loadAllGolfCourses());

        setTimeout(() => {
          this.props.forceUpdateReviews();
          this.showSuccessModal();
          this.endLoading();
        }, 1500);
      });
    }
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

  setRating = (newRatingValue, whichRating) => {
    this.setState({
      [whichRating]: newRatingValue
    });
  };

  render() {
    let screenWidth = Dimensions.get("window").width;
    let imageHeight = (screenWidth * 9) / 16;
    let imageUrl = this.props.course.imageUrl;

    return (
      <KeyboardAwareScrollView style={{ flex: 1, paddingBottom: 200 }}>
        {this.state.isLoading ? <LoadingOverlay /> : null}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={{ width: screenWidth, height: imageHeight }}
            resizeMode={"cover"}
          />
        </View>
        <View style={styles.bodyContainer}>
          <Text style={styles.headerText}>
            Reviewing: {this.props.golfProperty.propertyName} -{" "}
            {this.props.course.courseName}
          </Text>
          <View style={{ marginVertical: 10 }}>
            <FormLabel>Speedgolf Friendliness</FormLabel>
            <View style={{ paddingLeft: 20 }}>
              <FiveStarRating
                ratingCallback={newRating => {
                  this.setRating(newRating, "ratingSpeedgolfFriendliness");
                }}
                starSize={20}
                communityRating={3}
                myRating={this.state.ratingSpeedgolfFriendliness}
              />
            </View>
            <FormLabel>Golf Challenge</FormLabel>
            <View style={{ paddingLeft: 20 }}>
              <FiveStarRating
                ratingCallback={newRating => {
                  this.setRating(newRating, "ratingGolfChallenge");
                }}
                starSize={20}
                communityRating={3}
                myRating={this.state.ratingGolfChallenge}
              />
            </View>
            <FormLabel>Running Challenge</FormLabel>
            <View style={{ paddingLeft: 20 }}>
              <FiveStarRating
                ratingCallback={newRating => {
                  this.setRating(newRating, "ratingRunningChallenge");
                }}
                starSize={20}
                communityRating={3}
                myRating={this.state.ratingRunningChallenge}
              />
            </View>
            <FormLabel>Overall Speedgolf Experience</FormLabel>
            <View style={{ paddingLeft: 20 }}>
              <FiveStarRating
                ratingCallback={newRating => {
                  this.setRating(newRating, "ratingOverall");
                }}
                starSize={20}
                communityRating={3}
                myRating={this.state.ratingOverall}
              />
            </View>
          </View>

          <TextInput
            style={{
              height: 140,
              borderColor: "gray",
              borderWidth: 1,
              marginVertical: 20,
              padding: 10
            }}
            multiline={true}
            textAlignVertical={"top"}
            placeholder={"Your Review Here"}
            value={this.state.reviewText}
            onChangeText={reviewText => this.setState({ reviewText })}
          />
          <Button
            title={this.state.reviewId ? "Update Review" : "Submit Review"}
            onPress={this.onSubmitReview}
            color={COLORS.pureWhite}
            backgroundColor={COLORS.blue}
            value={this.state.text}
            disabled={!this.isSubmissionValid()}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const courseId = ownProps.courseId;
  const course = state.golfCourseLookup[courseId];
  const propertyId = course.golfPropertyId;
  const golfProperty = state.golfPropertiesLookup[propertyId];

  return {
    currentUser: state.currentUser,
    course,
    golfProperty
  };
};

PostReview = connect(mapStateToProps)(PostReview);

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    flexDirection: "column",
    margin: 20
  },
  headerText: {
    color: COLORS.blue,
    fontWeight: "bold",
    fontSize: 20
  },
  imageContainer: {
    width: "100%"
  }
});
