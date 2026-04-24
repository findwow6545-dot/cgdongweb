import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, query, orderBy, serverTimestamp
} from 'firebase/firestore';
import {
  ref, uploadBytesResumable, getDownloadURL, deleteObject
} from 'firebase/storage';
import { db, storage } from './config';

const COL = 'projects';

export async function getProjects() {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function uploadImage(file, onProgress) {
  const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file);
    task.on('state_changed',
      snap => onProgress && onProgress(Math.round(snap.bytesTransferred / snap.totalBytes * 100)),
      reject,
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve({ url, path: storageRef.fullPath });
      }
    );
  });
}

export async function addProject(data) {
  return addDoc(collection(db, COL), { ...data, createdAt: serverTimestamp() });
}

export async function updateProject(id, data) {
  return updateDoc(doc(db, COL, id), data);
}

export async function deleteProject(id, imagePaths = []) {
  for (const path of imagePaths) {
    try { await deleteObject(ref(storage, path)); } catch {}
  }
  return deleteDoc(doc(db, COL, id));
}
