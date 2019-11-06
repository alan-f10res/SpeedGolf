import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Actions } from "react-native-router-flux";
import Icon from "react-native-vector-icons/FontAwesome";
import firebase from "react-native-firebase";
import { connect } from "react-redux";
import { Avatar } from "./avatar";
import { COLORS } from "../../styles/colors";
import { saveNewCourse } from "../../api/golfCourses.api";
import { resetStore } from "../../state/dataTree";

export class DrawerMenu extends Component {
  getProfileRow = () => {
    let { firstName, lastName, profileImageURI } = this.props.currentUser;
    // todo what to do about overlapping names? wrap, chop, or resize font?
    return (
      <View
        style={{
          width: "100%",
          flex: 0,
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          borderBottomWidth: 2,
          borderBottomColor: COLORS.pureWhite,
          paddingBottom: 10
        }}
      >
        <Avatar profileImageURI={profileImageURI} />
        <Text
          style={{
            color: COLORS.pureWhite,
            fontSize: 20,
            paddingLeft: 20
          }}
        >
          {firstName} {lastName}
        </Text>
      </View>
    );
  };

  getDrawerMenuOptions = () => {
    switch (Actions.currentScene) {
      case "_feed":
        return [
          {
            title: "Speedgolfers",
            link: Actions.friends,
            key: "_feed-followed-users",
            iconName: "users"
          }, // didnt have user friends in this version
          {
            title: "My Profile",
            link: Actions.profile,
            key: "_feed-settings",
            iconName: "cog"
          },
          {
            title: "About",
            link: Actions.about,
            key: "_feed-about",
            iconName: "info-circle"
          }
        ];
      case "_rounds":
        return [
          {
            title: "Log New Round",
            link: Actions.logRound,
            key: "_rounds-log-new-round",
            iconName: "pencil"
          },
          {
            title: "Round History",
            link: () => {
              Actions.roundHistoryTable();
            },
            key: "_rounds-search-rounds",
            iconName: "search"
          },
          {
            title: "Settings",
            link: Actions.profile,
            key: "_rounds-settings",
            iconName: "cog"
          },
          {
            title: "About",
            link: Actions.about,
            key: "_rounds-about",
            iconName: "info-circle"
          }
        ];
      case "_courses":
        return [
          {
            title: "Suggest a Course",
            link: () =>
              Actions.suggestACourse({
                submitCallback: saveNewCourse
              }),
            key: "_courses-suggest-course",
            iconName: "plus"
          },
          {
            title: "Settings",
            link: Actions.profile,
            key: "_courses-settings",
            iconName: "cog"
          },
          {
            title: "About",
            link: Actions.about,
            key: "_courses-about",
            iconName: "info-circle"
          }
        ];
      default:
        return [
          {
            title: "Speedgolfers",
            link: Actions.friends,
            key: "_feed-followed-users",
            iconName: "users"
          }, // didnt have user friends in this version
          {
            title: "Settings",
            link: Actions.profile,
            key: "_feed-settings",
            iconName: "cog"
          },
          {
            title: "About",
            link: Actions.about,
            key: "_feed-about",
            iconName: "info-circle"
          }
        ];
    }
  };

  render() {
    const drawerItems = this.getDrawerMenuOptions();
    return (
      <View style={styles.menuContainer}>
        {this.getProfileRow()}
        {drawerItems.map(menuItem => {
          return (
            <TouchableOpacity
              onPress={() => menuItem.link()}
              key={menuItem.key}
            >
              <View style={styles.menuItemContainer} key={menuItem.key}>
                <Icon
                  style={styles.menuItemIcon}
                  name={menuItem.iconName}
                  color={COLORS.pureWhite}
                  size={20}
                />
                <Text key={menuItem.key} style={styles.menuItemText}>
                  {menuItem.title}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          onPress={() => {
            firebase
              .auth()
              .signOut()
              .then(() => {
                resetStore();
                Actions.reset("auth");
              });
          }}
        >
          <View style={styles.menuItemContainer}>
            <Icon
              style={styles.menuItemIcon}
              name={"sign-out"}
              color={COLORS.pureWhite}
              size={20}
            />
            <Text style={styles.menuItemText}>Sign Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let { currentUser } = state;

  return {
    currentUser
  };
};

DrawerMenu = connect(mapStateToProps)(DrawerMenu);

const styles = StyleSheet.create({
  menuContainer: {
    backgroundColor: COLORS.blue,
    flex: 1,
    flexDirection: "column",
    paddingTop: 50,
    paddingLeft: "10%"
  },
  menuItemContainer: {
    flex: 0,
    flexDirection: "row",
    marginVertical: 10
  },
  menuItemText: {
    color: COLORS.pureWhite,
    fontSize: 20
  },
  menuItemIcon: {
    paddingRight: 10
  }
});
