import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Button } from '../components/Button';
import { PlantProps, savePlant, loadPlant } from '../libs/storage';

import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { SvgUri } from 'react-native-svg';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useRoute } from '@react-navigation/core';

import { isBefore, format } from 'date-fns';

import waterdrop from '../assets/waterdrop.png'
import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface Params {
  plant: PlantProps;
}

export function PlantSave() {
  const [selectedDateTimePicker, setSelectedDateTimePicker] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');

  const route = useRoute();
  const { plant } = route.params as Params;

  function handleChangeTime(event: Event, dateTime: Date | undefined) {
    if (Platform.OS === 'android') {
      setShowDatePicker(oldState => !oldState);
    }

    if (dateTime && isBefore(dateTime, new Date())) {
      setSelectedDateTimePicker(new Date());
      return Alert.alert('Escolha uma hora no futuro! ⏰');
    }

    if (dateTime) setSelectedDateTimePicker(dateTime);
  }

  function handleOpenDateTimePickerForAndroid() {
    setShowDatePicker(oldState => !oldState);
  }

  async function handlePlantSave() {
    try {
      await savePlant({
        ...plant,
        dateTimeNotification: selectedDateTimePicker
      });

    } catch (error) {
      Alert.alert('Não foi possível salvar. 😢');
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.plantInfo}>
        <SvgUri
          uri={plant.photo}
          height={150}
          width={150}
        />

        <Text style={styles.plantName}>
          {plant.name}
        </Text>
        <Text style={styles.plantAbout}>
          {plant.about}
        </Text>
      </View>

      <View style={styles.controller}>
        <View style={styles.tipContainer}>
          <Image source={waterdrop} style={styles.tipImage} />

          <Text style={styles.tipText}>
            {plant.water_tips}
          </Text>
        </View>

        <Text style={styles.alertLabel}>
          Escolha o melhor horário para ser lembrado:
        </Text>

        { showDatePicker && (
          <DateTimePicker
            value={selectedDateTimePicker}
            mode="time"
            display="spinner"
            onChange={handleChangeTime}
          />
        )}

        {
          Platform.OS === 'android' && (
            <TouchableOpacity style={styles.dateTimePickerTextButton} onPress={handleOpenDateTimePickerForAndroid}>
              <Text style={styles.dateTimePickerText}>
                {`Mudar ${format(selectedDateTimePicker, 'HH:mm')}`}
              </Text>
            </TouchableOpacity>
          )
        }

        <Button
          title="Cadastrar Planta"
          onPress={handlePlantSave}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.shape,
  },

  plantInfo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
    backgroundColor: colors.shape,
  },

  plantName: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.heading,
    marginTop: 15,
  },

  plantAbout: {
    textAlign: 'center',
    fontFamily: fonts.text,
    color: colors.heading,
    fontSize: 17,
    marginTop: 10,
  },

  controller: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: getBottomSpace() || 20,
  },

  tipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.blue_light,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
    bottom: 60,
  },

  tipImage: {
    width: 56,
    height: 56,
  },

  tipText: {
    flex: 1,
    marginLeft: 20,
    fontFamily: fonts.text,
    color: colors.blue,
    fontSize: 17,
    textAlign: 'justify',
  },

  alertLabel: {
    textAlign: 'center',
    fontFamily: fonts.complement,
    color: colors.heading,
    fontSize: 12,
    marginBottom: 5,
  },

  dateTimePickerTextButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40,
  },

  dateTimePickerText: {
    color: colors.heading,
    fontSize: 24,
    fontFamily: fonts.text,
  },
});
