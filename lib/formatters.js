import moment from "moment";

const makeRange = (startValue, endValue) => {
  let rangeOptions = [];
  for (let i = startValue; i <= endValue; i++) {
    rangeOptions.push(i);
  }
  return rangeOptions;
};

const makeDateData = (minYear = 1950) => {
  const years = makeRange(minYear, 2030);
  const months = makeRange(1, 12);
  const days = makeRange(1, 31);
  return [years, months, days];
};

const getTomorrow = () => {
  let today = moment();
  let tomorrow = moment(today).add(1, "days");

  let year = tomorrow.year();
  let month = tomorrow.month() + 1;
  let day = tomorrow.date();

  return [year, month, day];
};

const addLeadingZero = valueIn => {
  let valueOut = valueIn;
  if (valueIn.toString().length === 1) {
    valueOut = "0" + valueIn;
  }
  return valueOut;
};

const convertDateArrayToMoment = dateArray => {
  const year = dateArray[0];
  const month = dateArray[1];
  const day = dateArray[2];

  return moment({ year, month, day });
};

const formatDate = dateArray => {
  if (dateArray) {
    let [year, month, date] = dateArray;

    month = addLeadingZero(month);
    date = addLeadingZero(date);

    return `${year}-${month}-${date}`;
  }
  return null;
};

const makeTimeData = () => {
  const hours = makeRange(0, 10);
  const minutes = makeRange(0, 59);
  const seconds = makeRange(0, 59);

  return [hours, minutes, seconds];
};

const formatTimeMinutesSecondsOnly = timeArray => {
  if (timeArray) {
    let [minutes, seconds] = timeArray;

    if (minutes.toString().length === 1) {
      minutes = "0" + minutes;
    }

    if (seconds.toString().length === 1) {
      seconds = "0" + seconds;
    }

    return `${minutes}:${seconds}`;
  }
};

const makeSpeedgolfScoreData = () => {
  const strokes = makeRange(0, 162);
  const minutes = makeRange(0, 999);
  const seconds = makeRange(0, 59);

  return [strokes, minutes, seconds];
};

const formatSpeedGolfScore = scoreArray => {
  let [strokes, minutes, seconds] = scoreArray;
  strokes = strokes ? parseInt(strokes) : 0;
  minutes = minutes ? parseInt(minutes) : 0;
  seconds = seconds ? parseInt(seconds) : 0;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return `${strokes + minutes}:${seconds}`;
};

const getTodayArray = () => {
  let today = new Date();
  let year = today.getFullYear();
  let month = parseInt(today.getMonth()) + 1;
  let day = today.getDate();

  return [year, month, day];
};

const makeTimeOfDayData = () => {
  let hour = makeRange(1, 12);
  let minute = makeRange(0, 60);
  let halfDaySpecifier = ["AM", "PM"];

  return [hour, minute, halfDaySpecifier];
};

export {
  makeRange,
  makeDateData,
  formatDate,
  makeTimeData,
  makeSpeedgolfScoreData,
  formatSpeedGolfScore,
  formatTimeMinutesSecondsOnly,
  getTodayArray,
  convertDateArrayToMoment,
  makeTimeOfDayData,
  getTomorrow
};
