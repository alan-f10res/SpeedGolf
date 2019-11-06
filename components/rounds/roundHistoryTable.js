import React, { Component } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions
} from "react-native";
import { Table, TableWrapper, Row } from "react-native-table-component";
import moment from "moment";
import { connect } from "react-redux";
import Icon from "react-native-vector-icons/FontAwesome";
import { SearchBar } from "react-native-elements";

import { COLORS } from "../../styles/colors";
import { formatDate } from "../../lib/formatters";

const COLUMN_ORDER = [
  "DATE",
  "COURSE",
  "SGS",
  "STROKES",
  "TIME",
  "COMMENTS",
  "IMAGE"
];

const SORT_KEYS = {
  DATE: "DATE",
  COURSE: "COURSE",
  SGS: "SGS",
  STROKES: "STROKES",
  TIME: "TIME",
  COMMENTS: "COMMENTS",
  IMAGE: "IMAGE"
};

const SORT_TYPES = {
  TIME: "TIME",
  ALPHABETICAL: "ALPHABETICAL",
  NUMERICAL: "NUMERICAL",
  DATE: "DATE"
};

const COLUMN_SORT_TYPE = {
  DATE: SORT_TYPES.DATE,
  COURSE: SORT_TYPES.ALPHABETICAL,
  SGS: SORT_TYPES.TIME,
  STROKES: SORT_TYPES.NUMERICAL,
  TIME: SORT_TYPES.TIME,
  COMMENTS: SORT_TYPES.ALPHABETICAL,
  IMAGE: SORT_TYPES.ALPHABETICAL
};

let screenWidth = Dimensions.get("window").width;

