import fs from 'node:fs'
import path from 'node:path'

/**
 * files or dictionaries that should ignore in check and execute
 */
export const IGNORES = ['.git']

/**
 * check if the target dictionary empty
 * @param dir target dictionary
 * @returns check result
 */
export function isEmptyDir(dir: string): boolean {
  const files = fs.readdirSync(dir)

  return files.length === 0 || files.every((file) => IGNORES.includes(file))
}

/**
 * clear the target dictionary to empty
 * @param dir target dictionary
 */
export function clearDir(dir: string): void {
  for (const file of fs.readdirSync(dir)) {
    if (IGNORES.includes(file)) {
      continue
    }

    fs.rmSync(path.resolve(dir, file), {
      recursive: true,
      force: true,
    })
  }
}

/**
 * copy the file from the source to the target
 * @param src source path
 * @param dest target path
 */
export function copy(src: string, dest: string): void {
  if (fs.statSync(src).isDirectory()) {
    fs.mkdirSync(dest, {
      recursive: true,
    })

    for (const file of fs.readdirSync(src)) {
      if (IGNORES.includes(file) && fs.existsSync(path.resolve(dest, file))) {
        continue
      }

      copy(path.resolve(src, file), path.resolve(dest, file))
    }
  } else {
    fs.copyFileSync(src, dest)
  }
}
