import { Cartesian3, Quaternion, Matrix3, Math as CesiumMath } from "cesium";

export type computeEllipseOption = {
  center: Cartesian3;
  semiMajorAxis: number;
  semiMinorAxis: number;
  rotation: number;
  granularity: number;
};

export type EllipsePositions = {
  positions?: number[];
  numPts?: number;
  outerPositions?: number[];
};

export class EllipseGeometryLibrary {
  static pointOnEllipsoid(
    theta: number,
    rotation: number,
    northVec: Cartesian3,
    eastVec: Cartesian3,
    aSqr: number,
    ab: number,
    bSqr: number,
    mag: number,
    unitPos: Cartesian3,
    result: Cartesian3
  ): Cartesian3 {
    const rotAxis = new Cartesian3();
    const tempVec = new Cartesian3();
    const unitQuat = new Quaternion();
    const rotMtx = new Matrix3();

    const azimuth = theta + rotation;

    Cartesian3.multiplyByScalar(eastVec, Math.cos(azimuth), rotAxis);
    Cartesian3.multiplyByScalar(northVec, Math.sin(azimuth), tempVec);
    Cartesian3.add(rotAxis, tempVec, rotAxis);

    let cosThetaSquared = Math.cos(theta);
    cosThetaSquared = cosThetaSquared * cosThetaSquared;

    let sinThetaSquared = Math.sin(theta);
    sinThetaSquared = sinThetaSquared * sinThetaSquared;

    const radius =
      ab / Math.sqrt(bSqr * cosThetaSquared + aSqr * sinThetaSquared);
    const angle = radius / mag;

    // Create the quaternion to rotate the position vector to the boundary of the ellipse.
    Quaternion.fromAxisAngle(rotAxis, angle, unitQuat);
    Matrix3.fromQuaternion(unitQuat, rotMtx);

    Matrix3.multiplyByVector(rotMtx, unitPos, result);
    Cartesian3.normalize(result, result);
    Cartesian3.multiplyByScalar(result, mag, result);
    return result;
  }

