# Set up a web application

Creates WEB apps with no build configuration by running one command.

**If something doesn’t work, please [file an issue](https://github.com/aliccer/create-app.git/issues).**

With **Create App** you are able to:
- set up back-end server on [Node](https://nodejs.org/en/) + [Express](http://expressjs.com/) (optional [Mongoose](https://mongoosejs.com), [MongoDB](https://www.mongodb.com/))
- set up front-end on [React](https://reactjs.org/) (optional [Redux](https://redux.js.org/), [Redux-Saga](https://redux-saga.js.org/))
- install App Examples depending on the project setup (for example if you choose to install  Back-End with MongoDb and  Front-End with Redux than will be installed app example with chosen technology stack)

**Create App** uses **Create React App** for client-side installation
- [User Guide](https://facebook.github.io/create-react-app/) – How to develop apps bootstrapped with Create React App.

### Creating an App
---
**Global installation from GitHub repository**
```
git@github.com:aliccer/create-app.git
cd create-app
npm install -g
```
Now you can run:
```
create-app my-app
```
NOTE: if there will be updates in **Create App** repository you will have to update your package to:
```
cd create-app
git pull
npm install -g
```

### Usage
---

To create an application run:
```
create-app my-app (options)
```
To see all available options run:
```
create-app -h
```
- **-V, --version** output the version number
- **-c, --omit-client** do not install client-side
- **-s, --omit-server** do not install server-side
- **-e, --example** add examples
- **-m, --mongodb** add MongoDb
- **-r, --redux** add Redux
- **--use-npm** use npm instead yarn
- **i, --info** print environment debug info

>NOTE: After the application has been created modify next files: OWNERS (add your team), LICENSE.md, README.md
- [Requirements for README, OWNERS and LICENSE Files in Repositories](https://bits.bazaarvoice.com/confluence/display/SEC/Requirements+for+README%2C+OWNERS+and+LICENSE+Files+in+Repositories)

To start created application in development mode run:
```
cd my-app
npm start
```
> Then open http://localhost:3000/ to see your app.

To start created application in production mode run:
```
cd my-app
npm build
npm run server
```
> Then open http://localhost:8000/ to see your app.
