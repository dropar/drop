const db = require("./server/db/db");
const { User, Asset } = require("./server/db/models");
const axios = require("axios");

const users = [
  {
    name: "john",
    email: "hanseok87@gmail.com",
    password: "123"
  },
  {
    name: "frank",
    email: "andy@gmail.com",
    password: "456"
  },
  {
    name: "josh",
    email: "mina@gmail.com",
    password: "abc"
  },
  {
    name: "ryan",
    email: "ryan@gmail.com",
    password: "123456"
  }
];

const isGLTF = asset =>
  asset.formats.filter(format => format.formatType === "GLTF").length > 0;
const assetUrlFilter = asset =>
  asset.formats.filter(asset => asset.formatType === "GLTF")[0].root.url;
let validAssets = [];

const seed = () => {
  axios
    .get(
      "https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=100&maxComplexity=MEDIUM"
    )
    .then(res => {
      const allAssetsFromAPI = res.data.assets;
      allAssetsFromAPI.forEach(asset => {
        if (isGLTF(asset)) {
          validAssets.push({
            displayName: asset.displayName,
            authorName: asset.authorName,
            thumbnailUrl: asset.thumbnail.url,
            googleApiId: asset.name,
            assetUrl: assetUrlFilter(asset),
            category: "N/A"
          });
        }
      });
    })
    .then(() => {
      Promise.all(users.map(user => User.create(user)));
    })
    .then(() => {
      Promise.all(validAssets.map(asset => Asset.create(asset)));
      return null;
    })
    .catch(err => console.error(err));
};
const main = () => {
  console.log("syncing db..");
  db.sync({ force: true })
    .then(() => {
      console.log("seeding database");
      seed();
    })
    .then(() => {
      setTimeout(() => db.close(), 2000);
      // db.close();
      return null;
    })
    .catch(err => {
      console.log("error while seeding");
      console.log(err.stack);
    });
};
main();
module.exports = main;
