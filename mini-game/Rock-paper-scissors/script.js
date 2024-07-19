'use strict';

import { check, randomResponse } from './functions.js';

const rock = document.querySelector('.rock');
const paper = document.querySelector('.paper');
const scissors = document.querySelector('.scissors');
const options = [rock, paper, scissors];
const optionList = {
  'rock': './images/rock.png',
  'paper': './images/paper.png',
  'scissors': './images/scissors.png'
};

const player = document.querySelector('.player');
const computer = document.querySelector('.computer');
const pScore = document.querySelector('.p-score');
const cScore = document.querySelector('.c-score');
const result = document.querySelector('.result');
let pCount = 0;
let cCount = 0;

// countdown.innerText = count;

options.forEach((option) => {
  option.addEventListener('click', (e)=> {
    let random = randomResponse(Object.keys(optionList));
    let choosed = e.target.className;

    random == 'rock' ? 
      computer.style.transform = 'rotateY(0deg)':
      computer.style.transform = 'rotateY(180deg)';

    computer.style.backgroundImage = `url(${optionList[random]})`;
    player.style.backgroundImage = `url(${optionList[choosed]})`;

    switch (check([choosed, random])) {
      case 'player':
        pCount ++;
        pScore.innerText = pCount;
        result.innerText = 'You win !\n+1';
        break;
      case 'computer':
        cCount ++;
        cScore.innerText = cCount;
        result.innerText = 'You lost';
        break;
      case 'none':
        result.innerText = 'Tie';
    }
    // result.classList.add('appear');
  });
});

