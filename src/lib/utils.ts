import { Timestamp } from "firebase/firestore";
import { Route } from "../types";
import { ROUTES } from "../constants";
import { UserDocument } from "@/firebase/types";
import { getImageUrl, uploadImage } from "@/firebase/storage";
import { updateCoverUrl, updatePhotoUrl } from "@/firebase/database";

export function formatTimestamp(timestamp: Timestamp) {
  const date = timestamp.toDate();
  return `${date.toLocaleString("en-UK", {
    day: "2-digit",
    month: "long",
  })} at ${date.toLocaleString("en-UK", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

export function getRoutePath(route: Route) {
  return route === "Home" ? "/" : `/${route.toLowerCase()}`;
}

export function getTabIndex(pathName: string) {
  const index = ROUTES.findIndex((route) => pathName === getRoutePath(route));
  return index === -1 ? false : index;
}

export async function handleImageUpload(
  file: File,
  authUser: UserDocument,
  type: "avatar" | "cover"
) {
  const result = await uploadImage(file);
  const url = await getImageUrl(result.ref.fullPath);
  switch (type) {
    case "avatar":
      updatePhotoUrl(authUser.ref, url);
      break;
    case "cover":
      updateCoverUrl(authUser.ref, url);
    default:
      return;
  }
}
