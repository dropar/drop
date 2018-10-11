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

const ownership = [];

const isGLTF = asset =>
  asset.formats.filter(format => format.formatType === "GLTF2").length > 0;
const assetUrlFilter = asset =>
  asset.formats.filter(asset => asset.formatType === "GLTF2")[0].root.url;

let validAssets = [];

const seed = async () => {
  try {
    const resAnimals = await axios.get(
      "https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=5&maxComplexity=SIMPLE&category=ANIMALS"
    );
    const resArchitecture = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=5&maxComplexity=SIMPLE&category=ARCHITECTURE")
    const resArt = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=5&maxComplexity=SIMPLE&category=ART")
    const resFood = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=5&maxComplexity=SIMPLE&category=FOOD")
    const resNature = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=5&maxComplexity=SIMPLE&category=NATURE")
    const resObjects = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=5&maxComplexity=SIMPLE&category=OBJECTS")
    const resPeople = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=5&maxComplexity=SIMPLE&category=PEOPLE")
    const resScenes = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=5&maxComplexity=SIMPLE&category=SCENES")
    const resTechnology = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=5&maxComplexity=SIMPLE&category=TECH")
    const resTransport = await axios.get("https://poly.googleapis.com/v1/assets?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4&pageSize=5&maxComplexity=SIMPLE&category=TRANSPORT")
    const resDropLogo = await axios.get('https://poly.googleapis.com/v1/assets/dp5PrzF0k6W?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4')
    const resFullstackLogo = await axios.get('https://poly.googleapis.com/v1/assets/0bJ0ctZdJV_?key=AIzaSyDbAkOgCpfiweD3ZQ3_ZyR0UBEqD17ZBs4')


    const animals = resAnimals.data.assets;
    const architecture = resArchitecture.data.assets;
    const art = resArt.data.assets
    const food = resFood.data.assets
    const nature = resNature.data.assets
    const objects = resObjects.data.assets
    const people = resPeople.data.assets
    const scenes = resScenes.data.assets
    const technology = resTechnology.data.assets
    const transport = resTransport.data.assets
    const logos = [resDropLogo.data, resFullstackLogo.data]
    console.log(JSON.stringify(logos));

    logos.forEach(asset => {
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

    animals.forEach(asset => {
      if (isGLTF(asset)) {
        validAssets.push({
          displayName: asset.displayName,
          authorName: asset.authorName,
          thumbnailUrl: asset.thumbnail.url,
          googleApiId: asset.name,
          assetUrl: assetUrlFilter(asset),
          category: "Animals"
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

    nature.forEach(asset => {
      if (isGLTF(asset)) {
        validAssets.push({
          displayName: asset.displayName,
          authorName: asset.authorName,
          thumbnailUrl: asset.thumbnail.url,
          googleApiId: asset.name,
          assetUrl: assetUrlFilter(asset),
          category: "Nature",
        });
      }
    });

    objects.forEach(asset => {
      if (isGLTF(asset)) {
        validAssets.push({
          displayName: asset.displayName,
          authorName: asset.authorName,
          thumbnailUrl: asset.thumbnail.url,
          googleApiId: asset.name,
          assetUrl: assetUrlFilter(asset),
          category: "Objects",
        });
      }
    });

    people.forEach(asset => {
      if (isGLTF(asset)) {
        validAssets.push({
          displayName: asset.displayName,
          authorName: asset.authorName,
          thumbnailUrl: asset.thumbnail.url,
          googleApiId: asset.name,
          assetUrl: assetUrlFilter(asset),
          category: "People",
        });
      }
    });

    scenes.forEach(asset => {
      if (isGLTF(asset)) {
        validAssets.push({
          displayName: asset.displayName,
          authorName: asset.authorName,
          thumbnailUrl: asset.thumbnail.url,
          googleApiId: asset.name,
          assetUrl: assetUrlFilter(asset),
          category: "Scenes",
        });
      }
    });

    technology.forEach(asset => {
      if (isGLTF(asset)) {
        validAssets.push({
          displayName: asset.displayName,
          authorName: asset.authorName,
          thumbnailUrl: asset.thumbnail.url,
          googleApiId: asset.name,
          assetUrl: assetUrlFilter(asset),
          category: "Technology",
        });
      }
    });

    transport.forEach(asset => {
      if (isGLTF(asset)) {
        validAssets.push({
          displayName: asset.displayName,
          authorName: asset.authorName,
          thumbnailUrl: asset.thumbnail.url,
          googleApiId: asset.name,
          assetUrl: assetUrlFilter(asset),
          category: "Transport",
        });
      }
    });
    await Promise.all(users.map(user => User.create(user)));
    await Promise.all(validAssets.map(asset => Asset.create(asset)));
    const seedTestUser = await User.findById(4)
    await seedTestUser.setAssets([1,2])
  } catch (error) {
    console.error(error);
  }
};

const main = async () => {
  try {
    console.log("syncing db..");
    db.sync({ force: true });
    await seed();
  } catch (error) {
    console.log("error while seeding");
    console.log(error.stack);
  } finally {
    console.log('The seed is sown.')
    db.close();
  }
};

main();

module.exports = main;
