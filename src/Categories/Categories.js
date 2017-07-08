import React from 'react';
import {
  ListView
} from 'react-native';
import CategoryCell from './CategoryCell';

class Categories extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.cardData.title
  });

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      dataSource: ds.cloneWithRows(props.navigation.state.params.cardData),
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
