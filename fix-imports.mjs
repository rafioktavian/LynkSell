import fs from "fs";
import path from "path";

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith(".ts") || file.endsWith(".tsx")) {
      results.push(file);
    }
  });
  return results;
}

const files = [...walk("./app"), ...walk("./components"), ...walk("./lib")];

files.forEach(file => {
  let content = fs.readFileSync(file, "utf8");
  const orig = content;
  
  // Replace from "../../../" to "@/"
  // It's tricky to do a blind replace, but since the directories are always app, lib, components, auth, we can match:
  content = content.replace(/from "(\.\.\/)+((app|components|lib|auth)(\b|\/)[^"]*)"/g, 'from "@/$2"');
  
  if (content !== orig) {
    fs.writeFileSync(file, content);
    console.log("Fixed", file);
  }
});
