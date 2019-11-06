import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform
} from "react-native";
import { connect } from "react-redux";
import ImagePicker from "react-native-image-picker";
import Icon from "react-native-vector-icons/FontAwesome";
import { FormLabel } from "react-native-elements";

import { COLORS } from "../../styles/colors";

const options = {
  title: "Select File",
  storageOptions: {
    skipBackup: true,
    path: "images"
  }
};

export class MyImagePicker extends Component {
  constructor(props) {
    super(props);

    let screenWidth = Dimensions.get("window").width;
    this.state = {
      screenWidth
    };
  }

  getFilePathForPlatform = response => {
    if (Platform.OS === "ios") {
      return response.uri;
    } else {
      return response.path && "file://" + response.path;
    }
  };

  launchImagePicker = async () => {
    ImagePicker.showImagePicker(async response => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        let filePath = this.getFilePathForPlatform(response);
        if (this.props.uploadCallback) {
          this.props.uploadCallback(filePath);
        } else {
          console.warn("Image uploaded to nowhere");
        }
      }
    }, options);
  };

  render() {
    let height = (this.state.screenWidth * 9) / 16;
    let width = this.state.screenWidth;

    return (
      <TouchableOpacity
        onPress={this.launchImagePicker}
        style={[
          {
            backgroundColor: COLORS.lightGrey,
            height,
            width
          }
        ]}
      >
        <View>
          {this.props.imageSource ? (
            <Image
              source={{ uri: this.props.imageSource }}
              style={[
                styles.uploadAvatar,
                {
                  height,
                  width
                }
              ]}
            />
          ) : (
            <View
              style={[
                styles.uploadAvatar,
                {
                  height,
                  width
                }
              ]}
            >
              <Icon
                name={this.props.icon || "user"}
                size={60}
                color={COLORS.mediumGrey}
              />
              <FormLabel
                labelStyle={{
                  color: COLORS.blue,
                  paddingLeft: 20
                }}
              >
                {this.props.title || "Upload Photo"}
              </FormLabel>
            </View>
          )}
          <Text style={{ textAlign: "center", color: COLORS.mediumGrey }}>
            {this.props.subTitle}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  uploadAvatar: {
    borderColor: COLORS.mediumGrey,
    borderWidth: 2,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  }
});

const mapStateToProps = (state, ownProps) => {
  let { currentUser } = state;
  return {
    userId: currentUser.id,
    currentUser,
    imageSource: ownProps.imageSource
  };
};

MyImagePicker = connect(mapStateToProps)(MyImagePicker);
