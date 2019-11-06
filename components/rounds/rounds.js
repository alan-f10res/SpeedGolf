import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";

import { STYLES } from "../../styles/styles";
import { FloatingActionButton } from "../sharedComponents/floatingActionButton";
import { YourRound } from "./yourRound";
import { closeRoundSearch } from "../../state/roundsDisplay";
import { SearchBar } from "react-native-elements";
import { Actions } from "react-native-router-flux";
import { COLORS } from "../../styles/colors";

export class Rounds extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchTerm: ""
    };
  }

  resetSearchTerm = () => {
    this.setState({
      searchTerm: ""
    });
  };

  updateSearchTerm = newTerm => {
    this.setState({
      searchTerm: newTerm
    });
  };

  renderSearchBar = () => {
    if (this.props.showSearch) {
      return (
        <SearchBar
          lightTheme
          onClearText={() => {
            if (this.state.searchTerm === "") {
              this.props.dispatch(closeRoundSearch());
            } else {
              this.resetSearchTerm();
            }
          }}
          onChangeText={newTerm => this.updateSearchTerm(newTerm)}
          placeholder="Search rounds"
          clearIcon={{ color: "#86939e", name: "close" }}
        />
      );
    }
    return null;
  };

  renderSortBar = () => {
    if (this.props.showSort) {
      return (
        <View>
          <Text>SORT</Text>
        </View>
      );
    }

    return null;
  };

  renderEmptyState = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: 20
        }}
      >
        <Text>No Rounds Logged</Text>
        <TouchableOpacity onPress={Actions.logRound} style={styles.button}>
          <Text style={styles.buttonText}>Log a round now</Text>
        </TouchableOpacity>
      </View>
    );
  };

  hasRoundsToRender = () => {
    return this.props.rounds && this.props.rounds.length > 0;
  };

  renderRounds = () => {
    return this.props.rounds.map(round => {
      return <YourRound id={round.id} key={round.id} />;
    });
  };

  renderBody = () => {
    if (this.hasRoundsToRender()) {
      return this.renderRounds();
    } else {
      return this.renderEmptyState();
    }
  };

  render() {
    return (
      <View style={STYLES.container}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          style={{
            width: "100%",
            flex: 1
          }}
        >
          {this.renderSearchBar()}
          {this.renderSortBar()}
          {this.renderBody()}
        </ScrollView>
        <FloatingActionButton
          iconName="pencil"
          fabCallback={() => Actions.logRound()}
        />
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    showSearch: state.roundsDisplay.showSearch,
    showSort: state.roundsDisplay.showSort,
    rounds: state.roundsList,
    roundLookup: state.roundLookup
  };
};

Rounds = connect(mapStateToProps)(Rounds);

const styles = StyleSheet.create({
  button: {
    padding: 20,
    backgroundColor: COLORS.blue,
    borderRadius: 5,
    marginVertical: 15
  },
  buttonText: {
    color: COLORS.pureWhite,
    textAlign: "center"
  }
});
