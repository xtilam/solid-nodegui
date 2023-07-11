let linkerIndex = 0
export class LinkerArray<T> extends Array<T> {
    linkerKey: string
    constructor() {
        super()
        this.linkerKey = `_linker_${(++linkerIndex).toString(36)}`
    }
    add(item: T) {
        if (this.isExistsItem(item)) this.remove(item)
        const length = this.push(item)
        this.updateLinkerIndex(length - 1)
        this.updateLinkerIndex(length - 2)
    }
    remove(item: T) {
        const index = this.getIndex(item)
        if (index === -1) {
            console.warn('not found item in array', item)
            return
        }

        this.splice(index, 1)
        delete item[this.linkerKey]

        const lastIndex = this.length - 1
        if (lastIndex === -1) return
        if (lastIndex === 0 || index === 0) this.updateLinkerIndex(0)
        if (index > lastIndex) this.updateLinkerIndex(lastIndex)
        this.updateLinkerIndex(index)
        this.updateLinkerIndex(index - 1)
    }
    insertBeforeItem() {
        throw Error('not support')
    }
    insertBeforeIndex(index: number, value: T) {
        if (index >= this.length) return this.add(value)
        if (index < 0) index = 0

        this.splice(index, 0, value)
        this.updateLinkerIndex(index)
        this.updateLinkerIndex(index - 1)
        this.updateLinkerIndex(index + 1)
    }
    getIndex(item: T) {
        if (!item) return -1
        if (!this.isExistsItem(item)) return -1
        let index = -1
        let countIndex = -1
        for (const c_item of this) {
            ++countIndex
            if (c_item !== item) continue
            index = countIndex
            break
        }
        return index
    }
    getNext(item: T) {
        return item[this.linkerKey][0]
    }
    getPre(item: T) {
        return item[this.linkerKey][1]
    }
    isExistsItem(item: T) {
        return item && item[this.linkerKey]
    }
    updateLinker() {
        const length = this.length
        for (let i = 0; i < length; i++) {
            this.updateLinkerIndex(i)
        }
    }
    showTrace(convertShow = (v) => `${v}`) {
        const tabbleTrace = []
        const length = this.length

        try {
            for (let i = 0; i < length; i++) {
                let cur: any = this[i]
                let saveNext = convertShow(cur[this.linkerKey][0])
                let savePre = convertShow(cur[this.linkerKey][1])
                let trueNext = convertShow(this[i + 1])
                let truePre = convertShow(this[i - 1])
                cur = convertShow(cur)
                tabbleTrace.push({ cur, trueNext, saveNext, truePre, savePre })
            }
        } catch (error) {
            tabbleTrace.push({ cur: `${error}` })
        }
        console.table(tabbleTrace)
    }
    updateLinkerIndex(index: number) {
        if (index >= this.length) return
        if (index < 0) index = 0
        this[index][this.linkerKey] = [this[index + 1], this[index - 1]]
    }
    checkValidTrace(message = '', errorShowTrace = true) {
        const length = this.length
        let i = 0
        try {
            for (i = 0; i < length; i++) {
                const next = this[i + 1]
                const pre = this[i - 1]
                const item = this[i]

                if (this.getPre(item) != pre) throw `invalid next`
                if (this.getNext(item) != next) throw `invalid pre`
            }
            if (!message) return
            console.log(`Check valid trace: ${message}`)
        } catch (error) {
            console.error(`Check trace error::$index[${i}]: ${error}`)
            if (errorShowTrace) this.showTrace()
        }
    }
}