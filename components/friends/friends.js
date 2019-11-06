import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity
} from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { COLORS } from "../../styles/colors";
import { FormLabel } from "react-native-elements";
import { FriendRow } from "./friendRow";
import { FriendButton } from "./friendActionButton";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import { followPlayer, unFollowPlayer } from "../../state/follows.state";

export class Friends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      rawData: this.props.playerList
    };
  }

  _filterData = query => {
    let { rawData } = this.state;
    if (query === "") {
      return [];
    }

    query = query.toLowerCase();
    let dataOut = [];
    for (let i = 0; i < rawData.length; i++) {
      const rowData = rawData[i];

      if (rowData.id !== this.props.currentUser.id) {
        const rowDataString = `${rowData.firstName} + ${
          rowData.lastName
        }`.toLowerCase();
        if (rowDataString.indexOf(query) > -1) {
          dataOut.push(rowData);
        }
      }
    }
    return dataOut;
  };

  followPlayerCallback = playerId => {
    let { following } = this.props;

    if (following.indexOf(playerId) > -1) {
      return;
    }

    this.props.dispatch(followPlayer(playerId));

    this.setState({
      query: ""
    });
  };

  unfollowPlayer = playerId => {
    let { following } = this.props;
    let indexOfPlayer = following.indexOf(playerId);

    if (indexOfPlayer === -1) {
      return;
    }

    let followingCopy = [...following];
    followingCopy.splice(indexOfPlayer, 1);

    this.props.dispatch(unFollowPlayer(playerId))

    this.setState({
      query: ""
    });
  };

  render() {
    const { followers, following } = this.props;
    const { query } = this.state;
    const data = this._filterData(query);

    return (
      <View>
        <View style={styles.autocompleteContainer}>
          <Autocomplete
            autoCapitalize="none"
            autoCorrect={false}
            data={data}
            defaultValue={query}
            onChangeText={text => this.setState({ query: text })}
            containerStyle={{ margin: 10 }}
            listStyle={{ position: "relative", zIndex: 4 }}
            renderItem={player => {
              return (
                <View style={styles.rowContainer}>
                  <View style={styles.leftContent}>
                    <View style={styles.avatarContainer}>
                      <Icon
                        name={this.props.icon || "user"}
                        size={50}
                        color={COLORS.mediumGrey}
                      />
                    </View>
                    <View style={styles.nameContainer}>
                      <Text style={styles.nameText}>
                        {player.firstName} {player.lastName}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.rightContent}>
                    <View style={styles.buttonsContainer}>
                      <TouchableOpacity
                        onPress={() => this.followPlayerCallback(player.id)}
                        style={styles.buttonStyle}
                      >
                        <Text style={styles.buttonText}>Follow</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            }}
            placeholder="Search for Speedgolfers"
          />
        </View>
        <ScrollView>
          <View
            style={{
              backgroundColor: "white",
              paddingHorizontal: 20,
              paddingBottom: 20,
              marginTop: 60
            }}
          >
            <FormLabel color={COLORS.blue}>
              Following ({following.length})
            </FormLabel>
            <View>
              {following.map(playerId => {
                let button = (
                  <FriendButton
                    onPress={() => this.unfollowPlayer(playerId)}
                    title="Unfollow"
                  />
                );
                return (
                  <FriendRow id={playerId} buttons={button} key={playerId} />
                );
              })}
            </View>
          </View>
          <View
            style={{
              backgroundColor: "white",
              paddingHorizontal: 20,
              paddingBottom: 20,
              marginTop: 20
            }}
          >
            <FormLabel color={COLORS.blue}>
              Followers ({followers.length})
            </FormLabel>
            <View>
              {followers.map(playerId => {
                return <FriendRow id={playerId} key={playerId}/>;
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const { playerList, playerLookup, followers, following, currentUser } = state;
  return {
    playerList,
    playerLookup,
    followers,
    following,
    currentUser
  };
};

Friends = connect(mapStateToProps)(Friends);

const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1
  },
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
  buttonsContainer: { justifyContent: "flex-end" },
  buttonStyle: {
    backgroundColor: COLORS.lightGrey,
    borderColor: COLORS.mediumGrey,
    borderWidth: 1,
    marginHorizontal: 5,
    padding: 5
  },
  buttonText: {
    color: COLORS.blue,
    textAlign: "center"
  }
});
