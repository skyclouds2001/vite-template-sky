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
 * files that should override project information (exclude package.json as it requires additional tasks to execute and README.md as it is not intended to edit)
 */
export const OVERRIDE_FILE = {
  repository: ['.github/workflows/release.yml'],
  packageName: ['.all-contributorsrc', 'CHANGELOG.md', 'CONTRIBUTING.md', 'index.html', '.changeset/config.json', '.github/workflows/ci.yml', '.github/workflows/labeler.yml', '.github/workflows/new-contributor.yml', '.github/workflows/project-automate.yml', '.github/workflows/release.yml', '.github/workflows/stale.yml', 'public/site.webmanifest', 'tests/e2e/index.spec.ts'],
  userName: ['.all-contributorsrc', 'Dockerfile', 'index.html', 'LICENSE', '.changeset/config.json', '.github/dependabot.yml', '.github/ISSUE_TEMPLATE/bug-report.md', '.github/ISSUE_TEMPLATE/feature-request.md', '.github/ISSUE_TEMPLATE/other.md', '.github/workflows/ci.yml', '.github/workflows/labeler.yml', '.github/workflows/new-contributor.yml', '.github/workflows/project-automate.yml', '.github/workflows/release.yml', '.github/workflows/stale.yml'],
  userEmail: ['CODE_OF_CONDUCT.md', 'Dockerfile', 'index.html', 'SECURITY.md'],
}

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
