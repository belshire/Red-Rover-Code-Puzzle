#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from 'yargs/helpers';

import parse from './parser.js';
import mapper from './mapper.js';
import sortFunction from './sorter.js';
import buildSubStructure from './structure.js';

const argv = yargs(hideBin(process.argv))
              .usage('Usage: --string=[stringToParse] optional: --sort')
              .demandOption(['string'])
              .parse();

const stringToParse = argv.string;
const sort = argv.sort;

const parsedArray = parse(stringToParse);
const structuredArray = [];

// Builds a structured array to represent hierarchy in the list.
parsedArray.forEach((item, index) => {
  if (Array.isArray(item)) {
    const last = structuredArray.pop();
    structuredArray.push(buildSubStructure(last, item));
  } else {
    structuredArray.push(item);
  } 
})

let sortedArray;
if (sort) {
  structuredArray.sort(sortFunction);
}

const stringifiedArray = structuredArray.map(i => mapper(i, 0));

const output = stringifiedArray.reduce((acc, current) => {
  const currentArray = current.split(",");
  return acc + currentArray.reduce((c_acc, c_current) => c_acc + c_current);
});

console.log(output);