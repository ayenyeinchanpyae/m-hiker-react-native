import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {openDatabase} from 'react-native-sqlite-storage';

let db = openDatabase({name: 'HikeDb.db'});

const HikeListScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  const [hikeData, setHikeData] = useState([]);

  useEffect(() => {
    getData();
  }, [isFocused]);
  const getData = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM hike_info', [], (tx, results) => {
        var temp = [];
        for (let i = 0; i < results.rows.length; ++i) {
          temp.push(results.rows.item(i));
        }
        setHikeData(temp);
      });
    });
  };

  const handleDeleteAllPress = () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete all hike data?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Confirm', onPress: () => deleteAllData()},
      ],
      {cancelable: false},
    );
  };
  //   let deleteUser = id => {
  //     db.transaction(tx => {
  //       tx.executeSql(
  //         'DELETE FROM  table_user where user_id=?',
  //         [id],
  //         (tx, results) => {
  //           console.log('Results', results.rowsAffected);
  //           if (results.rowsAffected > 0) {
  //             Alert.alert(
  //               'Success',
  //               'User deleted successfully',
  //               [
  //                 {
  //                   text: 'Ok',
  //                   onPress: () => {
  //                     getData();
  //                   },
  //                 },
  //               ],
  //               {cancelable: false},
  //             );
  //           } else {
  //             alert('Please insert a valid User Id');
  //           }
  //         },
  //       );
  //     });
  //   };
  const handleDeletePress = hikeId => {
    console.log('delete');
    // Show confirmation popup
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Confirm', onPress: () => deleteHike(hikeId)},
      ],
      {cancelable: false},
    );
  };

  const handleEditPress = hikeItem => {
    console.log('edit', hikeItem);
    navigation.navigate('EditHikeScreen', {
      data: {
        hikeId: hikeItem.hike_id,
        hikeName: hikeItem.hikeName,
        hikeLocation: hikeItem.hikeLocation,
        hikeDate: hikeItem.hikeDate,
        parkingAvailable: hikeItem.parkingAvailable,
        description: hikeItem.description,
        hikeLength: hikeItem.hikeLength,
        difficultyLevel: hikeItem.difficultyLevel,
        trailCondition: hikeItem.trailCondition,
        recommendedGears: hikeItem.recommendedGears,
      },
    });
    //navigation.navigate('EditHikeScreen', {hikeId});
  };

  let deleteHike = id => {
    console.log('deleting', id);
    db.transaction(tx => {
      tx.executeSql(
        'DELETE FROM hike_info where hike_id=?',
        [id],
        (tx, results) => {
          console.log('Results', results.rowsAffected);
          if (results.rowsAffected > 0) {
            Alert.alert(
              'Success',
              'Hike deleted successfully',
              [
                {
                  text: 'Ok',
                  onPress: () => {
                    getData();
                  },
                },
              ],
              {cancelable: false},
            );
          } else {
            alert('There is an error');
          }
        },
      );
    });
  };
  let deleteAllData = () => {
    console.log('deleting all data');
    db.transaction(tx => {
      tx.executeSql('DELETE FROM hike_info', [], (tx, results) => {
        console.log('Results', results.rowsAffected);
        if (results.rowsAffected > 0) {
          Alert.alert(
            'Success',
            'All data deleted successfully',
            [
              {
                text: 'Ok',
                onPress: () => {
                  getData(); // Assuming this function is used to refresh data after deletion
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          alert('There is an error');
        }
      });
    });
  };

  const renderHike = ({item}) => (
    <View style={[styles.card]}>
      <Text style={[styles.title, {color: item.titleColor}]}>
        {item.hikeName}
      </Text>
      <Text style={[styles.title, {color: item.titleColor}]}>
        {item.hikeLocation}
      </Text>
      <View style={styles.cardDates}>
        <Text style={styles.cardDate}>{item.hikeDate}</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.editActionButton}
            onPress={() => handleEditPress(item)}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteActionButton}
            onPress={() => handleDeletePress(item.hike_id)}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  //console.log('hikeData', hikeData);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.deleteAllActionButton}
        onPress={() => handleDeleteAllPress()}>
        <Text style={styles.deleteButtonText}>Delete All</Text>
      </TouchableOpacity>
      <FlatList
        contentContainerStyle={styles.listContainer}
        data={hikeData}
        renderItem={renderHike}
        keyExtractor={item => item.hike_id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
    backgroundColor: '#EEF5FF',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#A9A9A9',
    margin: 10,
    paddingHorizontal: 20,
  },
  card: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingVertical: 5,
  },
  cardDates: {
    flexDirection: 'row',
    paddingVertical: 5,
  },
  cardDate: {
    color: '#888',
  },
  cardContent: {
    justifyContent: 'flex-end',
    paddingTop: 10,
  },
  attendeesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  attendeeImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: -10,
    borderWidth: 0.5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteAllActionButton: {
    width: 100,
    margin: 15,
    backgroundColor: '#B06161',
    color: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  editActionButton: {
    marginTop: 15,
    backgroundColor: '#DCDCDC',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteActionButton: {
    marginTop: 15,
    backgroundColor: '#B06161',
    color: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButtonText: {
    color: '#ffffff',
  },
  editButtonText: {
    color: '#265073',
  },
});

export default HikeListScreen;
