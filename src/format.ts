/**
 * format the project name
 * @param name the origin project name
 * @returns the formatted project name
 */
export function formatProjectName(name: string): string {
  return name.trim().replace(/\/+$/g, '')
}

/**
 * format the package name
 * @param name the origin package name
 * @returns the formatted package name
 */
export function formatPackageName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z\d\-~]+/g, '-')
}
