// attachment    1:圆柱  2:立方体
// uses(type)    1  2  3
const pointList = [

    {
      "id": "a3c0e481689511ec9cd1fa163e90e5bb",
      "code": "YSYRL083",
      "feature": "2",
      "latitude": "38.975169",
      "longitude": "117.359855",
      "uses": "1",
      "bury": "10.700",
      "attachment": "1"
    },
    {
      "id": "a3c0e52a689511ec9cd1fa163e90e5bb",
      "code": "YSYRL084",
      "feature": "1",
      "latitude": "38.974545",
      "longitude": "117.359788",
      "uses": "2",
      "bury": "11.000",
      "attachment": "1"
    },
    {
      "id": "a3c0e5bd689511ec9cd1fa163e90e5bb",
      "code": "YSYRL085",
      "feature": "2",
      "latitude": "38.973935",
      "longitude": "117.359718",
      "uses": "3",
      "bury": "10.900",
      "attachment": "1"
    },
    {
      "id": "a3c0e64d689511ec9cd1fa163e90e5bb",
      "code": "YSYRL086",
      "feature": "2",
      "latitude": "38.973315",
      "longitude": "117.359650",
      "uses": "1",
      "bury": "10.800",
      "attachment": "2"
    },
    {
      "id": "a3c0e6df689511ec9cd1fa163e90e5bb",
      "code": "YSYRL087",
      "feature": "2",
      "latitude": "38.972669",
      "longitude": "117.359578",
      "uses": "2",
      "bury": "10.600",
      "attachment": "2"
    },
    {
      "id": "a3c0e772689511ec9cd1fa163e90e5bb",
      "code": "YSYRL088",
      "feature": "2",
      "latitude": "38.972041",
      "longitude": "117.359508",
      "uses": "3",
      "bury": "9.900",
      "attachment": "2"
    },
  ]
const lineList = [
    {
      "id": "aed22a98689511ec9cd1fa163e90e5bb",
      "code": "YJYRL083-YSYRL083",
      "startPointId": "a3bbf64f689511ec9cd1fa163e90e5bb",
      "startPoint": "YJYRL083",
      "startPointLatitude": "38.975169",
      "startPointLongitude": "117.359855",
      "endPointId": "a3c0e481689511ec9cd1fa163e90e5bb",
      "endPoint": "YSYRL083",
      "endPointLatitude": "38.974545",
      "endPointLongitude": "117.359788",
      "startBury": "0.990000",
      "endBury": "0.920000",
      "startHigh": "1.917000",
      "endHigh": "1.843000",
      "flowDirection": "1",
      "uses": "1",
      "pipeDiameter": "400"
    },
    {
      "id": "aed22bb4689511ec9cd1fa163e90e5bb",
      "code": "YJYRL078-YTYRL078",
      "startPointId": "a3bbf267689511ec9cd1fa163e90e5bb",
      "startPoint": "YJYRL078",
      "startPointLatitude": "38.974545",
      "startPointLongitude": "117.359788",
      "endPointId": "a3c5230b689511ec9cd1fa163e90e5bb",
      "endPoint": "YTYRL078",
      "endPointLatitude": "38.973935",
      "endPointLongitude": "117.359718",
      "startBury": "0.990000",
      "endBury": "0.930000",
      "startHigh": "1.979000",
      "endHigh": "1.889000",
      "flowDirection": "1",
      "uses": "2",
      "pipeDiameter": "400"
    },
    {
      "id": "aed22cac689511ec9cd1fa163e90e5bb",
      "code": "YJYRL038-YTYRL038",
      "startPointId": "a3bbdaea689511ec9cd1fa163e90e5bb",
      "startPoint": "YJYRL038",
      "startPointLatitude": "38.973935",
      "startPointLongitude": "117.359718",
      "endPointId": "a3c5086e689511ec9cd1fa163e90e5bb",
      "endPoint": "YTYRL038",
      "endPointLatitude": "38.973315",
      "endPointLongitude": "117.359650",
      "startBury": "0.990000",
      "endBury": "0.950000",
      "startHigh": "2.009000",
      "endHigh": "1.977000",
      "flowDirection": "1",
      "uses": "3",
      "pipeDiameter": "400"
    },
    {
      "id": "aed22de3689511ec9cd1fa163e90e5bb",
      "code": "YTYRL086-YVYRL086",
      "startPointId": "a3c528c2689511ec9cd1fa163e90e5bb",
      "startPoint": "YTYRL086",
      "startPointLatitude": "38.973315",
      "startPointLongitude": "117.359650",
      "endPointId": "a3c8e29e689511ec9cd1fa163e90e5bb",
      "endPoint": "YVYRL086",
      "endPointLatitude": "38.972669",
      "endPointLongitude": "117.359578",
      "startBury": "0.990000",
      "endBury": "0.930000",
      "startHigh": "1.876000",
      "endHigh": "1.820000",
      "flowDirection": "1",
      "uses": "1",
      "pipeDiameter": "400"
    },
    {
      "id": "aed22efe689511ec9cd1fa163e90e5bb",
      "code": "YTYRL083-YVYRL083",
      "startPointId": "a3c52676689511ec9cd1fa163e90e5bb",
      "startPoint": "YTYRL083",
      "startPointLatitude": "38.972669",
      "startPointLongitude": "117.359578",
      "endPointId": "a3c8df8e689511ec9cd1fa163e90e5bb",
      "endPoint": "YVYRL083",
      "endPointLatitude": "38.972041",
      "endPointLongitude": "117.359508",
      "startBury": "0.990000",
      "endBury": "0.950000",
      "startHigh": "1.919000",
      "endHigh": "1.844000",
      "flowDirection": "1",
      "uses": "3",
      "pipeDiameter": "400"
    }
  ]
export {
    pointList,
    lineList
}