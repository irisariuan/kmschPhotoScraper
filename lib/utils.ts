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