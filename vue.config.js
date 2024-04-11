const path = require("path");
const webpackNodeExternals = require("webpack-node-externals");

/**
 * @type {import("electron-builder").Configuration} builderOptions
 */
const builderOptions = {
  publish: ["github"],
  appId: "net.venipa.ytmdesktop",
  productName: "YouTube Music",
  extraMetadata: {
    name: "youtubemusic",
  },
    linux: {
        desktop: {
            Name: "Youtube Music",
            GenericName: "Music Player",
            Type: "Application",
            Categories: "Music;",
            Keywords: "youtube;music"
        },
        target: [
            {
                target: "rpm",
                arch: [
                    "x64",
                ]
            }
        ],
        category: "Music",
        icon: "src/assets/icons/mac/icon.icns",
        maintainer: "hello@hello.com"
    },
  squirrelWindows: null,
  nsis: {
    installerIcon: "src/assets/icons/win/icon.ico",
    installerHeaderIcon: "src/assets/icons/win/icon.ico",
    deleteAppDataOnUninstall: true,
  }
};
/**
 * @type {import('electron-builder').AfterPackContext} electronBuilder
 */
const electronBuilder = {
  mainProcessTypeChecking: false,
  preload: {
    "preload-yt": "src/preload/youtube.ts",
    "preload-api": "src/preload/api.ts",
    "preload-login": "src/preload/login.ts",
    api: "src/api/main.ts",
  },
  nodeIntegration: false,
  builderOptions,
  externals: [
    "chokidar",
    "xosms",
    "express",
    "express-ws",
    ...Array.from(webpackNodeExternals()),
  ],
  nodeModulesPath: ["./node_modules"],
};
// const TsConfigPaths = require("tsconfig-paths-webpack-plugin").default;
// const tsConfigAliasMapping = Object.entries(tsconfig.compilerOptions.paths).map(([alias, paths]) => {
//   return [alias.split("/*", 2)[0], path.resolve(__dirname, paths[0].split("/*", 2)[0])];
// });
module.exports = {
  pluginOptions: {
    electronBuilder,
  },
  chainWebpack: (config) => {
    // tsConfigAliasMapping.forEach(([alias, path]) => config.resolve.alias.set(alias, path));
    // config.resolve.plugin("tsconfig-paths").use(new TsConfigPaths());
    config.module
      .rule("raw")
      .test(() => false)
      .use("raw-loader")
      .loader("raw-loader")
      .end();

    config.module.rules.delete("svg");

    config.module
      .rule("svg")
      .test(/\.(svg)(\?.*)?$/)
      .use("vue-loader")
      .loader("vue-loader")
      .end()
      .use("vue-svg-loader")
      .loader("vue-svg-loader");
  },
  configureWebpack: {
    devtool: "source-map",
  },
};
