import path from "path";
import { fileURLToPath } from "url";
import { copyFileSync, existsSync, readdirSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cssSrc = path.resolve(__dirname, "style.css");
const cssDest = path.resolve(__dirname, "dist/style.css");

function copyCssPlugin() {
  return {
    name: "copy-css",
    apply(compiler) {
      compiler.hooks.afterEmit.tap("CopyCss", () => {
        if (existsSync(cssSrc)) copyFileSync(cssSrc, cssDest);
      });
    },
  };
}

/** Minden documentation/examples/*.ts és documentation/demos/*.ts külön bundle (egy komponens = egy oldal). */
function documentationEntries() {
  const entries = {};
  for (const dir of ["examples", "demos"]) {
    const abs = path.resolve(__dirname, "documentation", dir);
    if (!existsSync(abs)) continue;
    for (const f of readdirSync(abs)) {
      if (f.endsWith(".ts") && !f.startsWith("_")) entries[`${dir}/${f.slice(0, -3)}`] = `./documentation/${dir}/${f}`;
    }
  }
  return entries;
}

const libraryConfig = {
  mode: "development",
  devtool: "source-map",
  entry: {
    index: "./src/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true,
    library: {
      name: "CreateDOMBlocks",
      type: "umd",
    },
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "domelemjs": path.resolve(__dirname, "node_modules/domelemjs/dist/index.js"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [copyCssPlugin()],
};

const documentationConfig = {
  mode: "development",
  devtool: "source-map",
  name: "documentation",
  entry: documentationEntries(),
  output: {
    path: path.resolve(__dirname, "dist-page"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "domelemjs": path.resolve(__dirname, "node_modules/domelemjs/dist/index.js"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, "documentation/examples"),
        use: [
          {
            loader: "ts-loader",
            options: {
              compilerOptions: {
                declaration: false,
                declarationMap: false,
                sourceMap: false,
                rootDir: ".",
              },
            },
          },
          path.resolve(__dirname, "scripts/example-loader.mjs"),
        ],
      },
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            compilerOptions: {
              declaration: false,
              declarationMap: false,
              sourceMap: false,
              rootDir: ".",
            },
          },
        },
        exclude: [
          path.resolve(__dirname, "node_modules"),
          path.resolve(__dirname, "documentation/examples"),
        ],
      },
    ],
  },
};

export default [libraryConfig, documentationConfig];
