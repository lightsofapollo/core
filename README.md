# core

Everything


## Monorepo

Core is structured around a javascript centric (for now at least) single repo.
Sub directories may contain `package.json` and will symlink `node_modules` to
provide a familiar working environment.

The current implementation stores all dependencies in the root `package.json` / `yarn.lock`.

The checked in `node_modules` symlinks in individual projects (see `/web/`) allow
use of `./node_modules/.bin` but is not required for module resolution...

The parent (in root of core) `node_modules` is always searched due to how the
module system resolvers work (both webpack / node).



