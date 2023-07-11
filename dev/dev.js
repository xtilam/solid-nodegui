const path = require("path")

const nodemon = require('nodemon')
const { spawn, exec } = require("child_process")
const { existsSync, rmSync, readFileSync, cpSync, linkSync, writeFileSync, readFile, mkdirSync } = require("fs")
const { WidgetEventTypes } = require("@nodegui/nodegui")
const vm = require('vm')

main()

async function main() {
    const distDir = path.join(__dirname, '../dist')
    const mainJSPath = path.join(distDir, 'main.js')
    const widgetEventsPath = path.join(__dirname, 'events.js')
    let context = vm.createContext({})
    context
    let isStart = false

    writeFileSync(widgetEventsPath, `module.exports = ${JSON.stringify(WidgetEventTypes)}`)

    if (existsSync(distDir)) rmSync(distDir, { recursive: true })
    mkdirSync(distDir)

    const mon = nodemon({
        exec: ' ',
        watch: [path.dirname(mainJSPath)],
        ext: '.css,.js,.node' 
    })

    mon.on('restart', runBuild)

    const buildProcess = spawn('npm.cmd', ['run', 'bundle-dev'])
    buildProcess.stdout.on('data', v => process.stdout.write(v))
    buildProcess.stderr.on('data', v => process.stdout.write(v))
    
    function runBuild(files) {
        if (isStart) return console.log('delay compile')
        isStart = true
        setTimeout(() => {
            console.log('-------------Reload_App--------------')
            try {
                fakeSetTimeout().clearAll()
                const codeContent = readFileSync(mainJSPath, 'utf-8')
                const newCode = `
                (function(){
                    const { setTimeout, setInterval, clearTimeout, clearInterval } = fakeSetTimeout()
                    ;${codeContent};
                })()`
                eval(newCode)
            } catch (error) {
                console.log(error)
            }
            isStart = false
        }, 300)

    }
}

function fakeSetTimeout() {
    let list = {}

    const result = {
        setTimeout(callback, timeout) {
            const id = setTimeout(() => (delete list[id], callback()), timeout)
            list[id] = true
            return id
        },
        setInterval(callback, timeout) {
            const id = setInterval(callback, timeout)
            list[id] = true
            return id
        },
        clearTimeout(id) {
            delete list[id]
            clearTimeout(id)
        },
        clearInterval(id) {
            delete list[id]
            clearTimeout(id)
        },
        clearAll() {
            for (const id in list) {
                clearTimeout(id)
                console.log('clear timeout', id)
            }
            list = {}
        }
    }

    fakeSetTimeout = () => result

    return result
}