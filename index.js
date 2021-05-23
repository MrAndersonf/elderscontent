
let firebaseConfig = require(path.resolve(__dirname+'./firebaseConfig.js'))
firebase.initializeApp(firebaseConfig);
firebase.analytics();
var firestore = firebase.firestore();
const docref = firestore.doc("users/66");
docref
  .set({
    id: 6,
    name: "Defensivos",
  })
  .then(() => console.log("saved"))
  .catch((err) => console.log(err));
firestore
  .collection("users")
  .get()
  .then(function (querySnapshot) {
    querySnapshot.forEach(function (doc) {
      console.log(doc.id, " => ", doc.data());
    });
  });
