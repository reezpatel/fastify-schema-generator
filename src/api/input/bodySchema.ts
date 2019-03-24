import { isValidJSON, isANumber, parseObject } from "../../utils/utils";
import { isBoolean, isString } from "util";
import * as jsonic from "jsonic";



const generateBodySchema = (obj: any) => {
  if (!isValidJSON(obj)) {
    if (isANumber(obj)) {
      return { number: { type: "number", example: obj + "", description: "" } };
    } else if (isBoolean(obj)) {
      return { value: { type: "boolean", example: obj + "", description: "" } };
    } else {
      return { text: { type: "string", example: obj + "", description: "" } };
    }
  }

  obj = jsonic(obj);
  return parseObject(obj);
};

export default generateBodySchema;
