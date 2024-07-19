function randomResponse(list) {
  let response = Math.floor(Math.random() * list.length);
  return list[response];
}

function clone(listA, listB) {
  return listA.join('-') == listB.join('-');
}

function check(list) {
  if (list[0] == list[1]) {
      return 'none';
  } else if (
      clone(list, ['rock', 'scissors']) ||
      clone(list, ['paper', 'rock']) ||
      clone(list, ['scissors', 'paper'])
  ) { return 'player'; }
  return 'computer';
};

export { randomResponse, clone, check };
