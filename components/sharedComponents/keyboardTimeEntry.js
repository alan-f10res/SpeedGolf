/**
 *
 *
 * A generic Time Entry Input for reuse across the app
 *
 *
 * should take a raw text input
 * should convert it to mm:ss for display
 * should allow a callback function
 *
 * Examples
 * 0 => 0:00
 * 1 => 0:01
 * 10 => 0:10
 * 103 => 1:03
 * 1034 => 10:34
 * 10345 => 10:34
 *
 * To manually test, you may copy these examples into the render function:
 *
 * console.log('testing time input 0 ', this.formatTimeText('0'));
 * console.log('testing time input 10 ', this.formatTimeText('10'));
 * console.log('testing time input 103', this.formatTimeText('103'));
 * console.log('testing time input 1034 ', this.formatTimeText('1034'));
 * console.log('testing time input 10345 ', this.formatTimeText('10345'));
 *
 */
import React, { Component } from "react";
import { View, TextInput } from "react-native";
import { COLORS } from "../../styles/colors";

export class KeyboardTimeEntry extends Component {
  constructor(props) {
    super(props);

    this.state = {
      minutes: props.minutes || 0,
      seconds: props.seconds || 0,
      displayTime: props.value || null
    };
  }

  stripLeadingZeroes = rawInput => {
    return parseInt(rawInput).toString();
  };

  // keep a colon in the second place
  formatTimeText = rawInput => {
    if (!rawInput) {
      return "";
    }

    rawInput = this.stripLeadingZeroes(rawInput);

    switch (rawInput.length) {
      case 0:
        return "";
      case 1:
        return `0:0${rawInput}`;
      case 2:
        return `0:${rawInput}`;
      case 3:
        return `${rawInput.slice(0, 1)}:${rawInput.slice(1)}`;
      case 4:
        return `${rawInput.slice(0, 2)}:${rawInput.slice(2)}`;
      default:
        return `${rawInput.slice(0, 2)}:${rawInput.slice(2, 4)}`;
    }
  };

  formatAndSaveTime = callback => {
    const { displayTime } = this.state;

    if (!displayTime) {
      return;
    }

    let colonIndex = displayTime.indexOf(":");
    let minutes = displayTime.slice(0, colonIndex);
    let seconds = displayTime.slice(colonIndex + 1);

    // check that we don't have a weird seconds column
    if (parseInt(seconds) >= 60) {
      minutes = this.stripLeadingZeroes((parseInt(minutes) + 1).toString());
      // add leading zero to seconds if needed
      seconds = (parseInt(seconds) - 60).toString();
    }

    if (seconds.length === 1) {
      seconds = `0${seconds}`;
    }

    const newState = {
      displayTime: `${minutes}:${seconds}`,
      minutes,
      seconds
    };
    this.setState(newState);

    callback && callback(newState);
  };

  updateTimeValue = newValue => {
    let output = newValue;

    if (newValue.includes(":")) {
      const spliceIndex = newValue.indexOf(":");
      let firstChunk = newValue.slice(0, spliceIndex);
      let secondChunk = newValue.slice(spliceIndex + 1);

      // strip out 0's
      firstChunk = this.stripLeadingZeroes(firstChunk);
      secondChunk = this.stripLeadingZeroes(secondChunk);

      output = firstChunk.toString() + secondChunk.toString();
    }

    output = this.formatTimeText(output);

    this.setState({
      displayTime: output
    });
  };

  render() {
    const {
      reference,
      style,
      placeholder,
      onFocus,
      onSubmitEditing,
      onBlur
    } = this.props;

    return (
      <TextInput
        ref={reference}
        style={style}
        textAlignVertical={"center"}
        placeholderTextColor={COLORS.mediumGrey}
        keyboardType="number-pad"
        multiline={false}
        placeholder={placeholder}
        value={this.state.displayTime}
        onFocus={onFocus}
        onChangeText={newValue => {
          this.updateTimeValue(newValue);
        }}
        onSubmitEditing={() => {
          this.formatAndSaveTime(
            onSubmitEditing && (newState => onSubmitEditing(newState))
          );
        }}
        onBlur={() =>
          this.formatAndSaveTime(onBlur && (newState => onBlur(newState)))
        }
        returnKeyType={"done"}
        blurOnSubmit={false}
      />
    );
  }
}
