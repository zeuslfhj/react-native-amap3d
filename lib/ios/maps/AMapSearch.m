//
//  AMapSearch.m
//  CocoaAsyncSocket
//
//  Created by zero zhang on 2021/8/8.
//

#import <Foundation/Foundation.h>
#import <AMapSearchKit/AMapSearchKit.h>
#import "AMapSearch.h"

@implementation AMapSearch

- (instancetype) init{
    self = [super init];
    if (self) {
        self.amapSearch = [[AMapSearchAPI alloc] init];
        self.amapSearch.delegate = self;
    }
    return self;
}

// To export a module named RCTCalendarModule
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(requestPOIByKeyWords:(NSString *)keyword
                  city:(NSString *)city
                  types:(NSString *)types
                  requireExtension:(BOOL)requireExtension
                  myCallback:(RCTResponseSenderBlock)callback)
{
    AMapPOIKeywordsSearchRequest *request = [[AMapPOIKeywordsSearchRequest alloc] init];
    request.keywords = keyword;
    request.city = city;
    request.types = types;
    request.requireExtension = requireExtension;
    
    self.poiKeywordSearchCallback = callback;
    [self.amapSearch AMapPOIKeywordsSearch:request];
};

RCT_EXPORT_METHOD(requestPOIAround:(nonnull NSNumber *)lat
                  lon:(nonnull NSNumber *)lon
                  keywords:(NSString *)keywords
                  type: (NSString *)types
                  radius: (NSInteger)radius
                  sortrule:(NSInteger)sortrule
                  requireExtension:(BOOL)requireExtension
                  myCallback:(RCTResponseSenderBlock)callback)
{
    AMapPOIAroundSearchRequest *request = [[AMapPOIAroundSearchRequest alloc] init];
    request.types = types;
    request.location = [AMapGeoPoint locationWithLatitude:lat.floatValue longitude:lon.floatValue];
    request.keywords = keywords;
    request.radius = radius;
    request.sortrule = sortrule;
    request.requireExtension = requireExtension;
    self.poiKeywordSearchCallback = callback;
    [self.amapSearch AMapPOIAroundSearch:request];
}

- (NSDictionary *) convertPosition2Dictionary:(AMapGeoPoint *)location
{
    NSDictionary *point = @{
        @"latitude": @(location.latitude),
        @"longitude": @(location.longitude)
    };
    
    return point;
}

- (NSDictionary *) convertPOI2Dictionary:(AMapPOI *)poi
{
    NSMutableDictionary *obj = [[NSMutableDictionary alloc] init];
    [obj setObject:poi.uid forKey:@"uid"];
    [obj setObject:poi.name forKey:@"name"];
    [obj setObject:poi.type forKey:@"type"];
    [obj setObject:poi.address forKey:@"address"];
    [obj setObject:poi.shopID forKey:@"shopID"];
    ///省
    [obj setObject:poi.province forKey:@"province"];
    ///省编码
    [obj setObject:poi.pcode forKey:@"pcode"];
    ///城市名称
    [obj setObject:poi.city forKey:@"city"];
    ///城市编码
    [obj setObject:poi.citycode forKey:@"citycode"];
    ///区域名称
    [obj setObject:poi.district forKey:@"district"];
    ///区域编码
    [obj setObject:poi.adcode forKey:@"adcode"];
    
    NSDictionary *location = [self convertPosition2Dictionary:poi.location];
    
    [obj setObject:location forKey:@"location"];
    return obj;
}

- (void)onPOISearchDone:(AMapPOISearchBaseRequest *)request response:(AMapPOISearchResponse *)response
{
    if (self.poiKeywordSearchCallback) {
        NSInteger count = response.count;
        
        NSMutableArray *arr = [[NSMutableArray alloc] init];
        for (AMapPOI *poi in response.pois) {
            NSDictionary *poiObj = [self convertPOI2Dictionary:poi];
            [arr addObject:poiObj];
        }
        
        if (count > 0) {
            self.poiKeywordSearchCallback(@[[NSNull null], arr]);
        } else {
            self.poiKeywordSearchCallback(@[[NSNull null], @[]]);
        }
    }
}


- (void)AMapSearchRequest:(id)request didFailWithError:(NSError *)error
{
    if (self.poiKeywordSearchCallback) {
        NSLog(@"%@",[error localizedDescription]);
        self.poiKeywordSearchCallback(@[error]);
        self.poiKeywordSearchCallback = nil;
    }
}

@end
