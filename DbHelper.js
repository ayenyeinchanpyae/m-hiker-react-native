// // DatabaseHelper.js

// import SQLite from 'react-native-sqlite-storage';

// SQLite.DEBUG(true);
// SQLite.enablePromise(true);

// const databaseName = 'hikedb';
// const databaseVersion = '1.0';
// const databaseDisplayName = 'My Hike Database';
// const databaseSize = 200000;

// const db = SQLite.openDatabase(
//   {name: databaseName, createFromLocation: 1},
//   () => {},
//   error => {
//     console.log('Error opening database: ', error);
//   },
// );

// const DatabaseHelper = {
//   initDatabase: () => {
//     db.transaction(tx => {
//       tx.executeSql(
//         'CREATE TABLE IF NOT EXISTS HikeTable (id INTEGER PRIMARY KEY AUTOINCREMENT, hikeName TEXT, hikeLocation TEXT, hikeDate TEXT, parkingAvailable TEXT, description TEXT, hikeLength INTEGER, difficultyLevel TEXT, trailCondition TEXT, recommendedGears TEXT);',
//       );
//     });
//   },

//   insertData: (
//     hikeName,
//     hikeLocation,
//     hikeDate,
//     parkingAvailable,
//     description,
//     hikeLength,
//     difficultyLevel,
//     trailCondition,
//     recommendedGears,
//   ) => {
//     return new Promise((resolve, reject) => {
//       db.transaction(tx => {
//         tx.executeSql(
//           'INSERT INTO HikeTable (hikeName, hikeLocation, hikeDate, parkingAvailable, description, hikeLength, difficultyLevel, trailCondition, recommendedGears) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);',
//           [
//             hikeName,
//             hikeLocation,
//             hikeDate,
//             parkingAvailable,
//             description,
//             hikeLength,
//             difficultyLevel,
//             trailCondition,
//             recommendedGears,
//           ],
//           (_, {insertId}) => {
//             resolve(insertId);
//           },
//           (_, error) => {
//             reject(error);
//           },
//         );
//       });
//     });
//   },
// };

// export default DatabaseHelper;
