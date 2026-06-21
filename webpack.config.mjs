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

/** @type {import('webpack').Configuration} */
export default {
  mode: "development",
  devtool: "source-map",
  entry: {
    index: "./src/index.ts",
    "test/forms": "./test/pages/forms.ts",
    "test/buttons": "./test/pages/buttons.ts",
    "test/selection": "./test/pages/selection.ts",
    "test/tables": "./test/pages/tables.ts",
    "test/lists": "./test/pages/lists.ts",
    "test/navigation": "./test/pages/navigation.ts",
    "test/content": "./test/pages/content.ts",
    "test/feedback": "./test/pages/feedback.ts",
    "test/interactive": "./test/pages/interactive.ts",
    "test/modal": "./test/pages/modal.ts",
    "test/avatars": "./test/pages/avatars.ts",
    "test/customInputs": "./test/pages/customInputs.ts",
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
