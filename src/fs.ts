import fs from 'node:fs'
import path from 'node:path'

/**
 * files or dictionaries that should ignore in check and execute
 */
export const IGNORE_CHECK = ['.git', '.vscode', '.idea', '.fleet']

/**
 * files or dictionaries that should ignore in copy
 */
export const IGNORE_COPY = ['.git', 'node_modules', 'dist', '_']

/**
 * check if the target dictionary empty, will ignore those files in ignore list
 * @param dir target dictionary
 * @returns check result
 */
export function isEmptyDir(dir: string): boolean {
  const files = fs.readdirSync(dir)

  return files.length === 0 || files.every((file) => IGNORE_CHECK.includes(file))
}

/**
 * clear the target dictionary to empty, will ignore those files in ignore list
 * @param dir target dictionary
 */
export function clearDir(dir: string): void {
  for (const file of fs.readdirSync(dir)) {
    if (IGNORE_CHECK.includes(file)) {
      continue
    }

    fs.rmSync(path.resolve(dir, file), {
      recursive: true,
      force: true,
    })
  }
}

/**
 * copy the file from the source to the target, will ignore those files in ignore list and existed in the target
 * @param src source path
 * @param dest target path
 */
export function copy(src: string, dest: string): void {
  if (fs.statSync(src).isDirectory()) {
    fs.mkdirSync(dest, {
      recursive: true,
    })

    for (const file of fs.readdirSync(src)) {
      if (IGNORE_COPY.includes(file)) {
        continue
      }

      copy(path.resolve(src, file), path.resolve(dest, file))
    }
  } else {
    fs.copyFileSync(src, dest)
  }
}