  static computeEllipsePositions(
    options: computeEllipseOption,
    addFillPositions: boolean,
    addEdgePositions: boolean
  ) {
    const unitPosScratch = new Cartesian3();
    const eastVecScratch = new Cartesian3();
    const northVecScratch = new Cartesian3();
    const scratchCartesian1 = new Cartesian3();
    const scratchCartesian2 = new Cartesian3();
    const scratchCartesian3 = new Cartesian3();

    const semiMinorAxis = options.semiMinorAxis;
    const semiMajorAxis = options.semiMajorAxis;
    const rotation = options.rotation;
    const center = options.center;

    // Computing the arc-length of the ellipse is too expensive to be practical. Estimating it using the
    // arc length of the sphere is too inaccurate and creates sharp edges when either the semi-major or
    // semi-minor axis is much bigger than the other. Instead, scale the angle delta to make
    // the distance along the ellipse boundary more closely match the granularity.
    const granularity = options.granularity * 8.0;

    const aSqr = semiMinorAxis * semiMinorAxis;
    const bSqr = semiMajorAxis * semiMajorAxis;
    const ab = semiMajorAxis * semiMinorAxis;

    const mag = Cartesian3.magnitude(center);

    const unitPos = Cartesian3.normalize(center, unitPosScratch);
    let eastVec = Cartesian3.cross(Cartesian3.UNIT_Z, center, eastVecScratch);
    eastVec = Cartesian3.normalize(eastVec, eastVec);
    const northVec = Cartesian3.cross(unitPos, eastVec, northVecScratch);

    // The number of points in the first quadrant
    let numPts = 1 + Math.ceil(CesiumMath.PI_OVER_TWO / granularity);

    const deltaTheta = CesiumMath.PI_OVER_TWO / (numPts - 1);
    let theta = CesiumMath.PI_OVER_TWO - numPts * deltaTheta;
    if (theta < 0.0) {
      numPts -= Math.ceil(Math.abs(theta) / deltaTheta);
    }

    // If the number of points were three, the ellipse
    // would be tessellated like below:
    //
    //         *---*
    //       / | \ | \
    //     *---*---*---*
    //   / | \ | \ | \ | \
    //  / .*---*---*---*. \
    // * ` | \ | \ | \ | `*
    //  \`.*---*---*---*.`/
    //   \ | \ | \ | \ | /
    //     *---*---*---*
    //       \ | \ | /
    //         *---*
    // The first and last column have one position and fan to connect to the adjacent column.
    // Each other vertical column contains an even number of positions.
    const size = 2 * (numPts * (numPts + 2));
    const positions = addFillPositions
      ? new Array<number>(size * 3)
      : undefined;
    let positionIndex = 0;
    let position = scratchCartesian1;
    let reflectedPosition = scratchCartesian2;

    const outerPositionsLength = numPts * 4 * 3;
    let outerRightIndex = outerPositionsLength - 1;
    let outerLeftIndex = 0;
    const outerPositions = addEdgePositions
      ? new Array(outerPositionsLength)
      : undefined;

    let i;
    let j;
    let numInterior;
    let t;
    let interiorPosition;

    // Compute points in the 'eastern' half of the ellipse
    theta = CesiumMath.PI_OVER_TWO;
    position = this.pointOnEllipsoid(
      theta,
      rotation,
      northVec,
      eastVec,
      aSqr,
      ab,
      bSqr,
      mag,
      unitPos,
      position
    );
    if (addFillPositions && positions) {
      positions[positionIndex++] = position.x;
      positions[positionIndex++] = position.y;
      positions[positionIndex++] = position.z;
    }
    if (addEdgePositions && outerPositions) {
      outerPositions[outerRightIndex--] = position.z;
      outerPositions[outerRightIndex--] = position.y;
      outerPositions[outerRightIndex--] = position.x;
    }
    theta = CesiumMath.PI_OVER_TWO - deltaTheta;
    for (i = 1; i < numPts + 1; ++i) {
      position = this.pointOnEllipsoid(
        theta,
        rotation,
        northVec,
        eastVec,
        aSqr,
        ab,
        bSqr,
        mag,
        unitPos,
        position
      );
      reflectedPosition = this.pointOnEllipsoid(
        Math.PI - theta,
        rotation,
        northVec,
        eastVec,
        aSqr,
        ab,
        bSqr,
        mag,
        unitPos,
        reflectedPosition
      );

      if (addFillPositions && positions) {
        positions[positionIndex++] = position.x;
        positions[positionIndex++] = position.y;
        positions[positionIndex++] = position.z;

        numInterior = 2 * i + 2;
        for (j = 1; j < numInterior - 1; ++j) {
          t = j / (numInterior - 1);
          interiorPosition = Cartesian3.lerp(
            position,
            reflectedPosition,
            t,
            scratchCartesian3
          );
          positions[positionIndex++] = interiorPosition.x;
          positions[positionIndex++] = interiorPosition.y;
          positions[positionIndex++] = interiorPosition.z;
        }

        positions[positionIndex++] = reflectedPosition.x;
        positions[positionIndex++] = reflectedPosition.y;
        positions[positionIndex++] = reflectedPosition.z;
      }

      if (addEdgePositions && outerPositions) {
        outerPositions[outerRightIndex--] = position.z;
        outerPositions[outerRightIndex--] = position.y;
        outerPositions[outerRightIndex--] = position.x;
        outerPositions[outerLeftIndex++] = reflectedPosition.x;
        outerPositions[outerLeftIndex++] = reflectedPosition.y;
        outerPositions[outerLeftIndex++] = reflectedPosition.z;
      }

      theta = CesiumMath.PI_OVER_TWO - (i + 1) * deltaTheta;
    }

    // Compute points in the 'western' half of the ellipse
    for (i = numPts; i > 1; --i) {
      theta = CesiumMath.PI_OVER_TWO - (i - 1) * deltaTheta;

      position = this.pointOnEllipsoid(
        -theta,
        rotation,
        northVec,
        eastVec,
        aSqr,
        ab,
        bSqr,
        mag,
        unitPos,
        position
      );
      reflectedPosition = this.pointOnEllipsoid(
        theta + Math.PI,
        rotation,
        northVec,
        eastVec,
        aSqr,
        ab,
        bSqr,
        mag,
        unitPos,
        reflectedPosition
      );

      if (addFillPositions && positions) {
        positions[positionIndex++] = position.x;
        positions[positionIndex++] = position.y;
        positions[positionIndex++] = position.z;

        numInterior = 2 * (i - 1) + 2;
        for (j = 1; j < numInterior - 1; ++j) {
          t = j / (numInterior - 1);
          interiorPosition = Cartesian3.lerp(
            position,
            reflectedPosition,
            t,
            scratchCartesian3
          );
          positions[positionIndex++] = interiorPosition.x;
          positions[positionIndex++] = interiorPosition.y;
          positions[positionIndex++] = interiorPosition.z;
        }

        positions[positionIndex++] = reflectedPosition.x;
        positions[positionIndex++] = reflectedPosition.y;
        positions[positionIndex++] = reflectedPosition.z;
      }

      if (addEdgePositions && outerPositions) {
        outerPositions[outerRightIndex--] = position.z;
        outerPositions[outerRightIndex--] = position.y;
        outerPositions[outerRightIndex--] = position.x;
        outerPositions[outerLeftIndex++] = reflectedPosition.x;
        outerPositions[outerLeftIndex++] = reflectedPosition.y;
        outerPositions[outerLeftIndex++] = reflectedPosition.z;
      }
    }

    theta = CesiumMath.PI_OVER_TWO;
    position = this.pointOnEllipsoid(
      -theta,
      rotation,
      northVec,
      eastVec,
      aSqr,
      ab,
      bSqr,
      mag,
      unitPos,
      position
    );

    if (addFillPositions && positions) {
      positions[positionIndex++] = position.x;
      positions[positionIndex++] = position.y;
      positions[positionIndex++] = position.z;
      //r.positions = positions;
      //r.numPts = numPts;
    }
    if (addEdgePositions && outerPositions) {
      outerPositions[outerRightIndex--] = position.z;
      outerPositions[outerRightIndex--] = position.y;
      outerPositions[outerRightIndex--] = position.x;
      //r.outerPositions = outerPositions;
    }

    let r: EllipsePositions = {
      positions: positions?.slice(),
      numPts: numPts,
      outerPositions: outerPositions?.slice(),
    };
    
    return r;
  }
}
