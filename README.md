# Twitch Blerp Extension

### Getting Started

First get familiar with Twitch's API and Documentation
https://www.twitch.tv/p/extensions/
https://dev.twitch.tv/docs/extensions/
https://dev.twitch.tv/docs/extensions/building/

## Understanding

Developer Rig is a Way to Run Your Extension Locally

Twitch Repo Has How to steps on Making the Rig Work
https://github.com/twitchdev/developer-rig#loading-an-example-extension

1. Yarn install developer-rig
2. Go run the run scripts

On mac this waas the most helpful page for understanding context https://github.com/twitchdev/developer-rig/blob/master/docs/MacLocal.md

The my-extension package has a backend and a frontend. The services/backend.js is a Hapi Nodejs server. The public folder in my-extension contains the webviews for the extension.

Understand that the files in the public folder of the extension host the webviews

Understand that the extension can host a backend server file

Understand that we use parcel, babel, and react to build our frontend

### Environment Variables

### Build Process
# streamhug
