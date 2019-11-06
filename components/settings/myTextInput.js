import React, { PureComponent } from "react";
import { View } from "react-native";
import {
  FormInput,
  FormValidationMessage,
  FormLabel
} from "react-native-elements";
import { COLORS } from "../../styles/colors";
import { STYLES } from "../../styles/styles";

export class MyTextInput extends PureComponent {
  _handleChange = value => {
    this.props.onChange && this.props.onChange(this.props.name, value);
  };

  _handleTouch = () => {
    this.props.onTouch && this.props.onTouch(this.props.name);
  };

  render() {
    const { label, error, styleOverride, ...rest } = this.props;
    return (
      <View style={[{ alignSelf: "center", width: "100%" }, styleOverride]}>
        <FormLabel labelStyle={STYLES.formLabel}>{label}</FormLabel>
        <FormInput
          onBlur={this._handleTouch}
          onChangeText={this._handleChange}
          placeholder={this.props.value && this.props.value.toString() || label}
          inputStyle={{
            color: COLORS.blue
          }}
          containerStyle={{
            borderBottomColor: COLORS.blue,
            position: "relative",
            left: -20,
            width: '100%'
          }}
          {...rest}
        />
        {error && <FormValidationMessage>{error}</FormValidationMessage>}
      </View>
    );
  }
}
