import React from "react";
import {
  NativeModules,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableNativeFeedback,
  View
} from "react-native";
import { AMapSearch } from '@zero-knight/react-native-amap3d';
// const { AMapSearch, AMapOffline } = NativeModules;
// const { AMapOffline } = NativeModules;

const style = StyleSheet.create({
  scrollView: {
    ...Platform.select({
      android: {
        backgroundColor: "#f5f5f5"
      }
    })
  },
  container: {
    paddingBottom: 15
  },
  group: {
    marginTop: 15
  },
  item: {
    padding: 15,
    backgroundColor: "#fff"
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#eee"
  },
  itemText: {
    fontSize: 16,
    color: "#424242"
  }
});

let Touchable = TouchableHighlight;
if (Platform.OS === "android") {
  Touchable = TouchableNativeFeedback;
}

export default ({ navigation }) => {
  // alert(typeof AMapSearch.requestPOIByKeyWords);
  console.log(AMapSearch.searchPOIKeyWords('北京', '北京', '城市', true, (err, ret) => {
    if (err) {
      alert('receive error:' + err.message);
    }
    alert('receive content ' + JSON.stringify(ret));
  }));
  const renderItem = name => (
    <Touchable onPress={() => navigation.navigate(name)}>
      <View style={style.item}>
        <Text style={style.itemText}>{name}</Text>
      </View>
    </Touchable>
  );

  return (
    <ScrollView style={style.scrollView} contentContainerStyle={style.container}>
      <View style={style.group}>
        {renderItem("地图模式")}
        <View style={style.separator} />
        {renderItem("基本图层")}
        <View style={style.separator} />
        {renderItem("室内地图")}
        <View style={style.separator} />
        {renderItem("地图控件")}
        <View style={style.separator} />
        {renderItem("手势交互")}
        <View style={style.separator} />
        {renderItem("动画移动")}
        <View style={style.separator} />
        {renderItem("地图事件")}
        <View style={style.separator} />
        {renderItem("地图搜索")}
      </View>
      <View style={style.group}>
        {renderItem("添加标记")}
        <View style={style.separator} />
        {renderItem("绘制折线")}
        <View style={style.separator} />
        {renderItem("绘制多边形")}
        <View style={style.separator} />
        {renderItem("绘制圆形")}
        <View style={style.separator} />
        {renderItem("热力图")}
        <View style={style.separator} />
        {renderItem("海量点")}
      </View>
    </ScrollView>
  );
};
