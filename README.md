# vuejs-firebase-cruder

Requires Node.js 24 LTS (or the supported versions in `package.json`).

```sh
npm ci
npm run serve
```

The Vite development server defaults to localhost:5173. To build and verify:

```sh
npm run lint
npm test
npm run build
npm audit
```

Production files are written to `dist/`. Vue 3 and Vite replace the unsupported Vue 2 / Vue CLI toolchain. The lockfile is committed; use `npm ci` for reproducible installs.

The current Firebase SDK uses its supported `compat` imports to preserve the existing Firestore collection and document API. Tests mock Firebase and never contact or modify the live project. Live authentication, Firestore rules and deployed data access still require a separately authorized integration check.

Firebase 13.1.0 pins `@grpc/grpc-js` to the vulnerable 1.9 minor series. A scoped override selects 1.14.6, within the same major API, to address GHSA-m9gg-hp2v-232j and GHSA-f596-whhp-79r4. This transport is used by Firebase's Node entry; browser bundles use the web transport. Re-evaluate the override when upgrading Firebase. See the [gRPC patch release](https://github.com/grpc/grpc-node/releases/tag/@grpc%2Fgrpc-js@1.13.6) and [Firebase compatibility guide](https://firebase.google.com/docs/web/modular-upgrade).

The Firebase compatibility bundle remains larger than Vite's 500 kB advisory threshold; the production build succeeds. A future modular SDK migration can reduce download size.

Hash routing is preserved. Authentication waits for Firebase initialization before mounting, updates navigation on auth-state changes, and uses router navigation after login/logout. Obsolete CDN jQuery/Materialize JavaScript was removed; the existing CSS and mobile navigation remain.
