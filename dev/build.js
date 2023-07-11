const { spawn, execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const bytenode = require('bytenode')
const { minify } = require("terser");


main()

async function buildJSC() {
    const main = path.join(__dirname, '../dist/main.js')
    const mainBytenodePath = path.join(__dirname, '../dist/main.jsc')
    await bytenode.compileFile({
        filename: main,
        output: mainBytenodePath,
        compileAsModule: false
    })
}

async function main() {
    const distDir = path.join(__dirname, '../dist')
    const indexPath = path.join(distDir, 'index.js')
    const mainPath = path.join(distDir, 'main.js')

    const bytenodeJSPath = path.join(__dirname, '../node_modules/bytenode/lib/index.js')

    // if(fs.existsSync(distDir)) fs.rmSync(distDir, { recursive: true })
    if(!fs.existsSync(mainPath)) await spawnExec('npm.cmd', 'run bundle').promise

    await buildJSC()
    const fs_module = {}
    const path_module = {}
    const module_module = {}

    let byteNodeScript = fs.readFileSync(bytenodeJSPath, 'utf-8')
        .replace(/module\.exports\s*=\s*(global\.bytenode)/g, '')
        .replace(/global\.bytenode(.|\n)*?\}/g, '')
        .replace(/const fs.*/g, '')
        .replace(/const path.*/g, '')
        .replace(/fs\.([a-zA-Z_]+)\(/g, function (m1, m2) {
            fs_module[m2] = `fs_${m2}`
            return `fs_${m2}(`
        })
        .replace(/path\.([a-zA-Z_]+)\(/g, function (m1, m2) {
            path_module[m2] = `path_${m2}`
            return `path_${m2}(`
        })

    const global_variable = `[ global, require, __dirname, process, Number, Buffer, Error ]`
    byteNodeScript = `
        const [ global, require, __dirname, process, Number, Buffer, Error ] = __sg__;
        const fs = require('fs')
        const path = require('path')
        const [${Object.values(fs_module)}] = bindRequire(fs, ${Object.keys(fs_module).map(v => `"${v}"`)});
        const [${Object.values(path_module)}] = bindRequire(path, ${Object.keys(path_module).map(v => `"${v}"`)});
        ${byteNodeScript}
        function bindRequire(moduleRequire, ...props){
            const result = []
            for(const prop of props){
                console.log(prop)
                result.push(moduleRequire[prop].bind(moduleRequire))
            }
            return result
        }
        global.require = require;
        runBytecodeFile(path.join(__dirname, 'main.jsc'));
    `
    // test
    const index2Path = path.join(distDir, 'index2.js')
    fs.writeFileSync(index2Path, byteNodeScript)

    const content = await minify(byteNodeScript, {
        mangle: true, module: true,
        format: { beautify: true },
    })
    fs.writeFileSync(indexPath,
        `const __sg__ = ${global_variable};` +
        content.code)
    // fs.rmSync(mainPath)

    // await spawnExec('npx.cmd', 'nodegui-packer --init SNGApp').promise
    // await spawnExec('npx.cmd', 'nodegui-packer --pack ./dist').promise
    await spawnExec('npx.cmd', 'qode dist/index.js').promise
    process.exit(0)
}


function spawnExec(program, args, option) {
    if (typeof args === 'string') args = args.split(' ')
    const child = spawn(program, args, option)
    child.stdout.on('data', (d) => {
        process.stdout.write(d.toString())
    })
    child.stderr.on('data', (d) => {
        process.stderr.write(d.toString())
    })

    const promise = new Promise((resolve, reject) => {
        child.on('exit', (code) => {
            if (code === 0) resolve()
            else reject()
        })
    })

    return { child, promise }
}