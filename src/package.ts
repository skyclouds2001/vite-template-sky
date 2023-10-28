/**
 * major package managers
 */
export enum PackageManager {
  PNPM = 'pnpm',
  YARN = 'yarn',
  NPM = 'npm',
}

/**
 * get the package manager name of current execute process
 * @param userAgent userAgent of the
 * @returns the name of the package manager
 */
export function getPackageManager(userAgent: string): PackageManager {
  let pkg

  if (userAgent.includes('pnpm')) {
    pkg = PackageManager.PNPM
  } else if (userAgent.includes('yarn')) {
    pkg = PackageManager.YARN
  } else if (userAgent.includes('npm')) {
    pkg = PackageManager.NPM
  } else {
    pkg = PackageManager.NPM
  }

  return pkg
}
