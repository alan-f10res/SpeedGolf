import React, { Component } from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import { COLORS } from "../../../styles/colors";
import { PAR_TO_TIME_LOOKUP } from "../../../lib/golfUtility";
import { KeyboardTimeEntry } from "../../sharedComponents/keyboardTimeEntry";

export class ScoreCardRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      strokes: props.strokes
    };
  }

  render() {
    const {
      isHeader,
      hole,
      par,
      updateStrokes,
      updateTime,
      readOnly,
      setHole,
      advanceToTimeCell,
      advanceHole
    } = this.props;

    return (
      <View style={styles.rowContainer} key={isHeader ? "header" : hole}>
        <View style={styles.cellContainer}>
          {isHeader ? (
            <Text style={styles.headerCellText}>Hole</Text>
          ) : (
            <Text style={styles.normalCellText}>{hole}</Text>
          )}
        </View>
        <View style={styles.cellContainer}>
          {isHeader ? (
            <Text style={styles.headerCellText}>Par</Text>
          ) : (
            <Text style={styles.normalCellText}>{par}</Text>
          )}
        </View>
        <View style={styles.cellContainer}>
          {isHeader ? (
            <Text style={styles.headerCellText}>Strokes</Text>
          ) : (
            <TextInput
              ref={this.props.setRef && this.props.setRef(hole, "strokes")}
              editable={!readOnly}
              style={styles.normalCellText}
              placeholder={this.props.par && this.props.par.toString()}
              placeholderTextColor={COLORS.lightGrey}
              keyboardType="number-pad"
              multiline={false}
              onChangeText={newValue => {
                this.setState({
                  strokes: newValue
                });
              }}
              textAlignVertical={"center"}
              onSubmitEditing={() => {
                updateStrokes(this.props.hole, this.state.strokes);
                advanceToTimeCell(this.props.hole);
              }}
              onBlur={() => {
                updateStrokes(this.props.hole, this.state.strokes);
              }}
              value={this.state.strokes && this.state.strokes.toString()}
              returnKeyType={"done"}
              blurOnSubmit={false}
            />
          )}
        </View>
        <View style={styles.cellContainer}>
          {isHeader ? (
            <Text style={styles.headerCellText}>Time</Text>
          ) : (
            <KeyboardTimeEntry
              reference={this.props.setRef && this.props.setRef(hole, "time")}
              placeholder={this.props.par && PAR_TO_TIME_LOOKUP[this.props.par]}
              style={styles.normalCellText}
              onFocus={() => {
                setHole(hole);
              }}
              onSubmitEditing={({ displayTime, minutes, seconds }) => {
                updateTime(hole, [minutes, seconds]);
                advanceHole(hole);
              }}
              onBlur={({ displayTime, minutes, seconds }) => {
                updateTime(hole, [minutes, seconds]);
              }}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  rowContainer: {
    borderWidth: 1,
    borderColor: COLORS.mediumGrey,
    flexDirection: "row",
    backgroundColor: "white",
    alignSelf: "center",
    height: 40
  },
  cellContainer: {
    borderRightWidth: 1,
    borderColor: COLORS.mediumGrey,
    flex: 1,
    paddingHorizontal: 10
  },
  headerCellText: {
    fontWeight: "bold",
    color: COLORS.blue,
    fontSize: 16,
    textAlign: "center",
    paddingTop: 10
  },
  normalCellText: {
    color: COLORS.blue,
    fontSize: 16,
    textAlign: "center",
    paddingTop: 10
  }
});
