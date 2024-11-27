import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getDatabase, ref, set, push, get, onValue, update, remove } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";




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

////////
const formatDate = (date) => {
    const time = new Intl.DateTimeFormat('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(date);

    const dateOnly = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(date);

    return `${time} ${dateOnly}`;
};
////////////



function log(obj)
{
    console.log(obj);
}


function _addOrUpdateReservation(reservationCode, fullName, totalPax, reservedate, reservetime, telno) {

    log(reservedate);
    const dbRef = ref(database, 'reservations/' + reservedate + "/" + reservationCode);

    let dateNow = formatDate(new Date())
    //console.log(dateNow)

    return set(dbRef, {
        fullName: fullName,
        totalPax: totalPax,
        reservedate: reservedate,
        reservetime: reservetime,
        lastupdate: dateNow,
        tableno: "",
        reservationCode: reservationCode,
        telno: telno
    })
        .then(() => {
            return "OK"
        })
        .catch((error) => {
            return error;
        });

}



function _getCountByDateOnly(reservedate)
{
    const dbRef = ref(database, 'reservations/' + reservedate)

    return get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const count = Object.keys(data).length; // Count the keys
                return count;
            } else {
                console.log("No data available");
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}

function isBlank(val) {
    if (val != undefined && String(val).trim().length != 0)
        return false;
    return true;
}

function _getCountByDate(reservedate)
{
    const dbRef = ref(database, 'reservations/' + reservedate)

            return get(dbRef)
                .then((snapshot) => {
                    if (snapshot.exists()) 
                    {

                        let countHM = new Map()

                        const data = snapshot.val();

                      //  log(data)

                        for (const [obj] of Object.entries(data))
                        {
                            let reserveTime = data[obj].reservetime;

                            let totalPaxDB = data[obj].totalPax;

                            let countTotalPax = countHM.get(reserveTime);

                            if(isBlank(countTotalPax) == true)
                            {
                                countTotalPax = totalPaxDB;

                                countHM.set(reserveTime, parseInt(countTotalPax));
                               
                            }
                            else
                            {
                                countTotalPax = countTotalPax + parseInt(totalPaxDB);
                                countHM.set(reserveTime, countTotalPax);
                            }
                            
                        }

                        let jsonArray = [];

                        for (const [key, value] of countHM.entries()) 
                        {
                            let jsonObject = new Object();
                            jsonObject.time = key;
                            jsonObject.pax = value;
                            jsonArray.push(jsonObject);
                           // console.log(`Key: ${key}, Value: ${value}`);
                        }

                        return JSON.stringify(jsonArray);
                    } else {
                        //console.log("");
                        return "";
                    }
                })
                .catch((error) => {
                    console.error("Error fetching data:", error);
                });
}

function _getByDateAndTime(reservedate, reservetimeInput)
{
    const dbRef = ref(database, 'reservations/' + reservedate)

    return get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) 
            {

                const data = snapshot.val();

              //  log(data)

                let jsonArray = [];

                for (const [obj] of Object.entries(data))
                {
                    let reserveTime = data[obj].reservetime;

                    if(reservetimeInput == reserveTime)
                    {
                        let eachObject = data[obj];

                        jsonArray.push(eachObject);
                    }
                }


                return JSON.stringify(jsonArray);
            } else {
                //console.log("");
                return "";
            }
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
        });
}


