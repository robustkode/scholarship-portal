import _ from "lodash";
export function compare(oldList, newList) {
  let old = trasformToArray(oldList);
  let current = trasformToArray(newList);

  // Find added items
  const addedItems = _.difference(current, old);

  // Find removed items
  const removedItems = _.difference(old, current);
  return {
    addedItems,
    removedItems,
  };
}

function trasformToArray(item) {
  let f;
  if (_.isArray(item)) {
    f = (item.length === 1) & (item[0] === 1) ? [] : item;
  } else {
    try {
      if (f === "") {
        f = [];
      } else {
        f = item.split(",");
      }
    } catch (_) {
      f = [];
    }
  }
  return f;
}

export function getChangedPopulars(origional, reshuffled) {
  if (!reshuffled || !origional) {
    return [];
  }

  const isReshuffledValid = validPopularsList(origional, reshuffled);
  if (!isReshuffledValid) throw new Error("Non valid list");
  const changed = [];
  reshuffled.map((n) => {
    const oldVersion = origional.find((o) => o.id === n.id);
    if (oldVersion.rank === n.rank) return;
    changed.push(n);
  });
  return changed;
}

const validPopularsList = (original, reshuffled, count) => {
  const originalIds = new Set(original.map((country) => country.id));

  //c Check if all countries in the reshuffled list exist in the original list
  for (const item of reshuffled) {
    if (!originalIds.has(item.id)) {
      return false;
    }
  }

  //check if all original countries exist in the reshuffled list
  for (const country of original) {
    if (!reshuffled.some((item) => item.id === country.id)) {
      return false;
    }
  }

  // check ranks for validity
  const rankSet = new Set();
  const originalLength = original.length;

  for (const item of reshuffled) {
    const rank = item.rank;

    // check if rank is valid
    if (rank < 1 || rank > originalLength || rankSet.has(rank)) {
      return false;
    }

    rankSet.add(rank);
  }

  return true;
};
