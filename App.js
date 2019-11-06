import React, { Component } from "react";
import { Router, Stack, Scene, Actions, Modal } from "react-native-router-flux";
import { Alert, TouchableOpacity } from "react-native";
import { Provider } from "react-redux";
import { getStore } from "./state/dataTree";
import Icon from "react-native-vector-icons/FontAwesome";
import { COLORS } from "./styles/colors";
import { Login } from "./components/login/login";
import { SignUp } from "./components/register/signUp";
import { Rounds } from "./components/rounds/rounds";
import { DrawerMenu } from "./components/sharedComponents/drawerMenu";
import { Feed } from "./components/feed/feed";
import { Courses } from "./components/courses/courses";
import { Profile } from "./components/settings/profile";
import { SuccessfulRegistration } from "./components/register/registerSuccess";
import { LogRound } from "./components/rounds/logRound";
import { RoundHistoryTable } from "./components/rounds/roundHistoryTable";
import { Friends } from "./components/friends/friends";
import { SuggestACourse } from "./components/courses/suggestACourse";
import { Comments } from "./components/comments/comments";
import { CourseDetailCard } from "./components/courses/courseDetailCard";
import { CourseReviews } from "./components/courses/courseReviews";
import { PostReview } from "./components/courses/postReview";
import { RoundSummaryFullPage } from "./components/rounds/roundSummaryFullPage";
import { About } from "./components/about";
import { ForgotPassword } from "./components/login/forgotPassword";
import { SuccessModal } from "./components/sharedComponents/successModal";
import { refreshAppData } from "./state/currentUser.state";
import { getCurrentUserId } from "./lib/userUtility";
import { RequestTeeTimeForm } from "./components/courses/requestTeeTimeForm";
import { EditComment } from "./components/comments/editComments";
import { clearCurrentRound } from "./state/ui.state";
import { LoginWithEmail } from "./components/login/loginWithEmail";
import { ProfilePage } from "./components/sharedComponents/profilePage";

const iconSize = 24;
const getIconColor = props => {
  return props.focused ? props.activeTintColor : props.inactiveTintColor;
};

const getRefreshIconButton = () => {
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 20
      }}
      onPress={() => {
        getStore().dispatch(refreshAppData());
      }}
    >
      <Icon name="refresh" size={iconSize} color="white" />
    </TouchableOpacity>
  );
};

