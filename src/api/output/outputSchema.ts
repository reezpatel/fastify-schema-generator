import { isValidJSON, isANumber, parseObject } from "../../utils/utils";
import { isBoolean } from "util";

import jsonic = require("jsonic");
import { resolve } from "dns";

const generateOutputSchema = (outputCode: number, obj: any): any => {
    let result: any = {};
    if (!isValidJSON(obj)) {
      if (isANumber(obj)) {
        result = { number: { type: "number", example: obj + "", description: "" } };
      } else if (isBoolean(obj)) {
        result = { value: { type: "boolean", example: obj + "", description: "" } };
      } else {
        result = { text: { type: "string", example: obj + "", description: "" } };
      }
    } else {
        obj = jsonic(obj);
        result = parseObject(obj);
    }
    const d: any = {};
    d[outputCode + ''] = result;
    return d;
};

export default generateOutputSchema;