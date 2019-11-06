import React, {PureComponent} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {COLORS } from "../../styles/colors";

export class FriendButton extends PureComponent {

  render(){
    const { title, onPress }= this.props;
    return(
      <TouchableOpacity onPress={onPress} style={styles.buttonStyle}>
        <Text style={styles.buttonText}>
          {title}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: COLORS.lightGrey,
    borderColor: COLORS.mediumGrey,
    borderWidth: 1,
    marginHorizontal: 5,
    padding: 5
  },
  buttonText: {
    color: COLORS.blue,
    textAlign: 'center'
  }
})