// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL,deleteObject } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCz0LtfSnAiw-beuhwzPzO0CI-10G1K7bY",
    authDomain: "e-commerce-imges.firebaseapp.com",
    projectId: "e-commerce-imges",
    storageBucket: "e-commerce-imges.appspot.com",
    messagingSenderId: "599467922812",
    appId: "1:599467922812:web:8e766481ea271dbfad00f9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Function to upload a single image and get the URL
export const uploadImage = async (file) => {
  const storageRef = ref(storage, `images/${file.name}`);
  try {
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Error uploading image");
  }
};

// Function to upload multiple images and get their URLs
export const uploadImagesToFirebase = async (files) => {
  const urls = [];
  for (const file of files) {
    try {
      const url = await uploadImage(file);
      urls.push(url);
    } catch (error) {
      console.error("Error uploading image:", error);
      // Optionally handle individual upload errors
    }
  }
  return urls;
};


export const deleteImageFromFirebase = async (url) => {
  const storageRef = ref(storage, url);
  try {
      await deleteObject(storageRef);
      console.log('Imagen eliminada con éxito');
  } catch (error) {
      console.error('Error al eliminar imagen:', error);
      throw new Error('Error al eliminar imagen');
  }
};