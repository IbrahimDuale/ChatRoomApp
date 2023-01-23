const functions = require("firebase-functions");


const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore();

exports.new_user = functions.database.ref('/users/{id}')
    .onCreate((snapshot, context) => {
        const data = snapshot.val();
        const room_id = data.room_id;
        const user_id = data.id;
        const name = data.name;
        const doc = firestore.doc(`room_members/${room_id}/room_members/${user_id}`);
        return doc.set({ name, id: user_id });

    });

exports.user_left = functions.database.ref('/users/{id}')
    .onDelete((snapshot, context) => {
        const data = snapshot.val();
        const room_id = data.room_id;
        const user_id = data.id;
        const name = data.name;
        const doc = firestore.doc(`room_members/${room_id}/room_members/${user_id}`);
        return doc.delete();
    });