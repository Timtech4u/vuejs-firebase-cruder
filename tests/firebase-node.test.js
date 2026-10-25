// @vitest-environment node
import { it, expect } from 'vitest';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import { Client, credentials } from '@grpc/grpc-js';
it('initializes Firebase Node and its patched gRPC transport without network requests', async () => {
  const app = firebase.initializeApp({ projectId: 'security-check-only' }, 'offline-check');
  const db = app.firestore();
  expect(db.collection('employees').doc('test').path).toBe('employees/test');
  const client = new Client('localhost:1', credentials.createInsecure());
  client.close();
  await db.terminate();
  await app.delete();
});
