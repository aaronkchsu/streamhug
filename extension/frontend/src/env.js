const projectConfig = {
  production: {
    apiEndpoint: "https://api.blerp.com/graphql",
    apiHost: "https://api.blerp.com",
    twitchHost: "https://twi.blerp.com",
    rigHost: "https://localhost.rig.twitch.tv:3000",
    webHost: "https://blerp.com",
    jwtDomain: ".blerp.com",
    appId: "",
    DEVELOPMENT: false
  },
  beta: {
    // Attaches to the beta api
    apiEndpoint: "https://api.blerp.com/graphql",
    apiHost: "https://api.blerp.com",
    twitchHost: "https://stage.blerp.live:4000",
    webHost: "https://blerp.com",
    rigHost: "https://localhost.rig.twitch.tv:3000",
    jwtDomain: ".blerp.com",
    appId: "214573935849812",
    DEVELOPMENT: true
  },
  devprod: {
    // Purpose of testing staging locally
    apiEndpoint: "https://api.blerp.com/graphql",
    apiHost: "https://api.blerp.com",
    twitchHost: "https://twi.blerp.com",
    webHost: "https://blerp.com",
    rigHost: "https://localhost.rig.twitch.tv:3000",
    jwtDomain: ".blerp.com",
    DEVELOPMENT: true
  },
  dev: {
    // Points at a local blerp api server hosted at localhost:8081
    apiEndpoint: "https://api.blerp.com/graphql",
    apiHost: "https://api.blerp.com",
    twitchHost: "https://localhost:5000",
    webHost: "http://blerp.com",
    rigHost: "https://localhost.rig.twitch.tv:3000",
    jwtDomain: ".localhost",
    DEVELOPMENT: true
  }
};

const currentProjectConfig = projectConfig.dev;
export default currentProjectConfig;
