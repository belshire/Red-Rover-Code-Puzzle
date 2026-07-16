import yargs from "yargs";

import { hideBin } from 'yargs/helpers';
const argv = yargs(hideBin(process.argv)).parse()

const stringToParse = argv.string;
const sort = argv.sort;

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
function parse(string) {
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

const parsedArray = parse(stringToParse);
const structuredArray = [];

// Builds a structured array to represent hierarchy in the list.
parsedArray.forEach((item, index) => {
  if (Array.isArray(item)) {
    const last = structuredArray.pop();
    structuredArray.push(buildSubStructure(last, item))
  } else {
    structuredArray.push(item);
  } 
})

/**
 * 
 * @param {*} last the last item we looked at
 * @param {*} item the current item we are looking at
 * @returns Builds a substructure array for nested items.
 */
function buildSubStructure(last, item) {
  const newSubArray = []
  let previousSubItem = ""
  item.forEach((subItem) => {
    if (!Array.isArray(subItem)) {
      newSubArray.push(subItem)
    }

    if (Array.isArray(subItem)) {
      const newLast = newSubArray.pop();
      newSubArray.push(buildSubStructure(newLast, subItem))
    }

    previousSubItem = subItem;
  })
  return [last, newSubArray];
}
console.log({structuredArray});

function _merge(left, right) {
    const results = []

    while (left.length && right.length) {
        if (left[0] < right[0]){
          results.push(left.shift())
        } else {
          results.push(right.shift())
        }
    }

    return [...results, ...left, ...right]
}

function _mergeSort(array) {
    if (array.length === 1){
      return array
    }

    const center = Math.floor(array.length / 2)
    const left = array.slice(0, center)
    const right = array.slice(center)

    return _merge(_mergeSort(left), _mergeSort(right))
}

let sortedArray;
if (sort) {
  // console.log(_mergeSort(structuredArray));
  // sortedArray = _mergeSort(structuredArray)
  function sortFunction(a, b) {
    console.log({a, b})
    if (Array.isArray(a)) {
      const aArray = a[1];
      a = a[0];
      aArray.sort(sortFunction);
    }

    if (Array.isArray(b)) {
      const bArray = b[1];
      b = b[0];
      bArray.sort(sortFunction);
    }

    console.log(a.localeCompare(b));

    return a.localeCompare(b);
  }

  structuredArray.sort(sortFunction)
}


const stringifiedArray = structuredArray.map(i => mapItem(i, 0));

/**
 * 
 * @param {*} item The current item in the array we are looking at
 * @param {*} level What level of the array structure are we in
 * @returns A string representation
 */
function mapItem(item, level) {
  let outputString = "";
  let prependSpaces = level > 0 ? " ".repeat(level) : ""
    if (typeof item == "string") {
    outputString += `${prependSpaces}- ${item}\n`;
  }
  if (typeof item !== "string" && Array.isArray(item)) {
    if (typeof item[0] === "string" && Array.isArray(item[1])) {
      const top = item.shift()
      outputString += `${prependSpaces}- ${top}\n`;
    }
    const newLevel = level+1;
    outputString += item.map(j => mapItem(j, newLevel))
  }
  return outputString;
}

const output = stringifiedArray.reduce((acc, current) => {
  const currentArray = current.split(",");
  return acc + currentArray.reduce((c_acc, c_current) => c_acc + c_current);
});

console.log("\n#### Output ####")
console.log(output)