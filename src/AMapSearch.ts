import { NativeModules, NativeEventEmitter } from "react-native";

const { AMapSearch: AMapSearchNative } = NativeModules;

export enum SORT_RULE {
  ALL = 0,
  DISTANCE = 1
};

export type POIPosition = {
  latitude: number,
  longitude: number
};

export type POI = {
  // POI的ID
  uid: string,
  // 名称
  name: string,
  // 类型
  type: string,
  // 地址
  address: string,
  // 商铺ID
  shopID: string,
  // 省
  province: string,
  // 省编码
  pcode: string,
  // 城市
  city: string,
  // 城市编码
  citycode: string,
  // 区域名称
  district: string,
  // 区域编码
  adcode: string,
  // 经纬度
  location: POIPosition,
}

export type POIList = Array<POI>;

function promisify<T>(fn: Function) {
  return (...args) => new Promise<T>((resolve, reject) => {
      const callback = function(err: Error, ret: T) {
        if (err) {
          reject(err);
          return;
        }

        resolve(ret);
      }
    
      fn(...args, callback);
  });
};

const requestPOIByKeyWordsPromise = promisify<POIList>(AMapSearchNative.requestPOIByKeyWords);
const requestPOIAroundPromise = promisify<POIList>(AMapSearchNative.requestPOIAround);

const AMapSearch = {
  /**
   * 根据关键字查找POI列表
   * @param keyword 关键字
   * @param city 城市名
   * @param types 类型
   * @param reqExt 是否返回扩展信息，默认为 NO。
   * @returns 
   */
  searchPOIKeyWords(
    keyword: String, city: String, types: String, reqExt: boolean
  ): Promise<POIList> {
    return requestPOIByKeyWordsPromise(keyword, city, types, reqExt);
  },

  /**
   * 
   * @param lat 经纬度
   * @param lon 经纬度
   * @param keywords 关键字
   * @param types 类型
   * @param radius 范围(单位: 米)
   * @param sortRule 排序规则
   * @param reqExt 是否返回扩展信息，默认为 NO。
   * @returns 
   */
  searchAround(
    lat: number, lon: number, keywords: string, types: string, radius: number, sortRule: SORT_RULE, reqExt :boolean
  ): Promise<POIList> {
    return requestPOIAroundPromise(lat, lon, keywords, types, radius, sortRule, reqExt);
  }
}

export default AMapSearch;