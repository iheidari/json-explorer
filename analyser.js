const flatten = require("lodash").flatten;

const analyze = (input) => {
  const result = {};

  if (Array.isArray(input)) {
    if (input.length > 0) {
      let arrayResult = {};
      input.forEach((item, index) => {
        const itemResult = analyze(item);
        // first item just add it
        if (index === 0) {
          arrayResult = itemResult;
          return;
        }
        // for 2nd item and more need to check if it has same schema
        for (const key in itemResult) {
          if (Object.hasOwnProperty.call(itemResult, key)) {
            const element = itemResult[key];
            // property exist -> check if it is same type
            if (arrayResult[key]) {
              // it is same type(or one of types)
              if (
                arrayResult[key] === element ||
                (Array.isArray(arrayResult[key]) &&
                  arrayResult[key].includes(element))
              ) {
                continue;
              }
              // already had more than 1 types, so just add it to the end of the type list
              if (Array.isArray(arrayResult[key])) {
                arrayResult[key].push(element);
                continue;
              }
              // it is second type, so need to change it array of types
              arrayResult[key] = [arrayResult[key], element];
              continue;
            }
            // the item is new, so it is nullable
            if (Array.isArray(arrayResult[key])) {
              arrayResult[key] = ["!", ...arrayResult[key]];
              continue;
            }
            arrayResult[key] = ["!", element];
          }
        }
      });
      return [arrayResult];
    }
    return [];
  }

  for (const key in input) {
    if (Object.hasOwnProperty.call(input, key)) {
      const element = input[key];
      if (typeof element === "object") {
        result[key] = analyze(element);
      } else {
        result[key] = typeof element;
      }
    }
  }
  return result;
};

const getValues = (input, path) => {
  if (input == null) {
    return [];
  }
  if (Array.isArray(input)) {
    const allItems = input.reduce((acc, item) => {
      acc.push(...getValues(item, path));
      return acc;
    }, []);
    return [...new Set(allItems)];
  }
  if (path.length > 1) {
    const newPath = path.slice(1);
    // if (Array.isArray(input[path[0]])) {
    //   const allItems = input[path[0]].reduce((acc, item) => {
    //     acc.push(...getValues(item, newPath));
    //     return acc;
    //   }, []);
    //   return [...new Set(allItems)];
    // }

    return getValues(input[path[0]], newPath);
  }
  return [input[path[0]]];
};

module.exports = { analyze, getValues };