export default class App extends Component {
  render() {
    return (
      <Provider store={getStore()}>
        <Router>
          <Modal key="root">
            <Stack key="auth" hideNavBar>
              <Scene
                initial={true}
                back={false}
                gesturesEnabled={false}
                key="login"
                component={Login}
                title="Speedscore TRACK"
                navigationBarStyle={{ backgroundColor: COLORS.blue }}
                titleStyle={{ color: COLORS.pureWhite, fontSize: 24 }}
              />
              <Scene
                hideNavBar={false}
                key="forgotPassword"
                component={ForgotPassword}
                title="Forgot Password"
                navigationBarStyle={{ backgroundColor: COLORS.blue }}
                titleStyle={{ color: COLORS.pureWhite, fontSize: 24 }}
                back={true}
                backButtonTintColor={COLORS.lightGrey}
                lazy={true}
              />
              <Scene
                hideNavBar={false}
                key="signUp"
                component={SignUp}
                title="Email Sign Up"
                drawer={false}
                navigationBarStyle={{ backgroundColor: COLORS.blue }}
                titleStyle={{ color: COLORS.pureWhite, fontSize: 24 }}
                back={true}
                backButtonTintColor={COLORS.lightGrey}
                lazy={true}
              />
              <Scene
                hideNavBar={false}
                key={"loginWithEmail"}
                component={LoginWithEmail}
                title={"Email Login"}
                navigationBarStyle={{ backgroundColor: COLORS.blue }}
                titleStyle={{ color: COLORS.pureWhite, fontSize: 24 }}
                back={true}
                backButtonTintColor={COLORS.lightGrey}
                lazy={true}
              />
              <Scene
                title={""}
                back={false}
                hideNavBar={true}
                key="successfulRegistration"
                component={SuccessfulRegistration}
                lazy={true}
              />
            </Stack>
            <Stack
              key="homeStack"
              drawer={true}
              drawerIcon={() => (
                <Icon name="bars" color={COLORS.pureWhite} size={30} />
              )}
              headerMode="none"
              hideNavBar
              contentComponent={DrawerMenu}
              navigationBarStyle={{ backgroundColor: COLORS.orange }}
            >
              <Stack
                key="main"
                tabs={true}
                navigationBarStyle={{ backgroundColor: COLORS.blue }}
                titleStyle={{ color: COLORS.pureWhite }}
                activeBackgroundColor={COLORS.lightGrey}
                activeTintColor={COLORS.blue}
                inactiveBackgroundColor={COLORS.blue}
                inactiveTintColor={COLORS.pureWhite}
                headerMode="float"
                renderRightButton={getRefreshIconButton()}
              >
                <Scene
                  key="feed"
                  title="Feed"
                  component={Feed}
                  drawer={true}
                  icon={props => (
                    <Icon
                      name="th-list"
                      size={iconSize}
                      color={getIconColor(props)}
                    />
                  )}
                />
                <Scene
                  key="rounds"
                  title="My Rounds"
                  component={Rounds}
                  drawer={true}
                  icon={props => (
                    <Icon
                      name="history"
                      size={iconSize}
                      color={getIconColor(props)}
                    />
                  )}
                />
                <Scene
                  key="courses"
                  title="Courses"
                  component={Courses}
                  icon={props => (
                    <Icon
                      name="flag"
                      size={iconSize}
                      color={getIconColor(props)}
                    />
                  )}
                />
              </Stack>
            </Stack>

            <Scene
              component={ProfilePage}
              key={"profilePage"}
              drawer={false}
              back={true}
              backButtonTintColor={COLORS.lightGrey}
              lazy={true}
              navigationBarStyle={{ backgroundColor: COLORS.blue }}
              titleStyle={{ color: COLORS.pureWhite }}
            />

            <Scene
              component={About}
              key={"about"}
              title={"About"}
              drawer={"true"}
              navigationBarStyle={{ backgroundColor: COLORS.blue }}
              titleStyle={{ color: COLORS.pureWhite }}
              back={true}
              backButtonTintColor={COLORS.lightGrey}
              lazy={true}
            />
            <Scene
              navigationBarStyle={{ backgroundColor: COLORS.blue }}
              titleStyle={{ color: COLORS.pureWhite }}
              key="logRound"
              title="Log New Round"
              component={LogRound}
              hideTabBar={false}
              drawer={false}
              back={true}
              backButtonTintColor={COLORS.lightGrey}
              onBack={() => {
                Alert.alert(
                  "Are you sure?",
                  "All unsaved information will be cleared.",
                  [
                    {
                      text: "Cancel",
                      style: "cancel"
                    },
                    {
                      text: "Go Back",
                      onPress: () => {
                        getStore().dispatch(clearCurrentRound());
                        Actions.pop();
                      }
                    }
                  ],
                  { cancelable: true }
                );
              }}
              lazy={true}
            />
            <Scene
              navigationBarStyle={{ backgroundColor: COLORS.blue }}
              titleStyle={{ color: COLORS.pureWhite }}
              key={"friends"}
              component={Friends}
              title={"Speedgolfers"}
              back={true}
              backButtonTintColor={COLORS.lightGrey}
              onBack={Actions.pop}
              lazy={true}
            />
            <Scene
              title={"Round History"}
              component={RoundHistoryTable}
              lazy={true}
              back={true}
              key={"roundHistoryTable"}
              backButtonTintColor={COLORS.lightGrey}
              onBack={Actions.pop}
              navigationBarStyle={{ backgroundColor: COLORS.blue }}
              titleStyle={{ color: COLORS.pureWhite }}
            />

            <Scene
              title={"Round Summary"}
              component={RoundSummaryFullPage}
              lazy={true}
              back={true}
              key={"roundSummaryFullPage"}
              backButtonTintColor={COLORS.lightGrey}
              onBack={Actions.pop}
              navigationBarStyle={{ backgroundColor: COLORS.blue }}
              titleStyle={{ color: COLORS.pureWhite }}
              rightTitle={"Edit"}
              rightButtonTextStyle={{ color: COLORS.pureWhite }}
              onRight={() => Actions.logRound()}
            />

            <Scene
              title={"Suggest a Course"}
              component={SuggestACourse}
              lazy={true}
              back={true}
              key={"suggestACourse"}
              backButtonTintColor={COLORS.lightGrey}
              onBack={() => {
                Alert.alert(
                  "Are you sure?",
                  "All unsaved information will be cleared.",
                  [
                    {
                      text: "Cancel",
                      style: "cancel"
                    },
                    {
                      text: "Go Back",
                      onPress: () => Actions.pop()
                    }
                  ],
                  { cancelable: true }
                );
              }}
              navigationBarStyle={{ backgroundColor: COLORS.blue }}
              titleStyle={{ color: COLORS.pureWhite }}
            />
            <Scene
              title={"Course Details"}
              component={CourseDetailCard}
              lazy={true}
              back={true}
              key={"courseDetailCard"}
              backButtonTintColor={COLORS.lightGrey}
              onBack={Actions.pop}
              navigationBarStyle={{ backgroundColor: COLORS.blue }}
              titleStyle={{ color: COLORS.pureWhite }}
            />
            <Scene
              lazy={true}
              back={true}
              title={"Request a Tee Time"}
              component={RequestTeeTimeForm}
              key={"requestTeeTimeForm"}
              backButtonTintColor={COLORS.lightGrey}
              onBack={Actions.pop}
              navigationBarStyle={{ backgroundColor: COLORS.blue }}
              titleStyle={{ color: COLORS.pureWhite }}
            />
            <Scene
              lazy={true}
              back={true}
              title={"My Profile"}
              component={Profile}
              key={"profile"}
              backButtonTintColor={COLORS.lightGrey}
              onBack={Actions.pop}
              navigationBarStyle={{ backgroundColor: COLORS.blue }}
              titleStyle={{ color: COLORS.pureWhite }}
            />
            <Scene
              key={"comments"}
              title={"Comments"}
              component={Comments}
              backButtonTintColor={COLORS.lightGrey}
              back={true}
              onBack={Actions.pop}
              navigationBarStyle={{ backgroundColor: COLORS.blue }}
              titleStyle={{ color: COLORS.pureWhite }}
            />
            <Scene
              key={"editComment"}
              title={"Edit Comment"}
              component={EditComment}
              backButtonTintColor={COLORS.lightGrey}
              back={true}
              onBack={Actions.pop}
              navigationBarStyle={{ backgroundColor: COLORS.blue }}
              titleStyle={{ color: COLORS.pureWhite }}
            />

            <Scene
              key={"courseReviews"}
              title={"Reviews"}
              component={CourseReviews}
              backButtonTintColor={COLORS.lightGrey}
              back={true}
              onBack={Actions.pop}
              navigationBarStyle={{ backgroundColor: COLORS.blue }}
              titleStyle={{ color: COLORS.pureWhite }}
            />
            <Scene
              key={"postCourseReview"}
              title={"Post Review"}
              component={PostReview}
              backButtonTintColor={COLORS.lightGrey}
              back={true}
              onBack={Actions.pop}
              navigationBarStyle={{ backgroundColor: COLORS.blue }}
              titleStyle={{ color: COLORS.pureWhite }}
            />
            <Scene
              key={"successModal"}
              back={false}
              component={SuccessModal}
              hideNavBar
            />
          </Modal>
        </Router>
      </Provider>
    );
  }
}
