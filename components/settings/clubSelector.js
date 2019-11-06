import React, { Component } from "react";
import { View, Text } from "react-native";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import { Button, FormLabel } from "react-native-elements";
import { COLORS } from "../../styles/colors";
import { STYLES } from "../../styles/styles";

const clubs = [
  {
    name: "Woods",
    id: 0,
    children: [
      { id: "11", name: "DRIVER" },
      { id: "12", name: "3W" },
      { id: "13", name: "5W" },
      { id: "14", name: "HYBRID" }
    ]
  },
  {
    name: "Irons",
    id: 1,
    children: [
      { id: "15", name: "2i" },
      { id: "16", name: "3i" },
      { id: "17", name: "4i" },
      { id: "18", name: "5i" },
      { id: "19", name: "6i" },
      { id: "20", name: "7i" },
      { id: "21", name: "8i" },
      { id: "22", name: "9i" }
    ]
  },
  {
    name: "Wedges",
    id: 2,
    children: [
      { id: "23", name: "PW" },
      { id: "24", name: "GW" },
      { id: "25", name: "SW" },
      { id: "26", name: "LW" }
    ]
  },
  {
    name: "Others",
    id: 3,
    children: [{ id: "27", name: "PUTTER" }]
  }
];

export class ClubSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: props.clubsInBag || []
    };
  }

  sortSelectedItems = selectedItems => {
    let sortedItems = selectedItems.sort();
    return sortedItems;
  };

  onSelectedItemsChange = selectedItems => {
    let sortedSelectedItems = this.sortSelectedItems(selectedItems);
    this.setState({ selectedItems: sortedSelectedItems });
    this.props.onChangeClubs(sortedSelectedItems);
  };

  render() {
    return (
      <View>
        <FormLabel labelStyle={STYLES.formLabel}>
          Clubs in Speedgolf Bag
        </FormLabel>
        <SectionedMultiSelect
          ref={SectionedMultiSelect =>
            (this.SectionedMultiSelect = SectionedMultiSelect)
          }
          items={clubs}
          hideSelect={this.state.selectedItems.length > 0}
          selectText={"(none selected)"}
          uniqueKey="id"
          subKey="children"
          showDropDowns={true}
          readOnlyHeadings={true}
          onSelectedItemsChange={this.onSelectedItemsChange}
          selectedItems={this.state.selectedItems}
          colors={{
            primary: COLORS.blue, //used for the dropdown toggle icon, the no results text and the background of the confirm button.
            success: COLORS.darkGrey, //	used for the selected checkmark icon.
            cancel: "#1A1A1A", //	used for the cancel button background
            text: "#2e2e2e", //Parent item text color
            subText: "#848787", //	Sub item text color
            selectToggleTextColor: "#333", //Select button text color
            searchPlaceholderTextColor: "#999", //Search input placeholder text color
            searchSelectionColor: "rgba(0,0,0,0.2)", //Search input text selection color
            // itemBackground: "#fff", //parent item background color
            // subItemBackground: "#ffffff", //sub item background color
            chipColor: COLORS.blue //chip color
          }}
          styles={{
            container: {
              marginVertical: 40
            },
            chipsWrapper: {
              marginHorizontal: 20
            },
            chipContainer: {
              backgroundColor: "white"
            },
            confirmText: {
              fontFamily: "system font"
            },
            itemText: {
              fontFamily: "system font",
              fontSize: 24
            },
            subItemText: {
              fontFamily: "system font",
              fontSize: 18
            },
            searchTextInput: {
              fontFamily: "system font"
            },
            searchBar: {
              fontFamily: "system font"
            },
            selectToggleText: {
              fontFamily: "system font",
              marginHorizontal: 20,
              color: COLORS.mediumGrey
            },
            selectedItem: {
              backgroundColor: "#D6EBF2"
            }
          }}
        />
        <Button
          title="Select Clubs"
          color={COLORS.pureWhite}
          buttonStyle={{
            backgroundColor: COLORS.blue
          }}
          onPress={() => this.SectionedMultiSelect._toggleSelector()}
        />
      </View>
    );
  }
}
