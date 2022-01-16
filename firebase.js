const firebase = require('firebase/app');
var firebaseConfig = {
  apiKey: "AIzaSyCKDICRkVxUdBBtrlENCC_X3oOTed92UTw",
  authDomain: "myappproject-5852a.firebaseapp.com",
  projectId: "myappproject-5852a",
  storageBucket: "myappproject-5852a.appspot.com",
  messagingSenderId: "994101301871",
  appId: "1:994101301871:web:93554248936885f709b39a",
  measurementId: "G-X968L09L5K",
};

firebase.initializeApp(firebaseConfig);

firebase.analytics();

var firestore = firebase.firestore();

readVideoFromFirebase();

confirmDeleteNotify("dsds");

function hasInvalidInputs(inputs) {
  let invalids = 0;
  inputs.forEach((input) => {
    if (input === "") {
      invalids += 1;
      console.log(invalids);
    }
  });
  if (invalids > 0) {
    notify("Existem campos obrigatórios não preenchidos.");
    return true;
  }
  return false;
}
function writeVideoToFirebase(e) {
  e.preventDefault();
  let _id = getElement("id");
  let _title = getElement("title");
  let inputs = [_id.value, _title.value];
  if (hasInvalidInputs(inputs)) return;
  if (isEmpty(subjectsList)) return;
  let path = `Videos/${_id.value}`;
  const docref = firestore.doc(path);
  docref
    .set({
      id: _id.value,
      title: _title.value,
      tags: [...subjectsList],
      likes: [],
      comments: [],
    })
    .then(() => {
      readVideoFromFirebase();
      _id.value = "";
      _title.value = "";
      subjectsList = [];
      cleanChildren("subjects_container");
      notify("Registro salvo com sucesso!");
    })
    .catch((err) => console.log(err));
}
function writeRecipeToFirebase(e) {
  e.preventDefault();
  let _id = getElement("recepi_id");
  let _name = getElement("recepi_name");
  let inputs = [_id.value, _name.value];
  if (hasInvalidInputs(inputs)) return;
  if (isEmpty(subjectsList)) return;
  let path = `Videos/${_id.value}`;
  const docref = firestore.doc(path);
  docref
    .set({
      id: _id.value,
      name: _name.value,
    })
    .then(() => {
      readVideoFromFirebase();
      _id.value = "";
      _name.value = "";
      cleanChildren("subjects_container");
      notify("Registro salvo com sucesso!");
    })
    .catch((err) => console.log(err));
}
function editVideoFromFirebase() {
  let _id = $("#idEdit").val();
  let _title = $("#titleEdit").val();
  let _tag = $("#tagEdit").val();
  if (_id && _title && _tag !== "") {
    const docref = firestore.doc(`Videos/${_id}`);
    docref
      .set({
        id: _id,
        title: _title,
        tags: [..._tag.split(",")],
      })
      .then(() => {
        readVideoFromFirebase();
        $("#idEdit").val("");
        $("#titleEdit").val("");
        $("#tagEdit").val("");
        $("#modalEdit").modal("hide");
        alert("Registro editado com sucesso!");
      })
      .catch((err) => console.log(err));
  }
}
function deleteRegister(e, id) {
  e.preventDefault();
  let buttonDel = getElement("buttonDeleteVideo");
  confirmDeleteNotify("Confirma a exclusão do vídeo ?");
  buttonDel.onclick = function () {
    deleteVideoFromFirebase(id);
  };
}
function deleteVideoFromFirebase(id) {
  firestore
    .collection("Videos")
    .doc(id)
    .delete()
    .then(() => {
      readVideoFromFirebase();
      closeToastNotificationDelete();
      notify("Registro deletado com sucesso.");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
}

var myModal = new bootstrap.Modal(document.getElementById("modalPlay"), {
  keyboard: false,
});

let videoModal = document.getElementById("modalPlay");

videoModal.addEventListener("hidden.bs.modal", () => {
  let iframeVideo = getElement("videoSource");
  iframeVideo.src = "";
});
function playVideo(id) {
  let videoSource = `https://www.youtube.com/embed/${id}?&autoplay=1`;
  let iframeVideo = getElement("videoSource");
  iframeVideo.src = videoSource;
  myModal.show();
}
function playEdit(id) {
  firestore
    .collection("Videos")
    .doc(id)
    .get()
    .then((querySnapshot) => {
      let doc = querySnapshot.data();
      getElement("id").value = doc.id;
      getElement("title").value = doc.title;
      subjectsList = doc.tags;
      let pills = doc.tags.map((sub) => createSubjectPill(sub));
      pills.forEach((pill) => addPillToSubjectList(pill));
    });
}

function cleanChildren(id) {
  let element = document.getElementById(id);
  if (element.childElementCount == 0) return element;
  element.innerHTML = "";
  return element;
}
function appendHTML(element, content) {
  element.innerHTML = content;
}
function insertToPage(content) {
  let element = cleanChildren("videos_list");
  appendHTML(element, content);
}
function setMessageToModalNotify(message) {
  document.getElementById("toast_message").innerText = message;
}
function setMessageToModalConfirmDelete(message) {
  document.getElementById("confirm_message").innerText = message;
}
function convertToDateTimePtBr(date) {
  let day = date.toLocaleDateString("pt-br");
  let time = date.toLocaleTimeString("pt-br");
  return `${day} - ${time}`;
}
function setDateTimeToModalNotify() {
  document.getElementById("toast_time").innerText = convertToDateTimePtBr(
    new Date()
  );
}
function toastNotification() {
  let option = {
    animation: true,
    autohide: true,
    delay: 3000,
  };
  let toast = document.getElementById("liveToast");
  let alerter = new bootstrap.Toast(toast, option);
  alerter.show();
}
function toastNotificationDelete() {
  let option = {
    animation: true,
    autohide: true,
    delay: 5000,
  };
  let toast = document.getElementById("confirmDelete");
  let alerter = new bootstrap.Toast(toast, option);
  alerter.show();
}
function closeToastNotificationDelete() {
  let toast = document.getElementById("confirmDelete");
  let alerter = new bootstrap.Toast(toast);
  alerter.hide();
}
function notify(message) {
  setMessageToModalNotify(message);
  setDateTimeToModalNotify();
  toastNotification();
}
function confirmDeleteNotify(message) {
  setMessageToModalConfirmDelete(message);
  toastNotificationDelete();
}
function getElement(id) {
  try {
    let element = document.getElementById(id);
    if (!element) {
      console.log(
        `Error: id ${id} doesn't references any HTML valid object.`
      );
      return;
    }
    return element;
  } catch (error) {
    console.log(error);
  }
}
function createElement(tagName) {
  return document.createElement(tagName);
}
function setElementCssClass(element, className) {
  element.classList.add(className);
}
function setElementInnerText(element, text) {
  element.innerText = text;
}
function setElementInnerHTML(element, innerHTML) {
  element.innerHTML = innerHTML;
}
function appendChild(element, child) {
  element.appendChild(child);
}
function handleSubjectsList(newSubject) {
  return (subjectsList = [...subjectsList, newSubject]);
}
function handleRowsList(row) {
  rows = [...rows, row];
}
function createSubjectPill(value) {
  let mainDiv = createElement("div");
  setElementCssClass(mainDiv, "subjects_item");
  let divValue = createElement("div");
  divValue.appendChild(document.createTextNode(value));
  let divBtn = createElement("div");
  setElementCssClass(divBtn, "subject_button");
  let button = createElement("button");
  button.onclick = function () {
    removePillFromSubjectList(event, value);
  };
  setElementCssClass(button, "remove_subject");
  setElementInnerHTML(button, '<i class="fas fa-trash-alt"></i>');
  appendChild(divBtn, button);
  appendChild(mainDiv, divValue);
  appendChild(mainDiv, divBtn);
  return mainDiv;
}
function addPillToSubjectList(pill) {
  let element = getElement("subjects_container");
  appendChild(element, pill);
}
function addPillToRowsList(pill) {
  let element = getElement("rows_container");
  appendChild(element, pill);
}
function removePillFromSubjectList(e, value) {
  e.preventDefault();
  cleanChildren("subjects_container");
  subjectsList.splice(subjectsList.indexOf(value), 1);
  let pills = subjectsList.map((sub) => createSubjectPill(sub));
  pills.forEach((pill) => addPillToSubjectList(pill));
}
function isEmpty(value) {
  if (value == "") {
    notify("O campo ASSUNTO não pode ser vazio.");
    return true;
  }
}
function isEmpty(value) {
  let type = typeof value;
  console.log(type);
  if (type === "string") {
    if (value == "") {
      notify("O campo ASSUNTO não pode ser vazio.");
      return true;
    }
  }
  if (type === "object") {
    if (value.length <= 0) {
      notify("O campo ASSUNTO não pode ser vazio.");
      getElement("tag").focus();
      return true;
    }
  }
}
function alreadyExists(value) {
  if (subjectsList.includes(value.toLowerCase())) {
    notify("O assunto já está selecionado.");
    return true;
  }
}
function insertSubject(e) {
  e.preventDefault();
  let subject = getElement("tag");
  if (isEmpty(subject.value)) return;
  if (alreadyExists(subject.value)) return;
  let pill = createSubjectPill(subject.value);
  handleSubjectsList(subject.value);
  addPillToSubjectList(pill);
  subject.value = "";
  subject.focus();
}
function insertRecepiRow(e) {
  e.preventDefault();
  let subject = getElement("recepi_row");
  if (isEmpty(subject.value)) return;
  if (alreadyExists(subject.value)) return;
  let pill = createSubjectPill(subject.value);
  handleRowsList(subject.value);
  addPillToRowsList(pill);
  subject.value = "";
  subject.focus();
}
function setThumbnail(id) {
  document.getElementById(
    "recepi_video"
  ).src = `https://img.youtube.com/vi/${id}/0.jpg`;
  recipe_obj.video_id = id;
}
function setRecipeName(name) {
  document.getElementById("preview_title").textContent = name;
  recipe_obj.recepi_name = name;
}
function setRecipeSection(section) {
  section.name = section;
}
