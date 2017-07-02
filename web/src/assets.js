/* eslint-disable max-len */
module.exports = {
  effects: {
    beep: {
      value: require("../audio/beep.wav"),
      label: "Beep",
    },
    boop: {
      value: require("../audio/boop.wav"),
      label: "Boop",
    },
    end: {
      value: require("../audio/end.wav"),
      label: "Win",
    },
    klaxon: {
      value: require("../audio/klaxon.wav"),
      label: "Klaxon",
    },
    start: {
      value: require("../audio/start.wav"),
      label: "Starting Pistol",
    },
  },
  speech: {
    female: {
      application_closing_in_1_minute: {
        value: require("../audio/speech/application closing in 1 minute-female.mp3"),
        label: "'Application Closing In 1 Minute'",
      },
      application_closing_in_10_seconds: {
        value: require("../audio/speech/application closing in 10 seconds-female.mp3"),
        label: "'Application Closing In 10 Seconds'",
      },
      application_closing_in_5_minutes: {
        value: require("../audio/speech/application closing in 5 minutes-female.mp3"),
        label: "'Application Closing In 5 Minutes'",
      },
      playlist_complete: {
        value: require("../audio/speech/playlist complete-female.mp3"),
        label: "'Playlist Complete'",
      },
      starting_application: {
        value: require("../audio/speech/starting application-female.mp3"),
        label: "'Starting Application'",
      },
    },
    male: {
      application_closing_in_1_minute: {
        value: require("../audio/speech/application closing in 1 minute-male.mp3"),
        label: "'Application Closing In 1 Minute'",
      },
      application_closing_in_10_seconds: {
        value: require("../audio/speech/application closing in 10 seconds-male.mp3"),
        label: "'Application Closing In 10 Seconds'",
      },
      application_closing_in_5_minutes: {
        value: require("../audio/speech/application closing in 5 minutes-male.mp3"),
        label: "'Application Closing In 5 Minutes'",
      },
      playlist_complete: {
        value: require("../audio/speech/playlist complete-male.mp3"),
        label: "'Playlist Complete'",
      },
      starting_application: {
        value: require("../audio/speech/starting application-male.mp3"),
        label: "'Starting Application'",
      },
    },
    google: {
      application_closing_in_1_minute: {
        value: require("../audio/speech/application closing in 1 minute-google.mp3"),
        label: "'Application Closing In 1 Minute'",
      },
      application_closing_in_10_seconds: {
        value: require("../audio/speech/application closing in 10 seconds-google.mp3"),
        label: "'Application Closing In 10 Seconds'",
      },
      application_closing_in_5_minutes: {
        value: require("../audio/speech/application closing in 5 minutes-google.mp3"),
        label: "'Application Closing In 5 Minutes'",
      },
      playlist_complete: {
        value: require("../audio/speech/playlist complete-google.mp3"),
        label: "'Playlist Complete'",
      },
      starting_application: {
        value: require("../audio/speech/starting application-google.mp3"),
        label: "'Starting Application'",
      },
    },
  },
};

/* eslint-enable max-len */
