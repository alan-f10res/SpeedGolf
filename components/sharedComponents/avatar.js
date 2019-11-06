import React, { PureComponent } from "react";
import { View, Image } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import { COLORS } from "../../styles/colors";

export class Avatar extends PureComponent {
  constructor(props) {
    super(props);
  }

  renderProfileImage = () => {
    return (
      <Image
        style={[{ width: 50, height: 50 }, this.props.styleOverride]}
        source={{ uri: this.props.profileImageURI }}
      />
    );
  };

  renderAvatarIcon = () => {
    return (
      <View
        style={{
          width: 50,
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          borderColor: COLORS.lightGrey,
          borderWidth: 1
        }}
      >
        <Icon name={"user"} size={50} color={COLORS.lightGrey} />
      </View>
    );
  };

  render() {
    const { profileImageURI } = this.props;

    return profileImageURI
      ? this.renderProfileImage()
      : this.renderAvatarIcon();
  }
}
