import React, { Component } from "react";
import { FlatList, ScrollView, View, Text } from "react-native";
import { Actions } from "react-native-router-flux";
import { connect } from "react-redux";
import { COLORS } from "../../styles/colors";
import { FloatingActionButton } from "../sharedComponents/floatingActionButton";
import { STYLES } from "../../styles/styles";
import { RoundPostedCard } from "./roundPostedCard";
import { formatDate } from "../../lib/formatters";
import { LoadingOverlay } from "../sharedComponents/loadingOverlay";

export class Feed extends Component {
  renderContentSwitcher = () => {
    const { isLoading, feed } = this.props;
    if (isLoading) {
      return (
        <View
          style={{
            padding: 20
          }}
        >
          <LoadingOverlay />
        </View>
      );
    } else if (feed.length === 0) {
      return (
        <View
          style={{
            flex: 1,
            padding: 20
          }}
        >
          <Text>
            No feed items yet! Follow some other users and log some rounds, then
            check back here
          </Text>
        </View>
      );
    } else {
      return this.props.feed.map((feedItem, index) => {
        const style =
          index % 2 === 0 ? { backgroundColor: COLORS.faintBlue } : null;
        return (
          <RoundPostedCard
            style={style}
            key={feedItem.id}
            roundId={feedItem.id}
            playerId={feedItem.userId}
            dateTime={formatDate(feedItem.datePlayed)}
            totalStrokes={feedItem.totalStrokes}
            totalTime={feedItem.totalTime}
            speedgolfScore={feedItem.speedgolfScore}
            golfCourseId={feedItem.golfCourseId}
            likedBy={feedItem.likedBy}
            comments={feedItem.comments}
          />
        );
      });
    }
  };

  render() {
    return (
      <View style={STYLES.container}>
        <ScrollView
          style={{
            width: "100%"
          }}
        >
          {this.renderContentSwitcher()}
        </ScrollView>
        <FloatingActionButton
          iconName="users"
          fabCallback={() => Actions.friends()}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    feed: state.feed,
    isLoading: state.feedLoading
  };
};

Feed = connect(mapStateToProps)(Feed);
