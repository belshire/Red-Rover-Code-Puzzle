export default function sortFunction(a, b) {
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

  return a.localeCompare(b);
}