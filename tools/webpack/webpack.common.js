//-------------------------------------
// Webpack Common Configuration
// This file is used for common webpack configuration
// to compile 'development' & 'production' configs
//-------------------------------------

const path = require('path');
const webpack = require('webpack');
const cwd = process.cwd();

//-------------------------------------
// User Defined Settings
//-------------------------------------

const settings = {
  /** Folder name for build (production) files */
  buildFolderName: 'public',

  /** Main entry file of project source */
  mainEntryFile: 'src/index.tsx',

  /** HTML index template file */
  htmlTemplateFile: 'public/index.html',

  /** Extensions to resolve */
  extensions: ['.tsx', '.ts', '.js', '.jsx'],

  /**
   * Aliases to resolve
   *
   * To have better aliases path intellisense support from VSCode etc editors.
   * Make sure to add paths of these aliases in 'tsconfig.json' accordingly
   */
  aliases: {
    '@components': 'src/components',
    '@styles': 'src/styles',
    '@static': 'src/static'
  },
};

//-------------------------------------
// Configuration
//-------------------------------------

const config = options => {
  /** Plugins provided or not */
  options.plugins = options.plugins || [];

  /** Aliases path creation */
  for (let name in settings.aliases) {
    let value = settings.aliases[name];

    // Convert src/ to our cwd path
    if (value && value.startsWith('src/')) value = path.join(cwd, value);

    // Overwrite aliases
    settings.aliases[name] = value;
  }

  /** HTML Template file path */
  settings.htmlTemplateFile = path.join(cwd, settings.htmlTemplateFile);

  /** Webpack Configuration Object */
  return {
    /** Enable production optimizations or development hints */
    mode: options.mode,

    /** The entry point(s) of the compilation */
    entry: options.entry || path.join(cwd, settings.mainEntryFile),

    /** Options affecting the output of the compilation. `output` options tell webpack how to write the compiled files to disk */
    output: {
      path: path.join(cwd, settings.buildFolderName),
      publicPath: "/",
      /** Merge given output from (options) */
      ...options.output,
    },

    /** Options affecting the normal modules */
    module: {
      /** Rules for module */
      rules: [
        {
          /** Typescript Loader */
          test: /\.tsx?$/,
          loader: 'ts-loader',
        },
        {
          /** CSS Stylesheets Loader */
          test: /\.css$/,
          exclude: /node_modules/,
          use: ['style-loader', {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]'
              }
            }
          }],
        },
        {
          /** SASS & SCSS Loader */
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  localIdentName: '[name]__[local]___[hash:base64:5]'
                }
              }
            },
            'sass-loader'
          ],
        },
        {
          /** Fonts / File Loader */
          test: /\.(eot|otf|ttf|woff|woff2)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'fonts',
              },
            },
          ],
        },
        {
          /** Images (URL) Loader */
          test: /\.(gif|jpe?g|tiff|png|webp|bmp|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                outputPath: 'images',
              },
            },
          ],
        },
      ],
    },

    /** Enables/Disables integrated optimizations */
    optimization: options.optimization,

    /** Common plugins to be used for dev & prod configs */
    plugins: options.plugins.concat([
      /** Expose NODE_ENV to webpack */
      new webpack.EnvironmentPlugin({
        NODE_ENV: options.mode,
      }),
    ]),

    /** Webpack Resolver */
    resolve: {
      /** Folder names or directory paths where to find modules  */
      modules: ['node_modules', 'src'],

      /** Extensions we want to resolve */
      extensions: settings.extensions,

      /** Aliases to resolve for project folders */
      alias: { ...settings.aliases, ...options.aliases },
    },

    /** A developer tool to enhance debugging */
    devtool: options.devtool,

    /** Environment to build for */
    target: 'web',

    /** Add performance hint flags */
    performance: options.performance || {},

    /** Stats to output in console */
    stats: options.stats,

    /** Dev Server */
    devServer: options.devServer,

    // externals: {
    //   'react': { commonjs: 'react' },
    //   'react-dom': { commonjs: 'react-dom' }
    // }
  };
};

//-------------------------------------
// Modules Exporting
//-------------------------------------

module.exports = {
  config,
  settings,
};
