import { userCollection } from "@/firebase/database";
import { UserDocument } from "@/firebase/types";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function useUser(id?: string) {
  const [user, setUser] = useState<UserDocument>();

  useEffect(() => {
    (async () => {
      if (id) {
        const ref = doc(userCollection, id);
        const userDoc = await getDoc(ref);
        const data = userDoc.data();
        setUser(data);

        const unsubscribe = onSnapshot(ref, {
          next(snapshot) {
            setUser(snapshot.data());
          },
        });
        return () => unsubscribe();
      }
    })();
  }, [id]);

  return user;
}
