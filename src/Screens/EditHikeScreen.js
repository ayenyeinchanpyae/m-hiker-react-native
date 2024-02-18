import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Provider as PaperProvider, useTheme} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {openDatabase} from 'react-native-sqlite-storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import {CheckBox} from 'react-native-elements';

let db = openDatabase({name: 'HikeDb.db'});

const EditHikeScreen = () => {
  const {params} = useRoute();
  const hikeId = params?.hikeId;
  const theme = useTheme();
  const navigation = useNavigation();

  const [hikeName, setHikeName] = useState(params.data.hikeName);
  const [hikeLocation, setHikeLocation] = useState(params.data.hikeLocation);
  const [hikeDate, setHikeDate] = useState(new Date());
  const [parkingAvailable, setParkingAvailable] = useState(
    params.data.parkingAvailable == '1' ? true : false,
  );
  const [description, setDescription] = useState(params.data.description);
  const [hikeLength, setHikeLength] = useState(
    params.data.hikeLength.toString(),
  );
  const [difficultyLevel, setDifficultyLevel] = useState(
    params.data.difficultyLevel,
  );
  const [trailCondition, setTrailCondition] = useState(
    params.data.trailCondition,
  );
  const [recommendedGears, setRecommendedGears] = useState(
    params.data.recommendedGears,
  );
  const [show, setShow] = useState(false);
  const [isChecked, setChecked] = useState(
    params.data.parkingAvailable == '1' ? true : false,
  );
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  console.log('route', params.data.description);
  const updateHike = updateItem => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE hike_info set hikeName=?, hikeLocation=? , hikeDate=?, parkingAvailable=?, hikeLength=?, difficultyLevel=?, trailCondition=?, recommendedGears=?  where hike_id=?',
        [
          updateItem.hikeName,
          updateItem.hikeLocation,
          updateItem.hikeDate,
          updateItem.parkingAvailable,
          updateItem.hikeLength,
          updateItem.difficultyLevel,
          updateItem.trailCondition,
          updateItem.recommendedGears,
          params.data.hikeId,
        ],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Hike updated successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('Home'),
                },
              ],
              {cancelable: false},
            );
          } else {
            console.log('error', results);
            alert('Updation Failed');
          }
        },
      );
    });
  };
  const handleSubmit = () => {
    const updateItem = {
      hikeName,
      hikeLocation,
      hikeDate,
      parkingAvailable,
      description,
      hikeLength,
      difficultyLevel,
      trailCondition,
      recommendedGears,
    };
    console.log('form data', updateItem);
    updateHike(updateItem);

    // db.transaction(function (tx) {
    //   tx.executeSql(
    //     'INSERT INTO table_hike_data (hikeName, hikeLocation, hikeDate, parkingAvailable,hikeLength,difficultyLevel,trailCondition,recommendedGears) VALUES (?,?,?,?,?,?,?,?)',
    //     [
    //       hikeName,
    //       hikeLocation,
    //       hikeDate,
    //       parkingAvailable,
    //       hikeLength,
    //       difficultyLevel,
    //       trailCondition,
    //       recommendedGears,
    //     ],
    //     (tx, results) => {
    //       console.log('Results', results.rowsAffected);
    //       if (results.rowsAffected > 0) {
    //         Alert.alert(
    //           'Success',
    //           'You are added hike data Successfully',
    //           [
    //             {
    //               text: 'Ok',
    //               onPress: () => navigation.navigate('Home'),
    //             },
    //           ],
    //           {cancelable: false},
    //         );
    //       } else {
    //         alert('Add Failed');
    //       }
    //     },
    //     error => {
    //       console.log(error);
    //     },
    //   );
    // });
  };
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || hikeDate;
    setShow(Platform.OS === 'ios');
    setHikeDate(currentDate);
  };
  const showDatePicker = () => {
    setShow(true);
  };
  useEffect(() => {
    // db.transaction(txn => {
    //   txn.executeSql(
    //     "SELECT hikeName FROM sqlite_master WHERE type='table' AND name='table_hike_data'",
    //     [],
    //     (tx, res) => {
    //       console.log('item:', res.rows.length);
    //       if (res.rows.length == 0) {
    //         txn.executeSql('DROP TABLE IF EXISTS table_hike_data', []);
    //         txn.executeSql(
    //           `
    //         CREATE TABLE IF NOT EXISTS table_hike_data (
    //             hike_id INTEGER PRIMARY KEY AUTOINCREMENT,
    //             hikeName TEXT,
    //             hikeLocation TEXT,
    //             hikeDate TEXT,
    //             parkingAvailable TEXT,
    //             hikeLength INTEGER,
    //             difficultyLevel TEXT,
    //             trailCondition TEXT,
    //             recommendedGears TEXT
    //         );
    //         `,
    //           [],
    //         );
    //       }
    //     },
    //     error => {
    //       console.log(error);
    //     },
    //   );
    // });
  }, []);
  const handleCheckboxToggle = () => {
    setChecked(!isChecked);
    setParkingAvailable(!isChecked);
  };
  return (
    <ScrollView>
      <PaperProvider theme={theme}>
        <View style={styles.container}>
          <View style={styles.form}>
            <Text style={styles.label}>Hike Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter hike name"
              value={hikeName}
              onChangeText={setHikeName}
            />
            <Text style={styles.label}>Hike Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter hike location"
              value={hikeLocation}
              onChangeText={setHikeLocation}
            />
            <Text style={styles.label}>Hike Date</Text>
            <View style={{padding: 20}}>
              <Button onPress={showDatePicker} mode="contained">
                Choose Date
              </Button>
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={hikeDate}
                  mode="date"
                  is24Hour={true}
                  display="default"
                  onChange={onChange}
                />
              )}
            </View>

            <View>
              <Text>Parking Available</Text>
              <CheckBox checked={isChecked} onPress={handleCheckboxToggle} />
            </View>
            <View>
              <Text style={styles.label}>Hike Length</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter hike Length"
                value={hikeLength}
                onChangeText={setHikeLength}
              />
            </View>
            {/* <View>
              <Text>Select an option:</Text>
              <Dropdown
                label="Select"
                data={data}
                value={difficultyLevel}
                onChange={diff => setDifficultyLevel(diff)}
              />
            </View> */}

            <View>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Description"
                value={description}
                onChangeText={setDescription}
              />
            </View>
            <View>
              <Text style={styles.label}>Trail Conditions</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Trail Conditions"
                value={trailCondition}
                onChangeText={setTrailCondition}
              />
            </View>
            <Text style={styles.label}>Recommended Gears</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Recommended Gears"
              value={recommendedGears}
              onChangeText={setRecommendedGears}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSubmit()}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </PaperProvider>
    </ScrollView>
  );
};

export default EditHikeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 20,
  },
  form: {
    width: '80%',
  },
  label: {
    marginTop: 20,
    marginBottom: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#164863',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  avatarContainer: {
    marginTop: 10,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
