/**
 * validate if a project name is valid in all os systems
 * @param name project name
 * @returns validation result
 */
export function isValidProjectName(name: string): boolean {
  return !/^\.|[\\\\/:*?"<>|]/gim.test(name)
}

/**
 * validate if a package name is valid in all os systems
 * @param name package name
 * @returns validation result
 */
export function isValidPackageName(name: string): boolean {
  return /^(?:@[a-z\d\-*~][a-z\d\-*._~]*\/)?[a-z\d\-~][a-z\d\-._~]*$/.test(name)
}
