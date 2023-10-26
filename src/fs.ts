import fs from 'node:fs'

/**
 * check if the target dictionary empty
 * @param dir target dictionary
 * @returns check result
 */
export function isEmptyDir(dir: string): boolean {
  const files = fs.readdirSync(dir)

  return files.length === 0
}
