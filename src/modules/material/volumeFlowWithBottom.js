function radarPrimitiveMaterialProperty(option) {
    this.opts = {
        color: Cesium.Color.RED,
        duration: 2000,
        time: new Date().getTime(),
        repeat: 30,
        offset: 0,
        thickness: 0.3,
    };
    this.opts = Object.assign(this.opts, option);
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = this.opts.color;
    this.duration = this.opts.duration;
    this._time = this.opts.time;
}

Object.defineProperties(radarPrimitiveMaterialProperty.prototype, {
    isConstant: {
        get: function () {
            return false;
        },
    },
    definitionChanged: {
        get: function () {
            return this._definitionChanged;
        },
    },
    color: Cesium.createPropertyDescriptor("color"),
});

radarPrimitiveMaterialProperty.prototype.getType = function (time) {
    return "radarPrimitive";
};
radarPrimitiveMaterialProperty.prototype.getValue = function (
    time,
    result
) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(
        this._color,
        time,
        Cesium.Color.WHITE,
        result.color
    );
    result.time =
        ((new Date().getTime() - this._time) % this.duration) /
        this.duration /
        10;
    result.repeat = this.opts.repeat;
    result.offset = this.opts.offset;
    result.thickness = this.opts.thickness;
    return result;
};
radarPrimitiveMaterialProperty.prototype.equals = function (other) {
    return (
        this === other ||
        (other instanceof radarPrimitiveMaterialProperty &&
            Property.equals(this._color, other._color))
    );
};

Cesium.radarPrimitiveMaterialProperty = radarPrimitiveMaterialProperty;
Cesium.Material.radarPrimitiveType = "radarPrimitive";
Cesium.Material.radarPrimitiveSource =
    "uniform vec4 color;\n\
                uniform float repeat;\n\
                uniform float offset;\n\
                uniform float thickness;\n\
                czm_material czm_getMaterial(czm_materialInput materialInput){\n\
                    czm_material material = czm_getDefaultMaterial(materialInput);\n\
                    float sp = 1.0/repeat;\n\
                    vec2 st = materialInput.st;\n\
                    float dis = distance(st, vec2(0.5));\n\
                    float m = mod(dis + offset-time, sp);\n\
                    float a = step(sp*(1.0-thickness), m); \n\
                    material.diffuse = color.rgb;\n\
                    material.alpha = a * color.a;\n\
                    return material;\n\
                }";

Cesium.Material._materialCache.addMaterial(
    Cesium.Material.radarPrimitiveType,
    {
        fabric: {
            type: Cesium.Material.radarPrimitiveType,
            uniforms: {
                color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
                //   image: Cesium.Material.radarPrimitiveImage,
                time: 0,
                repeat: 30,
                offset: 0,
                thickness: 0.3,
            },
            source: Cesium.Material.radarPrimitiveSource,
        },
        translucent: function (material) {
            return true;
        },
    }
);