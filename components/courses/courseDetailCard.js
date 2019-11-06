import React, { Component } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import { RequestTeeTimeButton } from "./requestTeeTimeButton";
import { MapButton } from "./mapButton";
import { FiveStarRating } from "../sharedComponents/fiveStarRating";
import { FormLabel } from "react-native-elements";
import { COLORS } from "../../styles/colors";
import { ToggleableDistanceEntry } from "../sharedComponents/toggleableDistanceEntry";
import { ScoreCard } from "../rounds/scorecard/scoreCard";
import { YourRound } from "../rounds/yourRound";
import { Actions } from "react-native-router-flux";
import Icon from "react-native-vector-icons/FontAwesome";

const scores = {
  1: { hole: 1, par: 4, strokes: "", time: "" },
  2: { hole: 2, par: 3, strokes: "", time: "" },
  3: { hole: 3, par: 4, strokes: "", time: "" },
  4: { hole: 4, par: 5, strokes: "", time: "" },
  5: { hole: 5, par: 5, strokes: "", time: "" },
  6: { hole: 6, par: 3, strokes: "", time: "" },
  7: { hole: 7, par: 4, strokes: "", time: "" },
  8: { hole: 8, par: 4, strokes: "", time: "" },
  9: { hole: 9, par: 5, strokes: "", time: "" },
  10: { hole: 10, par: 3, strokes: "", time: "" },
  11: { hole: 11, par: 4, strokes: "", time: "" },
  12: { hole: 12, par: 3, strokes: "", time: "" },
  13: { hole: 13, par: 4, strokes: "", time: "" },
  14: { hole: 14, par: 3, strokes: "", time: "" },
  15: { hole: 15, par: 4, strokes: "", time: "" },
  16: { hole: 16, par: 5, strokes: "", time: "" },
  17: { hole: 17, par: 5, strokes: "", time: "" },
  18: { hole: 18, par: 4, strokes: "", time: "" }
};

const bestRound = {
  id: "fake-2",
  imageUrl:
    "http://res.cloudinary.com/hrscywv4p/image/upload/c_limit,fl_lossy,h_1440,w_720,f_auto,q_auto/v1/458/Chris-profile_bt2idh.png",
  dateTime: "23 November 2018 9:30 AM PST",

  strokes: 62,
  roundTime: "80:20", // may want to reformat this as an actionable date object
  totalScore: "142:20", // do we normally include seconds? Chris told me a story about a guy that won by a few seconds
  commentCount: 23,
  golfCourse: "Laurel Oaks"
};

