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

export default {
  mode: "development",
  devtool: "source-map",
  entry: {
    index: "./src/index.ts",
    "documentation/examples/forms": "./documentation/examples/forms.ts",
    "documentation/examples/buttons": "./documentation/examples/buttons.ts",
    "documentation/examples/selection": "./documentation/examples/selection.ts",
    "documentation/examples/tables": "./documentation/examples/tables.ts",
    "documentation/examples/lists": "./documentation/examples/lists.ts",
    "documentation/examples/navigation": "./documentation/examples/navigation.ts",
    "documentation/examples/content": "./documentation/examples/content.ts",
    "documentation/examples/feedback": "./documentation/examples/feedback.ts",
    "documentation/examples/interactive": "./documentation/examples/interactive.ts",
    "documentation/examples/modal": "./documentation/examples/modal.ts",
    "documentation/examples/avatars": "./documentation/examples/avatars.ts",
    "documentation/examples/customInputs": "./documentation/examples/customInputs.ts",
    "documentation/examples/index": "./documentation/examples/index.ts",
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
