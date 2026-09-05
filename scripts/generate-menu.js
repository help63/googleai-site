const fs = require("fs");
const path = require("path");

const typesFile = path.join(process.cwd(),"data","content-types.json");
const menuFile = path.join(process.cwd(),"data","menu.json");

const types = JSON.parse(fs.readFileSync(typesFile,"utf8"));

const menu = types
  .filter(item => item.enabled)
  .map(item => ({
    title: item.name,
    url: item.url,
    enabled: true
  }));

fs.writeFileSync(
  menuFile,
  JSON.stringify(menu,null,2)
);

console.log("✅ Menu generated");
