import React, { Component } from "react";
import { COLORS } from "../../styles/colors";
import StarRating from "react-native-star-rating";
import { View } from "react-native";

export class FiveStarRating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      communityRating: props.communityRating,
      myRating: props.myRating || null
    };
  }

  onStarRatingPress(rating) {
    this.setState({
      myRating: rating
    });

    this.props.ratingCallback && this.props.ratingCallback(rating);
  }

  render() {
    const { communityRating, myRating } = this.state;
    let starColor = COLORS.mediumGrey;
    let displayedRating = communityRating;

    if (myRating || myRating === 0) {
      starColor = COLORS.blue;
      displayedRating = myRating;
    }

    return (
      <View style={{ maxWidth: "50%" }}>
        <StarRating
          starSize={this.props.starSize}
          disabled={this.props.disabled}
          maxStars={5}
          rating={displayedRating}
          selectedStar={rating => this.onStarRatingPress(rating)}
          fullStarColor={starColor}
          emptyStarColor={COLORS.mediumGrey}
        />
      </View>
    );
  }
}
