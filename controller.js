import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getDatabase , ref, set, push, get, onValue, update, remove  } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAexoUr5I36apTD0UjFxSVQ2I2v8o4noao",
    authDomain: "tgwaterfallreservation.firebaseapp.com",
    databaseURL: "https://tgwaterfallreservation-default-rtdb.firebaseio.com",
    projectId: "tgwaterfallreservation",
    storageBucket: "tgwaterfallreservation.firebasestorage.app",
    messagingSenderId: "245064088849",
    appId: "1:245064088849:web:8efea2ab65a9bac2f2e0b0",
    measurementId: "G-C4JH5PHK5H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);



function _addOrUpdateReservation(reservationCode, fullName, totalPax, reservedate, reservetime)
{

    const dbRef = ref(database, 'reservations/' + reservationCode);

    return set(dbRef, {
        fullName: fullName,
        totalPax: totalPax,
        reservedate: reservedate,
        reservetime: reservetime,
        lastupdate: new Date().getTime(),
        tableno: ""
    })
        .then(() => {
            return "OK"
        })
        .catch((error) => {
            return error;
        });

}


function _getReservation(reservationCode)
{
    const dbRef = ref(database, 'reservations/' + reservationCode);

    return get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                return snapshot.val(); // Resolve with the data
            } else {
                return ""
            }
        })
        .catch((error) => {
            return error; // Forward the error
        });
}

function _updateTableNo(reservationCode, tableNo) {
        const dbRef = ref(database, 'reservations/' + reservationCode);

        return update(dbRef, {
            tableno: tableNo
        })
            .then(() => {
                return "OK"
            })
            .catch((error) => {
                return error; // Forward the error
            });
    }

    function _deleteReservation(reservationCode) {
        const dbRef = ref(database, 'reservations/' + reservationCode);

        return remove(dbRef)
            .then(() => {
                return "OK"
            })
            .catch((error) => {
                return error; // Forward the error
            });
    }


const App = {
    addEditReservation: (reservationCode, fullName, totalPax, reservedate, reservetime) =>
        {
        return _addOrUpdateReservation(reservationCode, fullName, totalPax, reservedate, reservetime)
            .then((data) => {
                return data; // Pass the data to the caller
            });
    },
    getReservation: (reservationCode) =>
    {
        
        return _getReservation(reservationCode)
            .then((data) => {
                return data; // Pass the data to the caller
            });
    },
    updateTableNo: (reservationCode, tableNo) =>
    {
        return _updateTableNo(reservationCode, tableNo)
        .then((data) => {
                return data; // Pass the data to the caller
            });
    },
    deleteReservation: (reservationCode) =>
    {
        return _deleteReservation(reservationCode)
        .then((data) => {
                return data; // Pass the data to the caller
            });
    }
};


// Attach to window
window.App = App;