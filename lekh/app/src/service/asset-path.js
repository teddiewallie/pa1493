import path from "path";

const getAssetPath = (id, extension) => path.join(
  process.cwd(),
  "assets",
  `${id}.${extension}`
);

export { getAssetPath };

