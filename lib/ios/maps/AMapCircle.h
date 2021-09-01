#import <MAMapKit/MAMapKit.h>
#import "AMapOverlay.h"

#pragma ide diagnostic ignored "OCUnusedPropertyInspection"

@interface AMapCircle : AMapOverlay
/// test

@property(nonatomic, readonly) CLLocationCoordinate2D coordinate;
@property(nonatomic, readonly) MAMapRect boundingMapRect;

@end
