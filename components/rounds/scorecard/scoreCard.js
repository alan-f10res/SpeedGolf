import React, { Component } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { ScoreCardRow } from "./scorecardRow";

export class ScoreCard extends Component {
  render() {
    let { scores, updateStrokes, readOnly, updateTime } = this.props;
    return (
      <View>
        <KeyboardAwareScrollView keyboardShouldPersistTaps="always">
          <ScoreCardRow key={"header"} isHeader={true} />
          {Object.keys(scores).map(holeIndex => {
            let scoreRow = scores[holeIndex];

            return (
              <ScoreCardRow
                setRef={this.props.setRef}
                readOnly={readOnly}
                updateStrokes={updateStrokes}
                updateTime={updateTime}
                key={holeIndex}
                hole={scoreRow.hole}
                par={scoreRow.par}
                minutes={scoreRow.minutes}
                seconds={scoreRow.seconds}
                strokes={scoreRow.strokes}
                advanceHole={this.props.advanceHole}
                advanceToTimeCell={this.props.advanceToTimeCell}
                setHole={this.props.setHole}
              />
            );
          })}
        </KeyboardAwareScrollView>
      </View>
    );
  }
}
