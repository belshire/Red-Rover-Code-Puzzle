import peggy from "peggy";

const stringToParse = "(id, name, email, type(id, name, customFields(c1, c2, c3)), externalId)";

const parser = peggy.generate(`Parens = '(' content:list  rest:Parens* ')' { return {content, rest} } / String
list
  = word|.., _ "," _|
word
  = $[a-z0-9]i+
_
  = [ \t]*

String = [^()]+ { return text() }`);

const parsedOutput = parser.parse(stringToParse);

let outputString = "";

//Top Line Items
parsedOutput.content.forEach((i) => {
  outputString += `- ${i}\n`
});

outputString += buildRest(parsedOutput.rest);

function buildRest(rest, level=1) {
  let output = "";
  rest.forEach((i) => {
  if (typeof i === "object") {
    const tab = "\t";
    if (i.content && i.content.length > 0) {
      i.content.forEach((c) => {
        output += `${tab.repeat(level)}- ${c}\n`;
      });
    }

    if (i.rest && i.rest.length > 0) {
      console.log("building nested rest", i.rest);
      output += buildRest(i.rest, level+1);
    }
  }

  if (typeof i === "string") {
    output += `- ${i.replace(", ", "")}\n`
  }

  })

  return output;
}

console.log(outputString);