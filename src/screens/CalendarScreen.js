import React, { Component } from 'react';
import { View } from 'react-native';
import MyCalendar from '../components/MyCalendar';

export default class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <MyCalendar />
      </View>
    );
  }
}