function _getReservation(reservationCode) 
{
    log(reservationCode);

    let parts = reservationCode.split("-")
    let dateReserved = (parts[2])

    const year = dateReserved.slice(0, 4); // Extract the year (YYYY)
    const month = dateReserved.slice(4, 6); // Extract the month (MM)
    const day = dateReserved.slice(6, 8); // Extract the day (DD)

    dateReserved = `${year}-${month}-${day}`;

    log(dateReserved)

    const dbRef = ref(database, 'reservations' + '/' + dateReserved + '/' + reservationCode);

    return get(dbRef)
        .then((snapshot) => {
            if (snapshot.exists()) {

               // const data = snapshot.val();
                return snapshot.val(); // Resolve with the data
            } else {
                return ""
            }
        })  
        .catch((error) => {
            return error; // Forward the error
        });

        //

        // return get(dbRef)
        // .then((snapshot) => {
        //     if (snapshot.exists()) 
        //     {
        //         const records = snapshot.val();
        //         log(records)
        //     }


        //     } else {
        //         return ""
        //     }
        // })
        // .catch((error) => {
        //     return error; // Forward the error
        // });

    // try {
    //     return get(recordsRef);
    //     if (snapshot.exists()) {
    //         const records = snapshot.val();
    //         for (const date in records) {
    //             if (records[date][id]) {
    //                 console.log(`Found ID ${id} under date ${date}:`, records[date][id]);
    //                 return records[date][id];
    //             }
    //         }
    //         console.log(`ID ${id} not found.`);
    //     } else {
    //         console.log("No records found.");
    //     }
    // } catch (error) {
    //     console.error("Error fetching data:", error);
    // }
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

function _deleteReservation(reservationCode) 
{
    if(isBlank(reservationCode) == false)
    {
        let parts = reservationCode.split("-")
        let dateReserved = (parts[2])

        const year = dateReserved.slice(0, 4); // Extract the year (YYYY)
        const month = dateReserved.slice(4, 6); // Extract the month (MM)
        const day = dateReserved.slice(6, 8); // Extract the day (DD)

        dateReserved = `${year}-${month}-${day}`;

        //log(dateReserved)

        const dbRef = ref(database, 'reservations' + '/' + dateReserved + '/' + reservationCode);

       // const dbRef = ref(database, 'reservations/' + reservationCode);

       // log(reservationCode);

        return remove(dbRef)
            .then(() => {
                return "OK"
            })
            .catch((error) => {
                return error; // Forward the error
            });
    }
    else
    {
        return new Promise((resolve, reject) => 
        {
            resolve("OK");
        });
    }

}


// const App = {
//     addEditReservation: (reservationCode, fullName, totalPax, reservedate, reservetime) => {
//         return _addOrUpdateReservation(reservationCode, fullName, totalPax, reservedate, reservetime)
//             .then((data) => {
//                 return data; // Pass the data to the caller
//             });
//     },
//     getReservation: (reservationCode) => {

//         return _getReservation(reservationCode)
//             .then((data) => {
//                 return data; // Pass the data to the caller
//             });
//     },
//     updateTableNo: (reservationCode, tableNo) => {
//         return _updateTableNo(reservationCode, tableNo)
//             .then((data) => {
//                 return data; // Pass the data to the caller
//             });
//     },
//     deleteReservation: (reservationCode) => {
//         return _deleteReservation(reservationCode)
//             .then((data) => {
//                 return data; // Pass the data to the caller
//             });
//     }
// };


const App = {
    async addEditReservation(reservationCode, fullName, totalPax, reservedate, reservetime, telno)
    {

        return _addOrUpdateReservation(reservationCode, fullName, totalPax, reservedate, reservetime, telno)
            .then((data) => {
                return data; // Pass the data to the caller
            });
    },
    async getReservation(reservationCode) {

        return _getReservation(reservationCode)
            .then((data) => {
                return data; // Pass the data to the caller
            });
    },
    async updateTableNo(reservationCode, tableNo) {
        return _updateTableNo(reservationCode, tableNo)
            .then((data) => {
                return data; // Pass the data to the caller
            });
    },
    async deleteReservation(reservationCode) {
        return _deleteReservation(reservationCode)
            .then((data) => {
                return data; // Pass the data to the caller
            });
    },
    async getCountByDate(reservedate) {
        return _getCountByDate(reservedate)
            .then((data) => {
                return data; // Pass the data to the caller
            });
    },
    async getByDateAndTime(reservedate, reservetime) {
        return _getByDateAndTime(reservedate, reservetime)
            .then((data) => {
                return data; // Pass the data to the caller
            });
    },
};

// Attach to window
window.MyController = App
// window.App = App;