import React, { Component } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Image,
  Dimensions,
  TouchableHighlight,
  Alert
} from "react-native";
import { connect } from "react-redux";
import { Actions } from "react-native-router-flux";

import { DEFAULT_IMAGES } from "../../lib/imageHelpers";
import { CommentButton } from "../comments/commentButton";
import { COLORS } from "../../styles/colors";
import { formatDate } from "../../lib/formatters";
import { clearCurrentRound, setCurrentRound } from "../../state/ui.state";

import { STYLES } from "../../styles/styles";
import { LoadingOverlay } from "../sharedComponents/loadingOverlay";
import { deleteRound as deleteRoundAPI } from "../../api/rounds.api";
import { loadRounds } from "../../state/rounds.state";

export class RoundSummaryFullPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      commentCount: 0,
      golfScore: "n/a",
      fairwaysInRegulation: "n/a",
      greensInRegulation: "n/a",
      puttsTaken: "n/a",
      heartRate: "n/a",
      elevationGain: "n/a",
      playingPartners: "n/a",
      isLoading: false
    };
  }

  componentDidMount(): void {
    this.props.dispatch(setCurrentRound(this.props.currentRound.id));
  }

  componentWillUnmount(): void {
    this.props.dispatch(clearCurrentRound());
  }

  getGolfCourseString = () => {
    let { currentRound, golfCourseLookup, golfPropertiesLookup } = this.props;
    let { golfCourseId } = currentRound;
    const golfCourse = golfCourseLookup[golfCourseId];
    const golfProperty = golfPropertiesLookup[golfCourse.golfPropertyId];

    return `${golfProperty.propertyName} - ${golfCourse.courseName}`;
  };

  getRoundComments = () => {
    const { roundId, roundLookup } = this.props;
    const round = roundLookup[roundId];
    return round.comments;
  };

  deleteRound = async () => {
    this.setState({
      isLoading: true
    });

    // delete round api call
    await deleteRoundAPI(this.props.roundId)
      .then(async () => {
        Actions.pop();
        this.props.dispatch(await loadRounds());
      })
      .catch(error => {
        console.error("Error: ", error);
      });

    // refresh user's rounds

    this.setState({
      isLoading: false
    });
  };

  launchDeleteModal = () => {
    Alert.alert(
      "Are you sure?",
      "This action cannot be undone. Would you like to delete this round?",
      [
        {
          text: "Cancel"
        },
        {
          text: "Delete",
          onPress: this.deleteRound
        }
      ]
    );
  };

  render() {
    if (!this.props.currentRound) {
      return null;
    }

    let {
      datePlayed,
      speedgolfScore,
      totalStrokes,
      totalTime,
      roundType,
      imageUrl,
      roundComment
    } = this.props.currentRound;

    let screenWidth = Dimensions.get("window").width;
    let imageHeight = (screenWidth * 9) / 16;

    return (
      <ScrollView style={styles.container}>
        {this.state.isLoading ? <LoadingOverlay /> : null}
        <Image
          source={{ uri: imageUrl || DEFAULT_IMAGES.ROUND_IMAGE }}
          style={{ width: screenWidth, height: imageHeight }}
          resizeMode={"cover"}
        />
        <View style={styles.bodyContainer}>
          <View style={styles.primaryInfoContainer}>
            <Text style={styles.overallScore}>
              Speedgolf Score: {speedgolfScore}
            </Text>
            <Text style={styles.dataFieldLabel}>
              Strokes: <Text style={styles.dataFieldValue}>{totalStrokes}</Text>
            </Text>
            <Text style={styles.dataFieldLabel}>
              Time: <Text style={styles.dataFieldValue}>{totalTime}</Text>
            </Text>
          </View>
          <View style={styles.secondaryInfoContainer}>
            <Text style={styles.dataFieldLabel}>
              Course:{" "}
              <Text style={styles.dataFieldValue}>
                {this.getGolfCourseString()}
              </Text>
            </Text>
            <Text style={styles.dataFieldLabel}>
              Date Played:{" "}
              <Text style={styles.dataFieldValue}>
                {formatDate(datePlayed)}
              </Text>
            </Text>
            <Text style={styles.dataFieldLabel}>
              Round Type: <Text style={styles.dataFieldValue}>{roundType}</Text>
            </Text>
          </View>
          {roundComment ? (
            <View style={styles.tertiaryInfoContainer}>
              <Text style={styles.dataFieldLabel}>
                Round Comments:{" "}
                <Text style={styles.dataFieldValue}>{roundComment}</Text>
              </Text>
            </View>
          ) : null}

          <View style={styles.tertiaryInfoContainer}>
            <Text style={styles.tertiaryStatsHeader}>More Stats:</Text>
            <Text style={styles.tertiaryStats}>
              Fairways in Regulation: {this.state.fairwaysInRegulation}
            </Text>
            <Text style={styles.tertiaryStats}>
              Greens in Regulation: {this.state.greensInRegulation}
            </Text>
            <Text style={styles.tertiaryStats}>
              Putts Taken: {this.state.puttsTaken}
            </Text>
            <Text style={styles.tertiaryStats}>
              Heart Rate: {this.state.heartRate}
            </Text>
            <Text style={styles.tertiaryStats}>
              Elevation Gain: {this.state.elevationGain}
            </Text>
            <Text style={styles.tertiaryStats}>
              Playing Partners: {this.state.playingPartners}
            </Text>
          </View>
        </View>
        <View
          style={{
            padding: 20,
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <CommentButton
            comments={this.getRoundComments()}
            roundId={this.props.roundId}
          />
          <TouchableHighlight
            onPress={() => Actions.logRound()}
            style={STYLES.touchableButton}
          >
            <View style={STYLES.innerButtonContainer}>
              <Text style={{ textAlign: "center" }}>View Scorecard</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => null}
            style={STYLES.touchableButton}
          >
            <View style={STYLES.innerButtonContainer}>
              <Text style={{ textAlign: "center" }}>Share</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            padding: 20
          }}
        >
          <TouchableHighlight
            style={[STYLES.touchableButton, { backgroundColor: "red" }]}
            onPress={this.launchDeleteModal}
          >
            <Text style={{ fontWeight: "bold" }}>Delete Round</Text>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.pureWhite,
    flex: 1,
    flexDirection: "column"
  },
  bodyContainer: {
    paddingHorizontal: 20,
    paddingTop: 20
  },
  primaryInfoContainer: {
    marginVertical: 10
  },
  secondaryInfoContainer: {
    marginVertical: 10
  },
  tertiaryInfoContainer: {
    marginVertical: 10
  },
  tertiaryStats: {
    fontSize: 14,
    paddingLeft: 15
  },
  tertiaryStatsHeader: {
    fontSize: 18,
    paddingLeft: 10
  },
  actionsContainer: {
    marginVertical: 10
  },
  overallScore: {
    fontSize: 24
  },
  dataFieldLabel: {
    fontSize: 18,
    paddingLeft: 10,
    fontWeight: "bold"
  },
  dataFieldValue: {
    fontSize: 18,
    paddingLeft: 10,
    fontWeight: "normal"
  }
});

const mapStateToProps = (state, ownProps) => {
  let currentRound = state.roundLookup[ownProps.roundId];
  return {
    roundLookup: state.roundLookup,
    currentRound,
    golfCourseLookup: state.golfCourseLookup,
    golfPropertiesLookup: state.golfPropertiesLookup
  };
};

RoundSummaryFullPage = connect(mapStateToProps)(RoundSummaryFullPage);
