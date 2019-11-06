import React, { Component } from "react";
import {
  TouchableHighlight,
  Text,
  View,
  StyleSheet,
  Alert
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { showLocation } from "react-native-map-link";

import { COLORS } from "../../styles/colors";

export class MapButton extends Component {
  constructor(props) {
    super(props);
  }

  showLocationTest = async () => {
    await showLocation({
      latitude: 36.5725,
      longitude: -121.9486,
      title: "Pebble Beach", // optional
      googleForceLatLon: false, // optionally force GoogleMaps to use the latlon for the query instead of the title
      googlePlaceId: "ChIJGVtI4by3t4kRr51d_Qm_x58", // optionally specify the google-place-id
      dialogTitle: "This is the dialog Title", // optional (default: 'Open in Maps')
      dialogMessage: "This is the amazing dialog Message", // optional (default: 'What app would you like to use?')
      cancelText: "This is the cancel button text", // optional (default: 'Cancel')
      appsWhiteList: ["google-maps", "apple-maps"] // optionally you can set which apps to show (default: will show all supported apps installed on device)
      // app: 'uber'  // optionally specify specific app to use
    });
  };

  render() {
    return (
      <TouchableHighlight
        style={styles.touchableButton}
        onPress={this.showLocationTest}
      >
        <View style={styles.innerContainer}>
          <Icon name="map-marker" color={COLORS.pureWhite} size={12} />
          <Text style={styles.buttonText}>Map</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
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
