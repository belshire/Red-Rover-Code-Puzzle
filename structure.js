/**
 * 
 * @param {*} last the last item we looked at
 * @param {*} item the current item we are looking at
 * @returns Builds a substructure array for nested items.
 */
export default function buildSubStructure(last, item) {
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
