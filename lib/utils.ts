import chalk from "chalk"
import { existsSync, mkdirSync, writeFile } from "fs"
import { Fetchable, fetcher } from "./fetch"

export function clearLastLine() {
    process.stdout.moveCursor(0, -1)
    process.stdout.clearLine(1)
}

export function savableName(name: string): string {
    return name.replaceAll(/[\\\/:\*\?"<>\|]/g, '_')
}

export function getDateFromURL(url: string): string | undefined {
    return url.match(/(?<=(%2F)|(\/))([0-9]+)(?=(%2F)|(\/))/)?.[0]
}

export async function writer(f: Fetchable) {
    const dir = './out/' + f.date
    if (!existsSync(dir)) {
        mkdirSync(dir)
    }
    console.log(chalk.magenta.bold('Downloading album ' + f.date))
    for (const [name, buf] of await fetcher(f)) {
        writeFile(dir + '/' + savableName(name), buf, () => { })
    }
}