export class CourseDetailCard extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let screenWidth = Dimensions.get("window").width;
    let imageHeight = (screenWidth * 9) / 16;
    const { course, imageUrl } = this.props;
    const { name, location, id } = course;
    return (
      <ScrollView
        style={{
          flex: 1,
          flexDirection: "column",
          marginBottom: 50
        }}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: "" }}
            style={{ width: screenWidth, height: imageHeight }}
            resizeMode={"cover"}
          />
        </View>
        <View style={styles.sectionContainer}>
          <Text style={[styles.nameText, { fontWeight: "bold" }]}>{name}</Text>
          <Text style={[styles.nameText]}>{location}</Text>
          <View style={{ paddingTop: 10, paddingLeft: 20 }}>
            <Text style={{ color: COLORS.blue }}>Phone: (555) 555 - 5555</Text>
            <Text style={{ color: COLORS.blue }}>
              Website: GolfCourseWebsite.com
            </Text>
            <Text style={{ color: COLORS.blue }}>
              Email: contact@GolfCourseWebsite.com
            </Text>
            <View
              style={{ maxWidth: 100, paddingTop: 5, flexDirection: "row" }}
            >
              <RequestTeeTimeButton courseId={id} />
              <MapButton />
              <TouchableHighlight
                style={styles.touchableButton}
                onPress={() =>
                  Actions.courseReviews({
                    courseId: id
                  })
                }
              >
                <View style={styles.innerContainer}>
                  <Icon name="star" color={COLORS.pureWhite} size={12} />
                  <Text style={styles.buttonText}>Reviews</Text>
                </View>
              </TouchableHighlight>
            </View>
            <View
              style={{ maxWidth: "100%", paddingTop: 5, flexDirection: "row" }}
            >
              <TouchableHighlight
                style={styles.touchableButton}
                onPress={Actions.postCourseReview}
              >
                <View style={styles.innerContainer}>
                  <Icon name="star" color={COLORS.pureWhite} size={12} />
                  <Text style={styles.buttonText}>Write / Edit Review</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.nameText}>Ratings</Text>
            <TouchableOpacity onPress={Actions.courseReviews}>
              <Text
                style={[styles.nameText, { textDecorationLine: "underline" }]}
              >
                {" "}
                (122 Reviews)
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.subSection}>
            <View>
              <FormLabel
                containerStyle={styles.ratingsLabelContainer}
                labelStyle={styles.ratingsLabel}
              >
                Speedgolf Friendliness
              </FormLabel>
              <FiveStarRating
                starSize={20}
                communityRating={Math.ceil(Math.random() * 5)}
              />
            </View>
            <View>
              <FormLabel
                containerStyle={styles.ratingsLabelContainer}
                labelStyle={styles.ratingsLabel}
              >
                Golf Challenge
              </FormLabel>
              <FiveStarRating
                starSize={20}
                communityRating={Math.ceil(Math.random() * 5)}
              />
            </View>
            <View>
              <FormLabel
                containerStyle={styles.ratingsLabelContainer}
                labelStyle={styles.ratingsLabel}
              >
                Running Challenge
              </FormLabel>
              <FiveStarRating
                starSize={20}
                communityRating={Math.ceil(Math.random() * 5)}
              />
            </View>
            <View>
              <FormLabel
                containerStyle={styles.ratingsLabelContainer}
                labelStyle={styles.ratingsLabel}
              >
                Overall Speedgolf Experience
              </FormLabel>
              <FiveStarRating
                starSize={20}
                communityRating={Math.ceil(Math.random() * 5)}
              />
            </View>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.nameText}>Golf Course Stats</Text>
          <View style={styles.subSection}>
            <View>
              <Text style={styles.basicText}>
                Speedgolf Course Ranking: 1 / 327
              </Text>
            </View>
            <View>
              <Text style={styles.basicText}>Speedgolf Rounds Logged:</Text>
              <View style={{ paddingLeft: 20 }}>
                <Text style={styles.basicText}>This Week: 21</Text>
                <Text style={styles.basicText}>This Month: 221</Text>
                <Text style={styles.basicText}>This Year: 2221</Text>
                <Text style={styles.basicText}>All-Time: 22221</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <ToggleableDistanceEntry
            label={"Running Distance"}
            typeOfDistance="running"
            initialValue={12}
            readOnly={true}
          />
          <ToggleableDistanceEntry
            label={"Course Distance"}
            typeOfDistance="distance"
            initialValue={8056}
            readOnly={true}
          />
        </View>
        <View style={[styles.sectionContainer, { paddingHorizontal: 0 }]}>
          <ScoreCard
            scores={scores}
            updateStrokes={() => {}}
            readOnly={true}
          />
        </View>
        <View style={[styles.sectionContainer]}>
          <FormLabel labelStyle={styles.ratingsLabel}>
            Best Recorded Round
          </FormLabel>
          <YourRound
            imageUrl={bestRound.imageUrl}
            totalScore={bestRound.totalScore}
            roundTime={bestRound.roundTime}
            strokes={bestRound.strokes}
            golfCourse={name}
            commentCount={bestRound.commentCount}
            dateTime={bestRound.dateTime}
            key={bestRound.id}
          />
        </View>
        <View style={[styles.sectionContainer]}>
          <FormLabel labelStyle={styles.ratingsLabel}>
            My Recorded Rounds
          </FormLabel>
          <ScrollView>
            <YourRound
              imageUrl={bestRound.imageUrl}
              totalScore={bestRound.totalScore}
              roundTime={bestRound.roundTime}
              strokes={bestRound.strokes}
              golfCourse={name}
              commentCount={bestRound.commentCount}
              dateTime={bestRound.dateTime}
              key={bestRound.id}
            />
            <YourRound
              imageUrl={bestRound.imageUrl}
              totalScore={bestRound.totalScore}
              roundTime={bestRound.roundTime}
              strokes={bestRound.strokes}
              golfCourse={name}
              commentCount={bestRound.commentCount}
              dateTime={bestRound.dateTime}
              key={bestRound.id}
            />
            <YourRound
              imageUrl={bestRound.imageUrl}
              totalScore={bestRound.totalScore}
              roundTime={bestRound.roundTime}
              strokes={bestRound.strokes}
              golfCourse={name}
              commentCount={bestRound.commentCount}
              dateTime={bestRound.dateTime}
              key={bestRound.id}
            />
          </ScrollView>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  imageContainer: {
    width: "100%"
  },
  courseImage: {
    alignSelf: "center"
  },
  nameText: {
    fontSize: 20,
    paddingVertical: 2,
    color: COLORS.blue
  },
  subSection: {
    paddingHorizontal: 20
  },
  ratingsLabelContainer: {
    marginVertical: 5,
    marginLeft: 0,
    paddingLeft: 0,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    alignContent: "flex-start"
  },
  ratingsLabel: {
    marginLeft: 0,
    paddingLeft: 0,
    color: COLORS.blue
  },
  basicText: {
    color: COLORS.blue
  },
  touchableButton: {
    height: 30,
    backgroundColor: COLORS.blue,
    padding: 8,
    flex: 0,
    margin: 2
  },
  buttonText: {
    paddingLeft: 5,
    fontSize: 12,
    color: COLORS.pureWhite
  },
  innerContainer: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center"
  }
});

const mapStateToProps = (state, ownProps) => {
  let { id } = ownProps;
  let course = state.golfCourseLookup[id];
  return {
    ...ownProps,
    course
  };
};

CourseDetailCard = connect(mapStateToProps)(CourseDetailCard);
