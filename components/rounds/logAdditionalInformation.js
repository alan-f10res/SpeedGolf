import React, { Component } from "react";
import { View, Text } from "react-native";
import { MyTextInput } from "../settings/myTextInput";
import { TemperatureEntry } from "../sharedComponents/temperatureEntry";
import { PressableInput } from "../settings/pressableInput";
import { FormLabel } from "react-native-elements";
import { STYLES } from "../../styles/styles";
import { FiveStarRating } from "../sharedComponents/fiveStarRating";
import Picker from "react-native-picker";
import { weatherOptions, windOptions } from "../pickers/pickerOptions";

export class AdditionalRoundInformation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fairwaysInRegulation: 0,
      greensInRegulation: 0,
      puttsTaken: 0,
      heartRate: 0,
      elevationGain: 0,

    };
  }

  launchWindPicker = (values, setFieldValue) => {
    Picker.init({
      pickerData: windOptions,
      selectedValue: values.windConditions,
      pickerTitleText: "Wind Conditions",
      onPickerConfirm: data => {
        setFieldValue("windConditions", data);
      }
    });

    Picker.show();
  };

  launchWeatherPicker = (values, setFieldValue) => {
    // todo fix weather
    Picker.init({
      pickerData: weatherOptions,
      selectedValue: values.weatherConditions,
      pickerTitleText: "Weather Conditions",
      onPickerConfirm: data => {
        setFieldValue("weatherConditions", data);
      },
      pickerTextEllipsisLen: 100
    });

    Picker.show();
  };

  render() {
    return (
      <View>
        <Text>Additional Information</Text>
        <View
          style={{
            backgroundColor: "pink"
          }}
        >
          <MyTextInput
            label="Fairways in Regulation"
            keyboardType="number-pad"
            value={values.fairwaysInRegulation}
            onChange={setFieldValue}
            onTouch={setFieldTouched}
            name="fairwaysInRegulation"
            error={touched.fairwaysInRegulation && errors.fairwaysInRegulation}
          />
          <MyTextInput
            label="Greens in Regulation"
            keyboardType="number-pad"
            value={values.greensInRegulation}
            onChange={setFieldValue}
            onTouch={setFieldTouched}
            name="greensInRegulation"
            error={touched.greensInRegulation && errors.greensInRegulation}
          />
          <MyTextInput
            label="Putts Taken"
            keyboardType="number-pad"
            value={values.puttsTaken}
            onChange={setFieldValue}
            onTouch={setFieldTouched}
            name="puttsTaken"
            error={touched.puttsTaken && errors.puttsTaken}
          />
        </View>
        <MyTextInput
          label="Average Heartrate (beats per minute)"
          keyboardType="decimal-pad"
          value={values.heartRate}
          onChange={setFieldValue}
          onTouch={setFieldTouched}
          name="heartRate"
          error={touched.heartRate && errors.heartRate}
        />
        <MyTextInput
          label="Elevation Gain"
          keyboardType="decimal-pad"
          value={values.elevationGain}
          onChange={setFieldValue}
          onTouch={setFieldTouched}
          name="elevationGain"
          error={touched.elevationGain && errors.elevationGain}
        />
        <TemperatureEntry label="Temperature" />
        <PressableInput
          onPress={() => {
            this.launchWindPicker(values, setFieldValue);
          }}
          label="Wind Conditions"
          value={values.windConditions}
          name="windConditions"
        />
        <PressableInput
          onPress={() => {
            this.launchWeatherPicker(values, setFieldValue);
          }}
          label="Weather Conditions"
          value={values.weatherConditions}
          name="weatherConditions"
        />
        <View>
          <FormLabel labelStyle={STYLES.formLabel}>
            Exertion
          </FormLabel>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <FiveStarRating
              ratingCallback={newVal =>
                this.setState({
                  exertionLevel: newVal
                })
              }
            />
          </View>
        </View>
      </View>
    );
  }
}
