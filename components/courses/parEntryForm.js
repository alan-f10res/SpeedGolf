import React, { Component } from "react";
import { View, Text, TextInput } from "react-native";
import { COLORS } from "../../styles/colors";
import { PAR_TO_TIME_LOOKUP } from "../../lib/golfUtility";
import { FormInput, FormLabel } from "react-native-elements";
import { STYLES } from "../../styles/styles";

export class ParEntryForm extends Component {
  render() {
    return (
      <View>
        <View
          style={{
            paddingVertical: 10
          }}
        >
          <FormLabel
            labelStyle={STYLES.formLabel}
          >
            Tee Set
          </FormLabel>
          <FormInput
            autoCorrect={false}
            placeholder={"e.g. 'Blues', 'Reds', 'Masters', etc."}
            inputStyle={{
              color: COLORS.blue
            }}
            containerStyle={{
              borderBottomColor: COLORS.blue
            }}
            onChangeText={value => this.props.updateTeeSetName(value)}
          />
        </View>
        <View>
          <FormLabel
            labelStyle={STYLES.formLabel}
          >
            Hole-By-Hole Pars
          </FormLabel>
          <View style={{ marginTop: 10 }}>
            <ParEntryRow key={"header"} isHeader={true} />
            {Object.keys(this.props.holePars).map(holeIndex => {
              let scoreRow = this.props.holePars[holeIndex];
              return (
                <ParEntryRow
                  updateParForHole={this.props.updateHolePars}
                  key={holeIndex}
                  hole={holeIndex}
                  strokePar={scoreRow.strokePar}
                  timePar={scoreRow.timePar}
                />
              );
            })}
          </View>
        </View>
      </View>
    );
  }
}

class ParEntryRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      strokePar: props.strokePar
    };
  }
  render() {
    const { isHeader, hole, updateParForHole } = this.props;
    const headerStyle = isHeader ? { fontWeight: "bold" } : null;
    return (
      <View
        style={{
          width: "90%",
          borderWidth: 1,
          borderColor: COLORS.mediumGrey,
          flexDirection: "row",
          backgroundColor: "white",
          alignSelf: "center"
        }}
        key={isHeader ? "header" : hole}
      >
        <View
          style={{
            borderRightWidth: 1,
            borderColor: COLORS.mediumGrey,
            flex: 1,
            padding: 10
          }}
        >
          <Text
            style={[
              { color: COLORS.blue, fontSize: 16, textAlign: "center" },
              headerStyle
            ]}
          >
            {isHeader ? "Hole" : hole}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            padding: 10,
            borderRightWidth: 1,
            borderColor: COLORS.mediumGrey
          }}
        >
          {isHeader ? (
            <Text
              style={[
                { color: COLORS.blue, fontSize: 16, textAlign: "center" },
                headerStyle
              ]}
            >
              Stroke Par
            </Text>
          ) : (
            <TextInput
              style={[
                { color: COLORS.blue, fontSize: 16 },
                { textAlign: "center" }
              ]}
              placeholder={"Par"}
              placeholderTextColor={COLORS.lightGrey}
              keyboardType="number-pad"
              multiline={false}
              onChangeText={newValue => {
                this.setState({
                  strokePar: newValue
                });
              }}
              onBlur={() =>
                updateParForHole(
                  this.props.hole,
                  this.state.strokePar,
                  PAR_TO_TIME_LOOKUP[this.state.strokePar]
                )
              }
              value={this.state.strokePar && this.state.strokePar.toString()}
            />
          )}
        </View>
        <View
          style={{
            flex: 1,
            padding: 10,
            borderRightWidth: 1,
            borderColor: COLORS.mediumGrey
          }}
        >
          {isHeader ? (
            <Text
              style={[
                { color: COLORS.blue, fontSize: 16, textAlign: "center" },
                headerStyle
              ]}
            >
              Time Par
            </Text>
          ) : (
            <Text style={{ fontSize: 16, textAlign: "center" }}>
              {this.props.timePar}
            </Text>
          )}
        </View>
      </View>
    );
  }
}
