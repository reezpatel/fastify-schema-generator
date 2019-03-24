import * as jsonic from "jsonic";
import { isNumber, isBoolean, isString } from "util";

export function isValidJSON(text: string): boolean {
  try {
    jsonic(text);
  } catch {
    return false;
  }
  return true;
}

export function isANumber(str: string) {
  return !/\D/.test(str);
}

export function getArrayType(arr: any[]): string | undefined {
  const types: string[] = [];
  for (let e of arr) {
    if (!types.includes(typeof e)) {
      types.push(typeof e);
    }
  }
  if (types.length === 1) {
    return types[0];
  }
  return undefined;
}

export const parseObject = (obj: any): any => {
  if (isANumber(obj)) {
    return { type: "number" };
  }

  if (isBoolean(obj)) {
    return { type: "boolean" };
  }

  if (isString(obj)) {
    return { type: "string" };
  }

  if (typeof obj === "object") {
    if (Array.isArray(obj)) {
      const arryType = getArrayType(obj);
      if (!arryType) {
        return { type: "array" };
      }

      if (arryType !== "object") {
        return {
          type: "array",
          items: {
            type: arryType
          }
        };
      }

      return {
        type: "array",
        items: parseObject(obj[0]),
        description: ""
      };
    }

    const schema: any = {
      type: "object",
      required: [],
      properties: {}
    };

    // Process Each Object at One level deep
    for (let key of Object.keys(obj)) {
      schema.properties[key] = {
        ...parseObject(obj[key]),
        example:
          typeof obj[key] === "object" && !Array.isArray(obj[key])
            ? undefined
            : obj[key].toString(),
        description: ""
      };
    }

    return schema;
  }

  return { type: `ERROR: CAN'T PARSE` };
};
