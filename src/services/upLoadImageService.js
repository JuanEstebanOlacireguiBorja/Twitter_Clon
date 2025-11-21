import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as FileSystem from "expo-file-system";

export const upLoadProfileImage = async (uid, localUri) => {
  try {
    const imageRef = ref(storage, `profileImages/${uid}.jpg`);

    const fileBase64 = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const blob = Buffer.from(fileBase64, "base64");

    await uploadBytes(imageRef, blob, { contentType: "image/jpeg" });

    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (error) {
    console.log("Upload error:", error);
    return null;
  }
};
