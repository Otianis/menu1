const menuData = JSON.parse(localStorage.getItem("menuData")) || {};
let editMode = false;
let editSection = "";
let editIndex = -1;

function buildMenuUI() {
  const list = document.getElementById("menu-list");
  if (!list) return;

  list.innerHTML = "";
  Object.keys(menuData).forEach(section => {
    const title = document.createElement("h3");
    title.textContent = section;
    list.appendChild(title);

    menuData[section].forEach((item, index) => {
      const card = document.createElement("div");
      card.className = "product-card";
      const imgHTML = item.img ? `<img src="${item.img}" alt="${item.name}" />` : "";
      card.innerHTML = `
        ${imgHTML}
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <p class="price">${item.price} دج</p>
        <div class="admin-actions">
          <button onclick="editItem('${section}', ${index})">✏️ تعديل</button>
          <button onclick="deleteItem('${section}', ${index})">🗑️ حذف</button>
        </div>
      `;
      list.appendChild(card);
    });
  });
}

function addOrUpdateProduct() {
  const section = document.getElementById("section").value.trim();
  const name = document.getElementById("name").value.trim();
  const desc = document.getElementById("desc").value.trim();
  const price = document.getElementById("price").value.trim();
  const imgInput = document.getElementById("img");
  const addBtn = document.getElementById("addBtn");

  if (!section || !name || !price) {
    alert("يرجى ملء كل البيانات");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const img = e.target.result;
    const product = { name, desc, price, img };

    if (!menuData[section]) menuData[section] = [];

    if (editMode) {
      menuData[editSection][editIndex] = product;
      editMode = false;
      addBtn.textContent = "➕ إضافة المنتج";
    } else {
      menuData[section].push(product);
    }

    localStorage.setItem("menuData", JSON.stringify(menuData));
    resetForm();
    buildMenuUI();
  };

  if (imgInput.files[0]) {
    reader.readAsDataURL(imgInput.files[0]);
  } else {
    const img = editMode ? menuData[editSection][editIndex].img : "";
    const product = { name, desc, price, img };

    if (!menuData[section]) menuData[section] = [];

    if (editMode) {
      menuData[editSection][editIndex] = product;
      editMode = false;
      addBtn.textContent = "➕ إضافة المنتج";
    } else {
      menuData[section].push(product);
    }

    localStorage.setItem("menuData", JSON.stringify(menuData));
    resetForm();
    buildMenuUI();
  }
}

function editItem(section, index) {
  const item = menuData[section][index];
  document.getElementById("section").value = section;
  document.getElementById("name").value = item.name;
  document.getElementById("desc").value = item.desc;
  document.getElementById("price").value = item.price;
  document.getElementById("img").value = "";
  document.getElementById("addBtn").textContent = "💾 حفظ التعديل";
  editMode = true;
  editSection = section;
  editIndex = index;

  document.querySelector(".form-section").scrollIntoView({ behavior: "smooth" });
}

function deleteItem(section, index) {
  if (!confirm("هل أنت متأكد من حذف هذا المنتج؟")) return;
  menuData[section].splice(index, 1);
  if (menuData[section].length === 0) delete menuData[section];
  localStorage.setItem("menuData", JSON.stringify(menuData));
  buildMenuUI();
}

function resetForm() {
  document.getElementById("section").value = "";
  document.getElementById("name").value = "";
  document.getElementById("desc").value = "";
  document.getElementById("price").value = "";
  document.getElementById("img").value = "";
  editMode = false;
  editSection = "";
  editIndex = -1;
  document.getElementById("addBtn").textContent = "➕ إضافة المنتج";
}

function previewSite() {
  window.open("index.html", "_blank");
}

function generateQRCode() {
  const canvas = document.getElementById("qrcode");
  QRCode.toCanvas(canvas, window.location.origin + "/index.html", function (error) {
    if (error) console.error(error);
  });
}

function printQRCode() {
  const canvas = document.getElementById("qrcode");
  const dataUrl = canvas.toDataURL("image/png");
  const win = window.open();
  win.document.write(`<img src="${dataUrl}" onload="window.print();window.close()" />`);
}

function saveToStorage() {
  localStorage.setItem("menuData", JSON.stringify(menuData));
  alert("تم حفظ التحديث ✅");
}

document.addEventListener("DOMContentLoaded", buildMenuUI);
