const tokens_re = /(\(|\)|\n|\s+|[^\s(),]+)/;
function tokenize(string) {
    string = string.trim();
    if (!string.length) {
        return [];
    }
    return string.split(tokens_re).filter(token => token.replace(",", " ").trim());
}

/**
 * 
 * @param {*} string 
 * @returns Parses string and returns an array of list items
 */
export default function parse(string) {
  const tokens = tokenize(string);
  const result = [];
  const stack = [];

  tokens.forEach(token => {
    if (token == "(") {
      stack.push([]);
    } 
    else if (token == ")") {
      if (stack.length) {
        const top = stack.pop();
        if (stack.length) {
          var last = stack[stack.length - 1];
          last.push(top);
        } else {
          result.push(top);
        }
      } else {
        throw new Error("Syntax Error")
      }
    } else {
      const top = stack[stack.length - 1];
      top.push(token);
    }
  });
  return result[0];
}