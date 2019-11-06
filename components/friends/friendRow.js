import React, { PureComponent } from "react";
import { View, Image, TouchableOpacity, StyleSheet, Text } from "react-native";
import { COLORS } from "../../styles/colors";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";

export class FriendRow extends PureComponent {
  render() {
    const { buttons, id, playerLookup } = this.props;
    const player = playerLookup[id];
    if (!player) {
      return null;
    }
    const { profileImageURI, firstName, lastName } = player;
    return (
      <View style={styles.rowContainer}>
        <View style={styles.leftContent}>
          <View style={styles.avatarContainer}>
            {profileImageURI ? (
              <Image
                style={{ width: 50, height: 50 }}
                source={{ uri: profileImageURI }}
              />
            ) : (
              <Icon
                name={this.props.icon || "user"}
                size={50}
                color={COLORS.mediumGrey}
              />
            )}
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>
              {firstName} {lastName}
            </Text>
          </View>
        </View>
        <View style={styles.rightContent}>
          <View style={styles.buttonsContainer}>{buttons}</View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    playerLookup: state.playerLookup
  };
};
FriendRow = connect(mapStateToProps)(FriendRow);
const styles = StyleSheet.create({
  rowContainer: {
    width: "100%",
    borderTopWidth: 0.5,
    borderTopColor: COLORS.lightGrey,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  leftContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center"
  },
  rightContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center"
  },
  avatarContainer: {
    marginRight: 10,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderColor: COLORS.lightGrey,
    borderWidth: 1
  },
  nameContainer: {},
  nameText: {
    textAlign: "left",
    color: COLORS.blue
  },
  buttonsContainer: { justifyContent: "flex-end" }
});
