const user = {
  id: 98248197243,
  firstName: "Tiger",
  lastName: "Woods",
  userName: "TigerTheTiger43",
  email: "tiger54@gmail.com",
  // -----
  avatarUrl: "path/to/avatar/on/firebase/storage",
  birthday: "2019-01-02"
};

const userSetting = {
  userId: 349823749872, // links to user
  metric: false,
  homeCourseId: 9837492837423, // links to course
  bestRoundId: 9382742937423, // links to round,
  preferredClubs: [
    // constant stored in app
    { id: "11", name: "DRIVER" },
    { id: "13", name: "5W" },
    { id: "19", name: "6i" },
    { id: "21", name: "8i" },
    { id: "27", name: "PUTTER" }
  ]
};

const socialConnections = {
  facebook: "340238402980923ncx03jx2nr", // token id
  google: false,
  instagram: false,
  twitter: false
};

const course = {
  id: 43765934756,
  imageUrl: "path/to/avatar/on/firebase/storage",
  name: "Fake Pines Club",
  website: "www.fakePinesClub.com",
  email: "admin@fakePinesClub.com",
  phone: "(555) 555 - 5555",
  address: "4545 W. Palm Springs Ave, Miami, FL 02345",
  confirmed: false, // true for official course, false for suggested but not yet accepted,
  teeTimeUrl: "http://www.fakePinesClub.com/bookTeeTime"
};

const round = {
  date: "2019-02-04",
  courseId: 823740239847, //course id
  roundUrl: "path/to/avatar/on/firebase/storage",
  speedGolfScore: "234:55",
  strokes: 65,
  time: "56:14",


  temperatureInF: 85, // always stored in F
  golfDistanceInYards: 8732,
  runningDistanceInMiles: 5.4
};

const scoreCard = {
  courseId: 348729487234,
  golferId: 9387492874982374
};

const courseHole = {
  holeNumber: 5,
  courseId: 987347298734,

}

const loggedHole = {
  courseHoleId: 234982384,
  courseId: 987347298734,
  scoreCardId: 2342523,

}

const hole = {
  scoreCardId: 2342523,
  courseId: 987347298734,
  holeNumber: 5,
  strokePar: 4,
  strokes: 4,
  golfDistance: 345,
  timePar: "3:00",
  timeTaken: "3:51"
};

const comment = {
  id: 89374982374,
  parentId: 28374982374,
  parentType: "ROUND",
  commentorId: 873987234234,
  title: "Wow, well done",
  comment: "I can't believe your shot out of the sand pit",
  dateTime: "Thu Mar 07 2019 18:42:22 GMT-0500 (Eastern Standard Time)"
};

const followers = {
  followee: 873982374987234,
  follower: 98374982374234
};



const review = {
  courseId: 3425436346,
  reviewerId: 343463234234,
  title: "A Magnificent Course",
  body: "This course was built for speed golf"
};

const ratings = {
  courseId: 293874293084092834,
  reviewerId: 34729847298734,
  type: "Exertion", // constant with the types of reviews
  myValue: 4
};

// should feed items be their own thing or not?
const feedItems = {};
