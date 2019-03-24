import { isBoolean } from "util";
import { isANumber } from "../../utils/utils";

const generateQuerySchema = (uri: string) => {
    const querystring = uri.substring(uri.indexOf('?')+1).split('&');
    const result: any = {};
    
    for (var i = querystring.length - 1; i >= 0; i--) {
      const pair = querystring[i].split('=');
      const key = decodeURIComponent(pair[0]);
      const value = decodeURIComponent(pair[1] || '');
      
      let type = 'string';
      if (!value || value === '' || isBoolean(value)) {
          type = 'boolean';
      } else if (isANumber(value)) {
          type = 'number';
      }

      result[key] = {
          type,
          example: value,
          description: ''
      };
    }
    
    return result;
};

export default generateQuerySchema;