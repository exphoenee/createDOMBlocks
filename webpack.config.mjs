import path from "path";
import { fileURLToPath } from "url";
import { copyFileSync, existsSync } from "fs";

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
  entry: {
    "examples/forms": "./documentation/examples/forms.ts",
    "examples/buttons": "./documentation/examples/buttons.ts",
    "examples/selection": "./documentation/examples/selection.ts",
    "examples/tables": "./documentation/examples/tables.ts",
    "examples/lists": "./documentation/examples/lists.ts",
    "examples/navigation": "./documentation/examples/navigation.ts",
    "examples/content": "./documentation/examples/content.ts",
    "examples/feedback": "./documentation/examples/feedback.ts",
    "examples/interactive": "./documentation/examples/interactive.ts",
    "examples/modal": "./documentation/examples/modal.ts",
    "examples/avatars": "./documentation/examples/avatars.ts",
    "examples/customInputs": "./documentation/examples/customInputs.ts",
    "examples/index": "./documentation/examples/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
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
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};

export default [libraryConfig, documentationConfig];
