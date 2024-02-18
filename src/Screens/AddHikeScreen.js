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
import {useNavigation} from '@react-navigation/native';
import {CheckBox} from 'react-native-elements';
import ModalSelector from 'react-native-modal-selector';

let db = openDatabase({name: 'HikeDb.db'});

const AddHikeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [hikeName, setHikeName] = useState('');
  const [hikeLocation, setHikeLocation] = useState('');
  const [hikeDate, setHikeDate] = useState(new Date());
  const [parkingAvailable, setParkingAvailable] = useState(false);
  const [description, setDescription] = useState('');
  const [hikeLength, setHikeLength] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('');
  const [trailCondition, setTrailCondition] = useState('');
  const [recommendedGears, setRecommendedGears] = useState('');
  const [show, setShow] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const difficultyOptions = [
    {key: 0, label: 'Select Difficulty Level', value: ''},
    {key: 1, label: 'Easy', value: 'Easy'},
    {key: 2, label: 'Intermediate', value: 'Intermediate'},
    {key: 3, label: 'Difficult', value: 'Difficult'},
  ];
  const handleSubmit = () => {
    if (
      !hikeName ||
      !hikeLocation ||
      !hikeDate ||
      !hikeLength ||
      !selectedDifficulty
    ) {
      console.log('form data', {
        hikeName,
        hikeLocation,
        hikeDate,
        parkingAvailable,
        description,
        hikeLength,
        selectedDifficulty,
        trailCondition,
        recommendedGears,
      });
      // Display an error message or handle the validation failure appropriately
      alert('Please fill out all required fields');
      return;
    } else {
      showConfirmationPopup();
    }
  };
  let addHike = () => {
    db.transaction(function (tx) {
      tx.executeSql(
        'INSERT INTO hike_info (hikeName, hikeLocation, hikeDate, parkingAvailable, description, hikeLength,difficultyLevel,trailCondition,recommendedGears) VALUES (?,?,?,?,?,?,?,?,?)',
        [
          hikeName,
          hikeLocation,
          hikeDate,
          parkingAvailable,
          description,
          hikeLength,
          selectedDifficulty,
          trailCondition,
          recommendedGears,
        ],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'You are added hike data Successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => navigation.navigate('Home'),
                },
              ],
              {cancelable: false},
            );
          } else {
            alert('Add Failed');
          }
        },
        error => {
          console.log(error);
        },
      );
    });
  };
  const showConfirmationPopup = () => {
    Alert.alert(
      'Confirmation',
      `Are you sure you want to submit the data?\n\nHike Name: ${hikeName}\nHike Location: ${hikeLocation}\nHike Date: ${hikeDate} \n Hike length: ${hikeLength}\n Decription: ${description} \n Parking Available: ${
        parkingAvailable ? 'yes' : 'no'
      } \n Difficulty Level: ${difficultyLevel} \n Trail Conditions: ${trailCondition}\n Recommended Gear: ${recommendedGears}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => {
            resetForm();
          },
        },
        {
          text: 'Submit',
          onPress: () => {
            addHike();
          },
        },
      ],
      {cancelable: false},
    );
  };
  const resetForm = () => {
    setHikeName('');
    setHikeLength('');
    setHikeLocation('');
    setHikeDate('');
    setParkingAvailable(false);
    setDescription('');
    setDifficultyLevel('');
    setTrailCondition('');
    setRecommendedGears('');
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
    console.log('useEffect');
    db.transaction(txn => {
      txn.executeSql(
        "SELECT hikeName FROM sqlite_master WHERE type='table' AND name='hike_info';",
        [],
        (_, result) => {
          if (result.rows.length === 0) {
            // Table does not exist, proceed with creation
            console.log('Table does not exists');
            txn.executeSql(
              `
          CREATE TABLE IF NOT EXISTS hike_info (
              hike_id INTEGER PRIMARY KEY AUTOINCREMENT,
              hikeName TEXT,
              hikeLocation TEXT,
              hikeDate TEXT,
              parkingAvailable TEXT,
              description TEXT,
              hikeLength INTEGER,
              difficultyLevel TEXT,
              trailCondition TEXT,
              recommendedGears TEXT
          );
          `,
              [],
              (_, result) => {
                // The second parameter of the callback function is the result object
                if (result.rowsAffected > 0) {
                  console.log('Table created successfully');
                } else {
                  console.log('Table creation failed', result);
                }
              },
            );
          } else {
            console.log('Table already exists');
          }
        },
      );
    });
  }, []);
  console.log('date', hikeDate);
  const handleCheckboxToggle = () => {
    setChecked(!isChecked);
    setParkingAvailable(!isChecked);
  };

  const formatDate = dateValue => {
    const dateObject = new Date(dateValue);

    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const date = dateObject.getDate();
    return `${year}-${month}-${date}`;
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
            <Text style={styles.label}>Hike Date: </Text>
            <View style={{padding: 20}}>
              <Button
                style={styles.datePickerBtn}
                onPress={showDatePicker}
                mode="contained">
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
            <View>
              <Text style={styles.label}>
                Difficulty Level:
                {selectedDifficulty ? selectedDifficulty : ''}
              </Text>
              <TouchableOpacity>
                <ModalSelector
                  data={difficultyOptions}
                  initValue="Select Difficulty Level"
                  onChange={option => setSelectedDifficulty(option.label)}
                />
              </TouchableOpacity>
            </View>

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
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </PaperProvider>
    </ScrollView>
  );
};

export default AddHikeScreen;
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
  dropdownContainer: {
    height: 40,
    marginBottom: 10,
  },
  dropdownItem: {
    justifyContent: 'flex-start',
  },
  dropdownLabel: {
    fontSize: 16,
    color: '#333', // You can customize the label color
  },
  datePickerBtn: {
    backgroundColor: '#164863',
  },
});
