import React, { Component } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { ButtonGroup, FormLabel, FormInput } from "react-native-elements";
import { COLORS } from "../../styles/colors";
import { STYLES } from "../../styles/styles";

const DISTANCE_OPTIONS = {
  0: "Yards",
  1: "Meters"
};

const RUNNING_OPTIONS = {
  0: "Miles",
  1: "Kilometers"
};

const DISTANCE_MULTIPLIERS = {
  0: 0.9144, // yards to meters
  1: 1.09361 // meters to yards
};

const RUNNING_MULTIPLIERS = {
  0: 1.60934, // miles to km
  1: 0.621371 // km to miles
};

export class ToggleableDistanceEntry extends Component {
  constructor(props) {
    super(props);
    const { typeOfDistance, initialValue } = props;

    let unitOptions, multipliers, roundDigits;

    if (typeOfDistance === "distance") {
      unitOptions = DISTANCE_OPTIONS;
      multipliers = DISTANCE_MULTIPLIERS;
      roundDigits = 0;
    } else {
      unitOptions = RUNNING_OPTIONS;
      multipliers = RUNNING_MULTIPLIERS;
      roundDigits = 1;
    }

    this.state = {
      typeOfDistance,
      value: initialValue || 0,
      unitOptions,
      multipliers,
      unit: unitOptions[0],
      selectedIndex: 0,
      roundDigits
    };
  }

  stringifyValue = rawValue => {
    if (rawValue || rawValue === 0) {
      return rawValue.toString();
    }
    return "";
  };

  updateValue = newValue => {
    this.setState({
      value: this.stringifyValue(newValue)
    });

    this.props.onUpdate && this.props.onUpdate(newValue);
  };

  toggleUnit = newIndex => {
    const { selectedIndex, value, multipliers, roundDigits } = this.state;

    if (newIndex === selectedIndex) {
      return;
    }

    const multiplier = multipliers[selectedIndex];
    const newValue = (value * multiplier).toFixed(roundDigits);
    this.setState({ selectedIndex: newIndex, value: newValue });
  };

  render() {
    const { label, readOnly } = this.props;
    const { unitOptions, selectedIndex } = this.state;
    return (
      <View style={styles.root}>
        <FormLabel labelStyle={STYLES.formLabel}>
          {label} ({unitOptions[selectedIndex]})
        </FormLabel>
        <FormInput
          editable={!readOnly}
          containerStyle={{
            borderBottomColor: COLORS.blue
          }}
          inputStyle={{
            color: COLORS.blue
          }}
          keyboardType="decimal-pad"
          value={this.stringifyValue(this.state.value)}
          onChangeText={this.updateValue}
        />
        <ButtonGroup
          selectedIndex={this.state.selectedIndex}
          onPress={this.toggleUnit}
          buttons={[unitOptions[0], unitOptions[1]]}
          selectedButtonStyle={{ backgroundColor: COLORS.blue }}
          selectedTextStyle={{ color: COLORS.lightGrey, fontWeight: "bold" }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    alignSelf: "center"
  }
});
