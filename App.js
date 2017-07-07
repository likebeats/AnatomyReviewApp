import React from 'react';
import {
  AppRegistry,
  Text,
  ListView
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import SimpleCell from './src/Views/SimpleCell';
import Categories from './src/Categories/Categories';
import TaggedCards from './src/TaggedCards/TaggedCards';
import CardDetails from './src/CardDetails/CardDetails';

class HomeScreen extends React.Component {
  
  static navigationOptions = {
    title: 'Anatomy Review IUSD',
  };

  constructor() {
    super();
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    var listViewData = [
      { text: 'View All', screen: 'Categories' },
      { text: 'View Tagged', screen: 'TaggedCards' }
    ];

    this.state = {
      dataSource: ds.cloneWithRows(listViewData),
    };
  }

  render() {
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <SimpleCell data={rowData} navigation={this.props.navigation} /> }
      />
    );
  }
}

const SimpleApp = StackNavigator({
  Home: { screen: HomeScreen },
  Categories: { screen: Categories },
  TaggedCards: { screen: TaggedCards },
  CardDetails: { screen: CardDetails }
});

export default class App extends React.Component {
  render() {
    return (
      <SimpleApp />
    );
  }
}
