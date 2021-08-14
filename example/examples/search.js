import React, { Component } from "react";
import { PermissionsAndroid, StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from "react-native";
import { MapView, AMapSearch, SORT_RULE } from "@zero-knight/react-native-amap3d";
import commonStyle from '../styles';

console.log('SORT_RULE', SORT_RULE);

const styles = {
  controls: {
    position: 'absolute',
    width: '100%',
    top: '1%'
  },
  tipPanel: {
    position: 'absolute',
    width: '100%',
    bottom: '10%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  panel: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    width: '70%',
    height: 22,
    fontSize: 22,
    backgroundColor: '#fff'
  },
  searchBtn: {
    height: 20,
    marginLeft: '3%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00f'
  },
  searchBtnTxt: {
    color: '#fff'
  },
  resultList: {
    backgroundColor: '#fff',
    width: '100%',
    height: 200
  }
}

export default class ControlsExample extends Component {
  static navigationOptions = {
    title: "地图搜索"
  };

  state = {
    searchTxt: null,
    searchResults: null,
    center: null,
    region: null
  };

  componentDidMount() {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
  }

  onChangeSearchText = (txt) => {
    this.setState({
      searchTxt: txt
    });
  }

  onStatusChangeComplete = (data) => {
    console.log('status change:' + data);
    const { center, region } = data;
    this.setState({
      center: Object.assign({}, center),
      region: Object.assign({}, region)
    });
  }

  pressSearch = () => {
    const { searchTxt } = this.state;
    const ret = AMapSearch.searchPOIKeyWords(searchTxt, '上海', '体育休闲服务', true);
    ret.then((poiList) => {
      this.setState({
        searchResults: poiList
      });
    }, (err) => {
      alert('search failed:' + err.message);
    });
  }

  clearSearch = () => {
    this.setState({
      searchResults: null
    });
  }

  pressSearchAround = () => {
    const { center } = this.state;
    if (center) {
      const { latitude, longitude } = center;
      const ret = AMapSearch.searchAround(
        latitude, longitude, '密室', '体育休闲服务', 1500, 1, true
      );
      ret.then((poiList) => {
        this.setState({
          searchResults: poiList
        });
      });
    }
  }

  renderPOIItem({ item }) {
    return <View><Text>{item.name}</Text></View>
  }

  renderResultPanel() {
    const { searchResults } = this.state;
    if (!searchResults) {
      return null;
    }

    return <FlatList style={styles.resultList} data={searchResults} renderItem={this.renderPOIItem} />
  }

  render() {
    return (
      <View style={StyleSheet.absoluteFill}>
        <MapView
          showsCompass={false}
          style={commonStyle.map}
          onStatusChangeComplete={this.onStatusChangeComplete}
        />
        <View style={styles.controls}>
          <View style={styles.panel}>
            <TextInput style={styles.textInput} onChangeText={this.onChangeSearchText}></TextInput>
            <TouchableOpacity style={styles.searchBtn} onPress={this.pressSearch}><Text style={styles.searchBtnTxt}>搜索</Text></TouchableOpacity>
            <TouchableOpacity style={styles.searchBtn} onPress={this.clearSearch}><Text style={styles.searchBtnTxt}>清空</Text></TouchableOpacity>
          </View>
          {this.renderResultPanel()}
        </View>

        <View style={styles.tipPanel}>
          <TouchableOpacity style={styles.searchBtn} onPress={this.pressSearchAround}><Text style={styles.searchBtnTxt}>搜索附近</Text></TouchableOpacity>
        </View>
      </View>
    );
  }
}
