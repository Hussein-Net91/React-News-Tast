import firebase from 'firebase'
var config = {
    apiKey: "AIzaSyAH_djggMDzJD0MPErTk5QIEDuqSUDjT3U",
    authDomain: "votedb-f9aaf.firebaseapp.com",
    databaseURL: "https://votedb-f9aaf.firebaseio.com",
    projectId: "votedb-f9aaf",
    storageBucket: "votedb-f9aaf.appspot.com",
    messagingSenderId: "967310616320"
  };
const firebaseApp=firebase.initializeApp(config);
const firestore = firebase.firestore();
const settings = {/* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);
let db = firebase.firestore()
export default  db;
