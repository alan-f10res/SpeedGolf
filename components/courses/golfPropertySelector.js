import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Autocomplete from "react-native-autocomplete-input";
import { connect } from "react-redux";

const otherOption = {
  id: 0,
  fullAddress: "",
  propertyName: "Other"
};

export class GolfPropertySelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: ""
    };
  }

  filterData = query => {
    let { golfPropertiesList, golfPropertiesLookup } = this.props;

    if (!golfPropertiesList) {
      return [otherOption];
    }

    query = query.toLowerCase();
    let dataOut = [];

    let propertiesKeys = Object.keys(golfPropertiesLookup);
    propertiesKeys.forEach((golfPropertyId, index) => {
      let rowData = golfPropertiesLookup[golfPropertyId];
      let rowDataString =
        rowData.propertyName.toLowerCase() + rowData.fullAddress.toLowerCase();
      if (rowDataString.indexOf(query) > -1) {
        dataOut.push(rowData);
      }
    });
    dataOut.push(otherOption);
    return dataOut;
  };

  render() {
    const { query } = this.state;
    const { styleOverride } = this.props;
    let data = this.filterData(query);

    return (
      <View style={styleOverride}>
        <View style={[styles.autocompleteContainer]}>
          <Autocomplete
            hideResults={!query || query.length === 0}
            autoCapitalize="none"
            autoCorrect={false}
            data={data}
            defaultValue={query}
            containerStyle={{ marginVertical: 10 }}
            onChangeText={text => this.setState({ query: text })}
            listStyle={{ position: "relative", zIndex: 4 }}
            renderItem={golfProperty => {
              return (
                <TouchableOpacity
                  style={{
                    paddingVertical: 10,
                    paddingLeft: 5
                  }}
                  onPress={() => {
                    this.props.selectCallback(golfProperty);
                    this.setState({
                      query: ""
                    });
                  }}
                >
                  <Text>{golfProperty.propertyName}</Text>
                </TouchableOpacity>
              );
            }}
            placeholder="Select Property or Pick 'Other' to Enter a New Property"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: "relative",
    right: 0,
    top: 0,
    zIndex: 3
  },
  container: {
    backgroundColor: "#F5FCFF",
    flex: 1,
    paddingTop: 25
  },
  itemText: {
    fontSize: 15,
    margin: 2
  },
  descriptionContainer: {
    // `backgroundColor` needs to be set otherwise the
    // autocomplete input will disappear on text input.
    backgroundColor: "#F5FCFF",
    marginTop: 8
  },
  infoText: {
    textAlign: "center"
  },
  titleText: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center"
  },
  directorText: {
    color: "grey",
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center"
  },
  openingText: {
    textAlign: "center"
  }
});

const mapStateToProps = (state, ownProps) => {
  let { golfPropertiesList, golfPropertiesLookup } = state;

  return {
    golfPropertiesList,
    golfPropertiesLookup
  };
};

GolfPropertySelector = connect(mapStateToProps)(GolfPropertySelector);
