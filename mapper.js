/**
 * 
 * @param {*} item The current item in the array we are looking at
 * @param {*} level What level of the array structure are we in
 * @returns A string representation
 */
export default function mapper(item, level) {
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
    outputString += item.map(j => mapper(j, newLevel))
  }
  return outputString;
}