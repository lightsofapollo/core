import * as fs from 'fs';
import * as path from 'path';
import * as uuid from 'uuid';

// My personal preference is to keep tmp _within_ the project so it's easy to
// rm -rf the whole thing if stuff is broken.
const TEMP_PATH = path.join(__dirname, 'tmp');

// process global of the created tmp paths.
const CREATED_TMP: string[] = [];

function mkdir(path: string) {
  try {
    fs.mkdirSync(path);
  } catch (e) {
    if (e.code === 'EEXIST') {
      return;
    }
    throw e;
  }
}

function rm(path: string) {
  // XXX: Add better error handling ?
  fs.unlinkSync(path);
}

function removeTmpDir(dirPath: string) {
  for (const file of fs.readdirSync(dirPath)) {
    // Remove any files that exist in here already.
    rm(path.join(dirPath, file));
  }
  fs.rmdirSync(dirPath);
}

/**
 * Creates a unique path
 */
function initializeTmpDir(root: string): string {
  const id = uuid.v4();
  const dirPath = path.join(root, id);
  mkdir(dirPath);
  return dirPath;
}

// Ensure we cleanup after ourselves.
afterAll(() => {
  CREATED_TMP.forEach(removeTmpDir);
});

// Ensure our top level tmp dir is created.
mkdir(TEMP_PATH);

/**
 * Get a unique temporary dir and ensure it gets deleted after tests have run.
 */
export function reserveTmpDir(): string {
  const dirPath = initializeTmpDir(TEMP_PATH);
  CREATED_TMP.push(dirPath);
  return dirPath;
}
