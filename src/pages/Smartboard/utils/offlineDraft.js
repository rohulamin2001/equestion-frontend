const DB_NAME = "smartproshnobank_smartboard_v1";
const STORE_NAME = "drafts";
const DB_VERSION = 1;

function openDraftDb() {
  if (typeof indexedDB === "undefined") {
    return Promise.resolve(null);
  }
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "draftKey" });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export function buildDraftKey(userId, lessonId) {
  return `${userId || "anon"}::${lessonId || "local_active"}`;
}

export async function saveOfflineDraft({
  userId,
  lessonId,
  lessonSnapshot,
  dirtySlideIds = [],
}) {
  const db = await openDraftDb();
  if (!db) return false;
  const draftKey = buildDraftKey(userId, lessonId);

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.put({
        draftKey,
        userId: userId || "anon",
        lessonId: lessonId || "local_active",
        lessonSnapshot,
        dirtySlideIds,
        updatedAt: Date.now(),
      });
      tx.oncomplete = () => {
        db.close();
        resolve(true);
      };
      tx.onerror = () => {
        db.close();
        resolve(false);
      };
    } catch {
      db.close();
      resolve(false);
    }
  });
}

export async function getOfflineDraft(userId, lessonId) {
  const db = await openDraftDb();
  if (!db) return null;
  const draftKey = buildDraftKey(userId, lessonId);

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(draftKey);
      req.onsuccess = () => {
        db.close();
        resolve(req.result || null);
      };
      req.onerror = () => {
        db.close();
        resolve(null);
      };
    } catch {
      db.close();
      resolve(null);
    }
  });
}

export async function deleteOfflineDraft(userId, lessonId) {
  const db = await openDraftDb();
  if (!db) return false;
  const draftKey = buildDraftKey(userId, lessonId);

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(draftKey);
      tx.oncomplete = () => {
        db.close();
        resolve(true);
      };
      tx.onerror = () => {
        db.close();
        resolve(false);
      };
    } catch {
      db.close();
      resolve(false);
    }
  });
}

export async function clearUserOfflineDrafts(userId) {
  const db = await openDraftDb();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      const req = store.openCursor();
      req.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          if (!userId || cursor.value?.userId === userId) {
            cursor.delete();
          }
          cursor.continue();
        }
      };
      tx.oncomplete = () => {
        db.close();
        resolve(true);
      };
      tx.onerror = () => {
        db.close();
        resolve(false);
      };
    } catch {
      db.close();
      resolve(false);
    }
  });
}
