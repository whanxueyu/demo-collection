/**
 * 定义属性界面的基类属性
 */
export type PropDef = {
  name: string;
  title: string;
  type: string;
  editable: boolean;
};

/**
 * 定义属性界面的Num类型
 */
export type PropDefNum = PropDef & {
  min: number;
  max: number;
  step: number;
};

/**
 * 定义属性界面的Enum类型
 */
export type PropDefEnum = PropDef & {
  enum: string[];
};
