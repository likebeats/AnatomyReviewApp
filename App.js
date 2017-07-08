import React from 'react';
import {
  AppRegistry,
  Text,
  ListView
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import SimpleCell from './src/Views/SimpleCell';
import Categories from './src/Categories/Categories';
import CardDetails from './src/CardDetails/CardDetails';

import { cardData as lab01 } from './src/Data/lab01';
import { cardData as lab02 } from './src/Data/lab02';
import { cardData as lab03 } from './src/Data/lab03';

class HomeScreen extends React.Component {
  
  static navigationOptions = {
    title: 'Anatomy Review IUSD',
  };

  constructor() {
    super();
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    
    var listViewData = [
      { text: 'Lab 1 - Superfical Back', screen: 'Categories', data: lab01 },
      { text: 'Lab 2 - Deep Back and Spinal Cord', screen: 'Categories', data: lab02 },
      { text: 'Lab 3 - Lateral Cervical Region', screen: 'Categories', data: lab03 },
      { text: 'Additional labs being added throughout the course via updates!', screen: '' }
    ];

    this.state = {
      dataSource: ds.cloneWithRows(listViewData),
    };
  }

  render() {

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <SimpleCell rowData={rowData} navigation={this.props.navigation} /> }
      />
    );
  }
}

const SimpleApp = StackNavigator({
  Home: { screen: HomeScreen },
  Categories: { screen: Categories },
  CardDetails: { screen: CardDetails }
});

export default class App extends React.Component {
  render() {
    return (
      <SimpleApp />
    );
  }
}
