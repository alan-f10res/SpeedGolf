import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { ButtonGroup, FormLabel, FormInput } from "react-native-elements";
import { COLORS } from "../../styles/colors";
import { STYLES } from "../../styles/styles";

const OPTIONS = {
  0: "Fahrenheit",
  1: "Celsius"
};

const celsiusToFahrenheit = celsiusValue => {
  return celsiusValue * (9 / 5) + 32;
};
const fahrenheitToCelsius = fahrenheitValue => {
  return (fahrenheitValue - 32) * (5 / 9);
};

export class TemperatureEntry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "75",
      selectedIndex: 0
    };
  }

  stringifyValue = rawValue => {
    if (rawValue || rawValue === 0) {
      return rawValue.toString();
    }
    return null;
  };

  updateValue = newValue => {
    this.setState({
      value: this.stringifyValue(newValue)
    });
  };

  toggleUnit = newIndex => {
    const { value, selectedIndex } = this.state;

    if (newIndex === selectedIndex) {
      return;
    }

    let newValue;
    if (newIndex === 0) {
      newValue = celsiusToFahrenheit(value);
    } else {
      newValue = fahrenheitToCelsius(value);
    }

    if (newValue.toString().length > 3) {
      newValue = newValue.toFixed(1);
    }

    this.setState({ selectedIndex: newIndex, value: newValue });
  };

  render() {
    const { label } = this.props;
    return (
      <View style={styles.root}>
        <FormLabel labelStyle={STYLES.formLabel}>
          {label} ({OPTIONS[this.state.selectedIndex]})
        </FormLabel>
        <FormInput
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
          buttons={[OPTIONS[0], OPTIONS[1]]}
          selectedButtonStyle={{ backgroundColor: COLORS.blue }}
          selectedTextStyle={{ color: COLORS.lightGrey, fontWeight: "bold" }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    width: "90%",
    alignSelf: "center"
  }
});
