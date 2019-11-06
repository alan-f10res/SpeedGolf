import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity
} from "react-native";
import moment from "moment";
import { Button } from "react-native-elements";
import { Actions } from "react-native-router-flux";

import { COLORS } from "../../styles/colors";
import { FiveStarRating } from "../sharedComponents/fiveStarRating";
import { Avatar } from "../sharedComponents/avatar";
import { LoadingOverlay } from "../sharedComponents/loadingOverlay";
import { getReviewsForCourse } from "../../api/reviews.api";
import { getCurrentUserId } from "../../lib/userUtility";

export class CourseReviews extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reviews: [],
      isLoading: true
    };
  }

  componentDidMount = async () => {
    let reviews = await getReviewsForCourse(this.props.courseId);
    reviews = this.processQuerySnapshot(reviews);
    this.setState({
      reviews,
      isLoading: false
    });
  };

  processQuerySnapshot = reviewsSnapshot => {
    let reviews = [];

    reviewsSnapshot.forEach(doc => {
      let docData = { ...doc.data(), id: doc.id };
      reviews.push(docData);
    });

    reviews = this.sortReviews(reviews);

    return reviews;
  };

  sortReviews = reviews => {
    reviews = reviews.sort((a, b) => {
      const aCreatedAt = a.createdAt;
      const bCreatedAt = b.createdAt;
      if (aCreatedAt > bCreatedAt) {
        return -1;
      } else if (aCreatedAt < bCreatedAt) {
        return 1;
      } else {
        return 0;
      }
    });

    return reviews;
  };

  forceUpdateReviews = async () => {
    this.setState({
      isLoading: true
    });
    let reviews = await getReviewsForCourse(this.props.courseId);
    reviews = this.processQuerySnapshot(reviews);
    reviews = this.sortReviews(reviews);
    this.setState({
      reviews,
      isLoading: false
    });
  };

  render() {
    return (
      <ScrollView>
        {this.state.isLoading ? <LoadingOverlay /> : null}
        {this.state.reviews && this.state.reviews.length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 20
            }}
          >
            <Text
              style={{
                textAlign: "center"
              }}
            >
              No reviews yet. Be the first to post a review
            </Text>
          </View>
        ) : (
          <ScrollView>
            {this.state.reviews.map(review => {
              return (
                <Review
                  key={review.id}
                  review={review}
                  forceUpdateReviews={this.forceUpdateReviews}
                />
              );
            })}
          </ScrollView>
        )}
        <View style={{ marginVertical: 20 }}>
          <Button
            buttonStyle={{ minWidth: 200 }}
            onPress={() =>
              Actions.postCourseReview({
                courseId: this.props.courseId,
                forceUpdateReviews: this.forceUpdateReviews
              })
            }
            title="Write A Review"
            backgroundColor={COLORS.blue}
            color={COLORS.pureWhite}
          />
        </View>
      </ScrollView>
    );
  }
}

class Review extends Component {
  isOwner = () => {
    return this.props.review.authorId === getCurrentUserId();
  };
  render() {
    let isOwner = this.isOwner();
    let { review } = this.props;

    const {
      authorAvatarUri,
      authorId,
      authorName,
      courseId,
      createdAt,
      id,
      ratingGolfChallenge,
      ratingOverall,
      ratingRunningChallenge,
      ratingSpeedgolfFriendliness,
      reviewText
    } = review;
    return (
      <View
        style={{
          width: "100%",
          flexDirection: "row",
          marginVertical: 10,
          marginHorizontal: 10
        }}
      >
        <Avatar profileImageURI={authorAvatarUri} />
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            marginHorizontal: 20
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingBottom: 5
            }}
          >
            <Text style={styles.nameText}>{authorName}</Text>
            <Text style={styles.dateText}>{moment(createdAt).fromNow()}</Text>
          </View>
          <View style={{ maxWidth: 60, paddingBottom: 5 }}>
            <FiveStarRating
              starSize={16}
              communityRating={3}
              myRating={ratingOverall}
              disabled={true}
            />
          </View>
          <View style={{ flexDirection: "row", marginBottom: 10 }}>
            <Text numberOfLines={5} style={styles.reviewText}>
              {reviewText}
            </Text>
          </View>
          {isOwner ? (
            <TouchableOpacity
              style={{ flexDirection: "row", justifyContent: "flex-end" }}
              onPress={() => {
                Actions.postCourseReview({
                  review: this.props.review,
                  courseId: this.props.review.courseId,
                  forceUpdateReviews: this.props.forceUpdateReviews
                });
              }}
            >
              <Text
                style={{
                  color: COLORS.blue,
                  textDecorationLine: "underline"
                }}
              >
                Edit Review
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  nameText: {
    fontWeight: "bold",
    fontSize: 20,
    color: COLORS.blue
  },
  dateText: {
    color: COLORS.mediumGrey,
    fontSize: 10
  },
  reviewText: { flex: 1, flexWrap: "wrap", fontSize: 12, color: COLORS.blue }
});