export class RoundHistoryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      widthArr: [100, 100, 100, 100, 100, 100, 100],
      sortKey: SORT_KEYS.DATE,
      sortDirection: "asc",
      searchText: ""
    };
  }

  generateTableHeaders = () => {
    return COLUMN_ORDER.map(columnName => {
      return this.elementButton(columnName);
    });
  };

  headerPressed = value => {
    const { sortKey, sortDirection } = this.state;

    if (value !== sortKey) {
      //set new sort key and direction
      this.setState({
        sortKey: value,
        sortDirection: "asc"
      });
    } else {
      // toggle sort direction
      let newDirection = sortDirection === "asc" ? "desc" : "asc";
      this.setState({
        sortDirection: newDirection
      });
    }
  };

  elementButton = value => {
    const { sortKey, sortDirection } = this.state;
    let additionalStyle = null;
    let additionalIcon = null;

    if (sortKey === value) {
      additionalStyle = styles.btnSortedText;
      if (sortDirection === "asc") {
        additionalIcon = "sort-asc";
      } else {
        additionalIcon = "sort-desc";
      }
      additionalIcon = (
        <Icon name={additionalIcon} color={COLORS.pureWhite} size={20} />
      );
    } else {
      additionalIcon = <Icon name="sort" color={COLORS.mediumGrey} size={20} />;
    }

    return (
      <TouchableOpacity
        style={{
          flex: 0,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center"
        }}
        onPress={() => this.headerPressed(value)}
      >
        <Text style={[styles.btnText, additionalStyle]}>{value}</Text>
        {additionalIcon}
      </TouchableOpacity>
    );
  };

  convertSpeedGolfScoreToRaw = speedGolfScore => {
    if (!speedGolfScore) {
      return;
    }
    let pieces = speedGolfScore.split(":");
    let stringResult = `${pieces[0]}.${pieces[1]}`;
    return parseFloat(stringResult);
  };

  generateSortCompareFunction = () => {
    const { sortKey, sortDirection } = this.state;
    const sortFunction = (a, b) => {
      return null;
    };

    if (!sortKey) {
      return sortFunction;
    } else {
      let columnIndex = COLUMN_ORDER.indexOf(sortKey);
      let columnSortBy = COLUMN_SORT_TYPE[sortKey];

      if (columnSortBy === SORT_TYPES.TIME) {
        if (sortDirection === "asc") {
          return (a, b) => {
            return (
              this.convertSpeedGolfScoreToRaw(a[columnIndex]) -
              this.convertSpeedGolfScoreToRaw(b[columnIndex])
            );
          };
        } else {
          return (a, b) => {
            return (
              this.convertSpeedGolfScoreToRaw(b[columnIndex]) -
              this.convertSpeedGolfScoreToRaw(a[columnIndex])
            );
          };
        }
      } else if (columnSortBy === SORT_TYPES.DATE) {
        if (sortDirection === "asc") {
          return (a, b) => {
            return (
              moment(a[columnIndex]).unix() - moment(b[columnIndex]).unix()
            );
          };
        } else {
          return (a, b) => {
            return (
              moment(b[columnIndex]).unix() - moment(a[columnIndex]).unix()
            );
          };
        }
      } else {
        if (sortDirection === "asc") {
          return (a, b) => {
            return a[columnIndex] - b[columnIndex];
          };
        } else {
          return (a, b) => {
            return b[columnIndex] - a[columnIndex];
          };
        }
      }
    }
  };

  generateTableData = roundHistory => {
    let unsortedTableData = [];
    for (let i = 0; i < roundHistory.length; i += 1) {
      const roundInstance = roundHistory[i];

      let rowData = [];
      // row instance:
      // comments: [{…}]
      // datePlayed: (3) [2019, 6, 8]
      // golfCourseId: "0mOgAllv9HWrTJv2JVOD"
      // id: "HZdnMicCwn5D3tNkMA3W"
      // imageUrl: "https://firebasestorage.googleapis.com/v0/b/speedscore-track.appspot.com/o/rounds%2FHZdnMicCwn5D3tNkMA3W%2FroundImage.jpg?alt=media&token=03ab26a2-dfcf-409d-a969-51beeaf16e13"
      // likedBy: []
      // roundComment: "Fun round up in Evergreen! "
      // roundType: "Practice Round"
      // scoreCardType: 0
      // speedgolfScore: "202:11"
      // totalMinutes: 114
      // totalSeconds: 11
      // totalStrokes: "88"
      // totalTime: "114:11"
      // userId: "0asJEreLWUXug5QQIBM5XwEpVt62"

      const imageUrl = roundInstance.imageUrl;
      const totalScore = roundInstance.speedgolfScore;
      const roundTime = roundInstance.totalTime;
      const strokes = roundInstance.totalStrokes;
      const golfCourseId = roundInstance.golfCourseId;
      const golfCourse = 0; // load up property look up
      const comments = roundInstance.comments;
      const commentCount = comments.length;
      const dateTime = roundInstance.datePlayed;
      const key = roundInstance.id;

      // manually make sure this lines up with column headers.
      rowData = [
        `${moment(dateTime).format("L")}`,
        `${golfCourse}`,
        `${totalScore}`,
        `${strokes}`,
        `${roundTime}`,
        `${commentCount}`,
        `${imageUrl ? "View" : "Upload"}`
      ];

      unsortedTableData.push(rowData);
    }
    let sortedTableData;

    if (this.state.sortKey === SORT_KEYS.COURSE) {
      sortedTableData = unsortedTableData.sort();
      if (this.state.sortDirection === "desc") {
        sortedTableData.reverse();
      }
    } else {
      let compareFunction = this.generateSortCompareFunction();
      sortedTableData = unsortedTableData.sort((a, b) => compareFunction(a, b));
    }
    return sortedTableData;
  };

  debouncedSearch = newText => {
    this.setState({
      searchText: newText
    });
  };

  clearSearch = () => {
    this.setState({
      searchText: ""
    });
  };

  applySearchTerm = tableData => {
    let { searchText } = this.state;

    if (!searchText) {
      return tableData;
    }

    let tableDataOut = [];

    searchText = searchText.toLowerCase();

    for (let i = 0; i < tableData.length; i++) {
      let tableRow = tableData[i];
      let tableRowString = tableRow.join("").toLowerCase();
      if (tableRowString.indexOf(searchText) > -1) {
        tableDataOut.push(tableRow);
      }
    }
    return tableDataOut;
  };

  render() {
    const state = this.state;
    let tableData = this.generateTableData(this.props.roundsList);
    if (state.searchText) {
      tableData = this.applySearchTerm(tableData);
    }

    return (
      <View style={styles.container}>
        <SearchBar
          lightTheme
          onChangeText={this.debouncedSearch}
          onClearText={this.clearSearch}
          clearIcon={{ color: "#86939e", name: "close" }}
          placeholder={"Search rounds..."}
          containerStyle={{
            backgroundColor: "white",
            borderWidth: 0,
            borderColor: "white"
          }}
          inputStyle={{
            borderWidth: 0
          }}
        />
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
          <View>
            <Table borderStyle={{ borderColor: "#C1C0B9" }}>
              <Row
                data={this.generateTableHeaders()}
                widthArr={state.widthArr}
                style={styles.header}
                textStyle={styles.headerText}
              />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table borderStyle={{ borderColor: "#C1C0B9" }}>
                {tableData.map((rowData, index) => (
                  <Row
                    key={index}
                    data={rowData}
                    widthArr={state.widthArr}
                    style={[
                      styles.row,
                      index % 2 && { backgroundColor: COLORS.pureWhite }
                    ]}
                    textStyle={[
                      styles.alternateRowText,
                      index % 2 && styles.text
                    ]}
                  />
                ))}
              </Table>
            </ScrollView>
          </View>
        </ScrollView>
        <View
          style={{
            flex: 1,
            width: screenWidth,
            flexDirection: "row",
            justifyContent: "center",
            paddingTop: 10
          }}
        >
          <Icon
            name={"chevron-left"}
            size={30}
            color={COLORS.mediumGrey}
            style={{ paddingHorizontal: 10 }}
          />
          <Icon
            name={"hand-o-up"}
            size={30}
            color={COLORS.mediumGrey}
            style={{ paddingHorizontal: 10 }}
          />
          <Icon
            name={"chevron-right"}
            size={30}
            color={COLORS.mediumGrey}
            style={{ paddingHorizontal: 10 }}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    roundsList: state.roundsList
  };
};

RoundHistoryTable = connect(mapStateToProps)(RoundHistoryTable);

const styles = StyleSheet.create({
  header: { height: 50, backgroundColor: COLORS.blue },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: COLORS.lightBlue },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
    paddingRight: 0
  },
  singleHead: { width: 80, height: 40, backgroundColor: "#c8e1ff" },
  head: { flex: 1, backgroundColor: "#c8e1ff" },
  title: { flex: 2, backgroundColor: "#f6f8fa" },
  titleText: { marginRight: 6, textAlign: "right" },
  text: { textAlign: "center", color: COLORS.blue },
  headerText: { textAlign: "center", color: COLORS.pureWhite },
  alternateRowText: { textAlign: "center", color: COLORS.pureWhite },
  btn: {
    width: "auto",
    height: 18,
    marginLeft: 15,
    borderRadius: 2
  },
  btnText: { textAlign: "center", color: COLORS.pureWhite },
  btnSortedText: { fontWeight: "bold" }
});
