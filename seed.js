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

const ownership = []

const isGLTF = asset => asset.formats.filter(format => format.formatType === "GLTF").length > 0;
const assetUrlFilter = asset => asset.formats.filter(asset => asset.formatType === "GLTF")[0].root.url;

let validAssets = [];

const seed = async () => {
  try {
    const resAnimals = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=100&maxComplexity=MEDIUM&category=ANIMALS")
    const resArchitecture = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=100&maxComplexity=MEDIUM&category=ARCHITECTURE")
    const resArt = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=100&maxComplexity=MEDIUM&category=ART")
    const resFood = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=100&maxComplexity=MEDIUM&category=FOOD")
    const resNature = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=100&maxComplexity=MEDIUM&category=NATURE")
    const resObjects = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=100&maxComplexity=MEDIUM&category=OBJECTS")
    const resPeople = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=100&maxComplexity=MEDIUM&category=PEOPLE")
    const resScenes = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=100&maxComplexity=MEDIUM&category=SCENES")
    const resTechnology = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=100&maxComplexity=MEDIUM&category=TECH")
    const resTransport = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=100&maxComplexity=MEDIUM&category=TRANSPORT")

    const animals = resAnimals.data.assets
    const architecture = resArchitecture.data.assets;
    const art = resArt.data.assets
    const food = resFood.data.assets
    const nature = resNature.data.assets
    const objects = resObjects.data.assets
    const people = resPeople.data.assets
    const scenes = resScenes.data.assets
    const technology = resTechnology.data.assets
    const transport = resTransport.data.assets

    animals.forEach(asset => {
        if (isGLTF(asset)) {
          validAssets.push({
            displayName: asset.displayName,
            authorName: asset.authorName,
            thumbnailUrl: asset.thumbnail.url,
            googleApiId: asset.name,
            assetUrl: assetUrlFilter(asset),
            category: "Animals",
          });
        }
      });

      architecture.forEach(asset => {
        if (isGLTF(asset)) {
          validAssets.push({
            displayName: asset.displayName,
            authorName: asset.authorName,
            thumbnailUrl: asset.thumbnail.url,
            googleApiId: asset.name,
            assetUrl: assetUrlFilter(asset),
            category: "Architecture",
          });
        }
      });

      art.forEach(asset => {
        if (isGLTF(asset)) {
          validAssets.push({
            displayName: asset.displayName,
            authorName: asset.authorName,
            thumbnailUrl: asset.thumbnail.url,
            googleApiId: asset.name,
            assetUrl: assetUrlFilter(asset),
            category: "Art",
          });
        }
      });


      food.forEach(asset => {
        if (isGLTF(asset)) {
          validAssets.push({
            displayName: asset.displayName,
            authorName: asset.authorName,
            thumbnailUrl: asset.thumbnail.url,
            googleApiId: asset.name,
            assetUrl: assetUrlFilter(asset),
            category: "Food",
          });
        }
      });

      // nature.forEach(asset => {
      //   if (isGLTF(asset)) {
      //     validAssets.push({
      //       displayName: asset.displayName,
      //       authorName: asset.authorName,
      //       thumbnailUrl: asset.thumbnail.url,
      //       googleApiId: asset.name,
      //       assetUrl: assetUrlFilter(asset),
      //       category: "Nature",
      //     });
      //   }
      // });

      // objects.forEach(asset => {
      //   if (isGLTF(asset)) {
      //     validAssets.push({
      //       displayName: asset.displayName,
      //       authorName: asset.authorName,
      //       thumbnailUrl: asset.thumbnail.url,
      //       googleApiId: asset.name,
      //       assetUrl: assetUrlFilter(asset),
      //       category: "Objects",
      //     });
      //   }
      // });

      // people.forEach(asset => {
      //   if (isGLTF(asset)) {
      //     validAssets.push({
      //       displayName: asset.displayName,
      //       authorName: asset.authorName,
      //       thumbnailUrl: asset.thumbnail.url,
      //       googleApiId: asset.name,
      //       assetUrl: assetUrlFilter(asset),
      //       category: "People",
      //     });
      //   }
      // });

      // scenes.forEach(asset => {
      //   if (isGLTF(asset)) {
      //     validAssets.push({
      //       displayName: asset.displayName,
      //       authorName: asset.authorName,
      //       thumbnailUrl: asset.thumbnail.url,
      //       googleApiId: asset.name,
      //       assetUrl: assetUrlFilter(asset),
      //       category: "Scenes",
      //     });
      //   }
      // });

      // technology.forEach(asset => {
      //   if (isGLTF(asset)) {
      //     validAssets.push({
      //       displayName: asset.displayName,
      //       authorName: asset.authorName,
      //       thumbnailUrl: asset.thumbnail.url,
      //       googleApiId: asset.name,
      //       assetUrl: assetUrlFilter(asset),
      //       category: "Technology",
      //     });
      //   }
      // });

      // transport.forEach(asset => {
      //   if (isGLTF(asset)) {
      //     validAssets.push({
      //       displayName: asset.displayName,
      //       authorName: asset.authorName,
      //       thumbnailUrl: asset.thumbnail.url,
      //       googleApiId: asset.name,
      //       assetUrl: assetUrlFilter(asset),
      //       category: "Transport",
      //     });
      //   }
      // });

      await users.map(user => User.create(user));
      await validAssets.map(asset => Asset.create(asset));
  } catch (error) {
    console.error(error)
  }
}

  const main = async () => {
    try {
      console.log("syncing db..");
      db.sync({ force: true })
      await seed();
      setTimeout(db.close(), 10000);
    } catch (error) {
        console.log("error while seeding");
        console.log(err.stack);
    }
  }

  main();

  module.exports = main;




  //&category  animals, architecture, art, food, nature, objects, people, scenes, technology, and transport.

  // .then(() => {
  //   axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&category=ART&pageSize=100&maxComplexity=MEDIUM")
  // })
  // .then(res => {
  //   const artAssetsFromAPI = res.data.assets;
  //   artAssetsFromAPI.forEach(asset => {
  //     if (isGLTF(asset)) {
  //       validAssets.push({
  //         displayName: asset.displayName,
  //         authorName: asset.authorName,
  //         thumbnailUrl: asset.thumbnail.url,
  //         googleApiId: asset.name,
  //         assetUrl: assetUrlFilter(asset),
  //         category: "Art",
  //       });
  //     }
  //   });
  // })
