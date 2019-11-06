import { StyleSheet } from "react-native";

import { COLORS } from "./colors";

export const STYLES = StyleSheet.create({
  formLabel: {
    color: COLORS.blue,
    position: "relative",
    left: -20
  },

  headerContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.blue,
    width: "100%",
    paddingVertical: 10
  },
  headerText: {
    color: COLORS.pureWhite,
    textAlign: "center",
    fontSize: 20
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  },
  actionContainer: {
    marginVertical: 10,
    flex: 0,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center"
  },

  // feed cards

  feedCardContainer: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    backgroundColor: COLORS.pureWhite,
    flex: 1,
    flexDirection: "row"
  },
  imageContainer: {
    flex: 3,
    flexDirection: "row",
    borderColor: "grey",
    borderWidth: 0,
    padding: 8,
    overflow: "hidden"
  },
  imageStyle: {
    flex: 1,
    height: "100%",
    aspectRatio: 1
  },
  textSection: {
    flex: 7,
    flexDirection: "row",
    padding: 8
  },
  bodyText: {
    fontSize: 16,
    paddingVertical: 2
  },

  touchableButton: {
    marginLeft: 8,
    height: 30,
    backgroundColor: COLORS.lightGrey,
    padding: 8,
    borderRadius: 4
  },
  innerButtonContainer: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center"
  },

  // Login Page

  pageContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: COLORS.pureWhite
  },
  loginHeaderContainer: {
    flex: 0,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: "10%"
  },
  loginHeaderText: {
    color: COLORS.blue,
    textAlign: "center",
    fontSize: 24
  },
  formContainer: {
    flex: 1,
    flexDirection: "column",
    paddingHorizontal: "10%",
    paddingVertical: "20%"
  },
  inputContainer: {
    flex: 0,
    flexDirection: "column",
    marginVertical: 10
  },
  inputLabel: {
    fontSize: 24
  },
  inputField: {
    borderColor: "black",
    borderWidth: 1,
    fontSize: 18,
    paddingVertical: 6,
    paddingHorizontal: 6
  },
  button: {
    backgroundColor: COLORS.blue,
    borderRadius: 5
  },
  buttonText: {
    color: COLORS.pureWhite,
    textAlign: "center",
    fontSize: 36,
    marginVertical: 15
  }
});
