import React from 'react';
import {
  ListView
} from 'react-native';
import CategoryCell from './CategoryCell';
import { cardData } from '../constants';

class Categories extends React.Component {

  static navigationOptions = {
    title: 'All Subjects',
  };

  constructor() {
    super();
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      dataSource: ds.cloneWithRows(cardData),
    };
  }

  render() {
    return (
      <ListView
	        dataSource={this.state.dataSource}
	        renderRow={(rowData) => <CategoryCell data={rowData} navigation={this.props.navigation} />
    }
    />
  );
}
}

export default Categories;
