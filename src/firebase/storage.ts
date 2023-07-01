import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./firebase";
import { v4 as uuidv4 } from "uuid";

export async function uploadImage(file: File) {
  const storageRef = ref(storage, `images/${uuidv4()}`);
  const result = await uploadBytes(storageRef, file);
  return result;
}

export async function getImageUrl(path: string) {
  const imageRef = ref(storage, path);
  const url = await getDownloadURL(imageRef);
  return url;
}
