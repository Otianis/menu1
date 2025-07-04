// هذا الملف يعمل مع Firebase Firestore
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// جلب الاتصال من Firebase
const db = window.db;
const {
  addDoc: add,
  collection: col,
  getDocs: getAll,
  deleteDoc,
  doc,
  updateDoc,
} = window.firestoreFns;

// 🔸 إضافة منتج جديد إلى قسم
window.addProductToFirestore = async function (section, product) {
  try {
    await add(col(db, "menu", section, "items"), product);
    alert("✅ تم إضافة المنتج بنجاح!");
  } catch (error) {
    alert("❌ خطأ أثناء الإضافة: " + error.message);
  }
};

// 🔸 جلب جميع الأقسام
window.getMenuFromFirestore = async function () {
  const menu = {};
  const snapshot = await getAll(col(db, "menu"));
  for (const sectionDoc of snapshot.docs) {
    const sectionName = sectionDoc.id;
    const itemsSnapshot = await getAll(col(db, "menu", sectionName, "items"));
    menu[sectionName] = itemsSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  }
  return menu;
};

// 🔸 جلب المنتجات حسب القسم
window.getProductsBySection = async function (section) {
  const itemsSnapshot = await getAll(col(db, "menu", section, "items"));
  return itemsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
};

// 🔸 حذف منتج
window.deleteProductFromFirestore = async function (section, id) {
  await deleteDoc(doc(db, "menu", section, "items", id));
};

// 🔸 تحديث منتج
window.updateProductInFirestore = async function (section, id, newData) {
  await updateDoc(doc(db, "menu", section, "items", id), newData);
};
