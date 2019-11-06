import React, { Component } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";

import { LoadingOverlay } from "./loadingOverlay";
import { COLORS } from "../../styles/colors";

export class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true
    };
  }

  componentDidMount(): void {
    this.setState({
      isLoading: false
    });
  }

  noPlayerFound = () => {
    return <Text>No profile for player with id {this.props.id}</Text>;
  };

  profileImageSection = () => {
    const {
      profileImageURI,
      firstName,
      lastName,
      username
    } = this.props.player;
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={styles.avatarContainer}>
          {profileImageURI ? (
            <Image
              style={{ width: 100, height: 100 }}
              source={{ uri: profileImageURI }}
            />
          ) : (
            <Icon
              name={this.props.icon || "user"}
              size={100}
              color={COLORS.mediumGrey}
            />
          )}
        </View>
        <View style={{ flex: 1, flexDirection: "row", margin: 20 }}>
          <Text style={styles.nameText}>
            {firstName} {lastName} ({username || "No Username"})
          </Text>
        </View>
      </View>
    );
  };

  playerProfile = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column"
        }}
      >
        {this.profileImageSection()}
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.isLoading ? <LoadingOverlay /> : null}
        {this.props.player ? this.playerProfile() : this.noPlayerFound()}
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps;
  const player = state.playerLookup[id];

  return {
    player
  };
};

ProfilePage = connect(mapStateToProps)(ProfilePage);

const styles = StyleSheet.create({
  avatarContainer: {
    flex: 0,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    borderColor: COLORS.lightGrey
  },
  nameText: {
    textAlign: "left",
    color: COLORS.blue,
    fontSize: 18,
  }
});
