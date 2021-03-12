import {
  clearFirestoreData,
  assertFails,
  initializeTestApp,
  apps,
} from '@firebase/rules-unit-testing';
import crypto from 'crypto-random-string';
import { keys } from '@utils/constants';

beforeEach(async () => {
  await clearFirestoreData({ projectId: keys.project });
});

afterAll(async () => {
  await Promise.all(apps().map((app) => app.delete()));
});

test('should not allow access to arbitrary collection except specified ones', async () => {
  const database = firestore();
  const collection = crypto({ length: random() });
  const document = crypto({ length: random() });
  const reference = database.collection(collection).doc(document);
  await assertFails(reference.get());
});

/** generate random integer number between min and max inclusive */
function random(min = 1, max = 100) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function firestore() {
  return initializeTestApp({ projectId: keys.project }).firestore();
}
