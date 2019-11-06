import React, { Component } from "react";
import { View, StyleSheet, Text, Linking } from "react-native";
import { Button } from "react-native-elements";
import { Actions } from "react-native-router-flux";

export class About extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
          The World's First and Only Suite of Apps for Speedgolf
        </Text>
        <View>
          <Text>SpeedScore apps support:</Text>
          <View>
            <Text style={styles.listItem}>
              - live tournament scoring (<Text>SpeedScore LIVE</Text>)
            </Text>
            <Text style={styles.listItem}>
              - tracking personal Speedgolf rounds and sharing results (
              <Text style={styles.italic}>SpeedScore TRACK</Text>)
            </Text>
            <Text style={styles.listItem}>
              - finding speedgolf-friendly courses, booking tee times, and paying
              to play speedgolf by the minute (
              <Text style={styles.italic}>SpeedScore PLAY</Text>)
            </Text>
          </View>
          <View>
            <Text>
              SpeedScore was developed by Dr. Chris Hundhausen, associate
              professor of computer science at Washington State University and
              the <Text style={{fontStyle: "italic"}}>Professor of Speedgolf</Text>, with support from Scott
              Dawley, CEO of Speedgolf USA, LLC. It leverages Google server-side technologies.
            </Text>
            <View style={styles.moreInfoSection}>
              <Text>
                {/*todo add links here for each*/}
                For more information on SpeedScore, visit SpeedScore's web site,
                playspeedgolf.com, and Speedgolf USA
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.versionInfoContainer}>
          <Text style={styles.versionInfo}>
            Version 1 (TRACK), Build 18.11.2018
          </Text>
          <Text style={styles.versionInfo}>
            2018-19 The Professor of Speedgolf.
          </Text>
          <Text style={styles.versionInfo}>All rights reserved.</Text>
        </View>
        <Button title={"Ok"} onPress={Actions.pop} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 20
  },
  header: {
    fontSize: 24,
    paddingBottom: 10
  },
  listItem: {
    paddingLeft: 10,
    paddingVertical: 10
  },
  italic: {
    fontStyle: "italic"
  },
  moreInfoSection: {
    paddingVertical: 10
  },
  versionInfoContainer: {
    marginVertical: 10
  },
  versionInfo: {
    textAlign: "center",
    fontStyle: "italic"
  }
});
