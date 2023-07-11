const path = require("path");
const webpack = require("webpack");
const { existsSync, rmSync, readFileSync, writeFileSync, cpSync, readFile } = require("fs");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const events = require('./dev/events.js')

modifyBabelJS()

const isDev = process.argv.findIndex((v) => v === '--mode=development') !== -1
const dist = path.resolve(__dirname, "dist")

if (existsSync(dist) && !isDev) rmSync(dist, { recursive: true })

const defaultConfig = commonConfig()
const buildExport = [mainjs()]
// if (!existsSync(path.join(dist, 'nodegui-lib.js'))) buildExport.push(libjs())
module.exports = buildExport;

function modifyBabelJS() {
    const babalRequirePath = 'babel-plugin-jsx-dom-expressions'
    const indexBabelPath = path.join(__dirname, `node_modules/${babalRequirePath}/index.js`)
    const indexBabelBackupPath = path.join(__dirname, `node_modules/${babalRequirePath}/index-bk.js`)
    if (!existsSync(indexBabelPath)) throw `not found index.js of module ${babalRequirePath}`
    if (existsSync(indexBabelBackupPath)) cpSync(indexBabelBackupPath, indexBabelPath)
    else cpSync(indexBabelPath, indexBabelBackupPath)
    const content = readFileSync(indexBabelPath, 'utf-8')

    writeFileSync(indexBabelPath, content.replace('module.exports', [
        `index.DelegatedEvents = DelegatedEvents`,
        `index.SVGElements = SVGElements`,
        `function toEventName(evt){ 
            let c2 = evt.charAt(2)
            let c3 = evt.charAt(3)
            evt = evt.slice(3)
            if(c2 === 'Q' && c3 === c3.toUpperCase() && _nodegui_events[evt]) return evt
            return c2.toLowerCase() + evt
        }`,
        `module.exports`
    ].join('\n')))

    global._nodegui_events = events

    const jsxSolid = require('babel-plugin-jsx-dom-expressions')
    cpSync(indexBabelBackupPath, indexBabelPath)
    jsxSolid.DelegatedEvents.clear()
    jsxSolid.SVGElements.clear()
}

function mainjs() {
    return {
        ...defaultConfig,
        entry: "./src/main.tsx",
        externals: {
            ...isDev && {
                '@nodegui/nodegui': 'require("@nodegui/nodegui")'
            },
            ...defaultConfig.externals,
        },
        target: 'node',
        resolve: {
            extensions: [".ts", ".mjs", ".js", ".tsx", ".scss", ".css", ".json"],
            conditionNames: ['require', 'svelte'],
        },
        module: {
            rules: [...defaultConfig.module.rules,
            {
                test: /\.(ts)x?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        configFile: false,
                        presets: ['@babel/preset-env', '@babel/preset-typescript', 'solid'],
                    }
                }
            }
            ]
        }
    };
}

function commonConfig(_isDev = isDev) {
    const coreModule = require("module").builtinModules.reduce((acc, cur) => (acc[cur] = `require("${cur}")`, acc), {})

    const config = {
        mode: _isDev ? "development" : "production",
        target: "node",
        output: {
            path: dist,
            filename: '[name].js'
        },
        // devtool: isDev ? 'inline-sources-map' : false, 
        module: {
            rules: [
                {
                    test: /\.(png|jpe?g|gif|svg|bmp|otf)$/i,
                    use: [
                        {
                            loader: "file-loader",
                            options: { publicPath: "dist" }
                        }
                    ]
                },
                {
                    test: /\.(js|ts|tsx)?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            configFile: false,
                            presets: ['@babel/preset-env', '@babel/preset-typescript'],
                        }
                    }
                },
                {
                    test: /\.node/i,
                    use: [
                        {
                            loader: "native-addon-loader",
                            options: { name: "[name].[ext]" }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                url: false, // necessary if you use url('/path/to/some/asset.png|jpg|gif')
                            }
                        }
                    ]
                },
            ]
        },
        externals: coreModule,
        plugins: [
            new MiniCssExtractPlugin({ filename: 'styles.css' })
        ],
    };

    if (_isDev) {
        config.mode = "development";
        config.devtool = "source-map";
        config.watch = true;
    }

    return config;
}