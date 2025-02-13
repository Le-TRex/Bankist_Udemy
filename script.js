'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// CREATE USERNAMES
const createsUsername = function (accounts) {
  accounts.forEach(function (account) {
    account.username ||= account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createsUsername(accounts);

/////////////////////////////////////////////////
// DISPLAY MOVEMENTS
const displayMovements = function (movements) {
  containerMovements.innerHTML = '';

  movements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
        ${i + 1} ${type}</div>
        <div class="movements__date">${new Date().toLocaleDateString()}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/////////////////////////////////////////////////
// CALCULATE AND DISPLAY BALANCE
const calculateAndDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov);
  labelBalance.textContent = `${account.balance} €`;
};

/////////////////////////////////////////////////
// CALCULATE AND DISPLAY SUMMARY
const calculateAndDisplaySummary = function (account) {
  let sumIn;
  if (account.movements.filter(move => move > 0).length <= 0) {
    sumIn = 0;
  } else {
    sumIn = account.movements
      .filter(move => move > 0)
      .reduce((acc, move) => acc + move);
  }

  let sumOut;
  if (account.movements.filter(move => move < 0).length <= 0) {
    sumOut = 0;
  } else {
    sumOut = account.movements
      .filter(move => move < 0)
      .reduce((acc, move) => acc + move);
  }

  let interests;
  if (sumIn > 0) {
    interests = account.movements
      .filter(move => move > 0)
      .map(deposit => (deposit * account.interestRate) / 100)
      .filter(interest => interest >= 1)
      .reduce((acc, int) => acc + int);
  } else {
    interests = 0;
  }

  labelSumIn.textContent = `${sumIn}€`;
  labelSumOut.textContent = `${Math.abs(sumOut)}€`;
  labelSumInterest.textContent = `${interests}€`;
};

/////////////////////////////////////////////////
// WRONG CREDENTIALS -- Remember to uncomment .app opacity, style.css l 97
const wrongCredentials = function () {
  containerApp.style.opacity = '0%';
  labelWelcome.textContent = 'Wrong credentials';
  inputLoginUsername.value = inputLoginPin.value = '';
  inputLoginPin.blur();
};

/////////////////////////////////////////////////
// CALCULATE AND DISPLAY MOVEMENTS, BALANCE AND SUMMARY
const calculateAndDisplayMovementsBalanceSummary = function (account) {
  displayMovements(account.movements);
  calculateAndDisplayBalance(account);
  calculateAndDisplaySummary(account);
};

/////////////////////////////////////////////////
// LOGIN -- WIP -- TODO Implement timer
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (!currentAccount) {
    wrongCredentials();
  }

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;

    // Handle opacity, uncomment l 97 in CSS file and here when application coding is done
    containerApp.style.opacity = '100%';

    calculateAndDisplayMovementsBalanceSummary(currentAccount);
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  } else {
    wrongCredentials();
  }
});

/////////////////////////////////////////////////
// LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const requestedAmount = Number(inputLoanAmount.value);
  const percentageOfAmount = 0.1;
  const isAnySufficientDeposit = currentAccount.movements.some(
    mouvement => mouvement > requestedAmount * percentageOfAmount
  );

  if (requestedAmount <= 0) {
    alert('You cannot ask for a loan equal or less than 0€');
  } else if (!isAnySufficientDeposit) {
    alert(
      `You did not make any deposit superior to ${
        requestedAmount * percentageOfAmount
      } on your account therefore we cannot grant you this loan`
    );
  } else {
    currentAccount.movements.push(requestedAmount);
    calculateAndDisplayMovementsBalanceSummary(currentAccount);
  }
  inputLoanAmount.value = '';
});

/////////////////////////////////////////////////
// TRANSFER
let recipientAccount;

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  recipientAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  if (recipientAccount) {
    console.log(recipientAccount.username);
  } else {
    console.log('No recipient account found');
  }

  if (!recipientAccount) {
    // No recipient account found
    alert("Selected recipient doesn't exist");
    inputTransferTo.focus();
  } else if (inputTransferAmount.value <= 0) {
    // Value to transfer is <= 0
    alert('You cannot tranfer 0€ or less');
    inputTransferAmount.focus();
  } else if (currentAccount.balance < inputTransferAmount.value) {
    // amount to tranfer is > sender's account balance
    alert(
      'Your account balance must be superior to the amount of money you want to transfer'
    );
    inputTransferAmount.focus();
  } else if (currentAccount === recipientAccount) {
    // sender is tranfering money to himself/herself
    alert('You cannot tranfer money to yourself');
    inputTransferTo.focus();
  } else {
    recipientAccount.movements.push(Number(inputTransferAmount.value));
    currentAccount.movements.push(Number(`-${inputTransferAmount.value}`));

    calculateAndDisplayMovementsBalanceSummary(currentAccount);

    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferAmount.blur();
  }
});

/////////////////////////////////////////////////
// SORT TODO implement sort

/////////////////////////////////////////////////
// CLOSE
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username !== inputCloseUsername.value ||
    currentAccount.pin !== Number(inputClosePin.value)
  ) {
    alert('Wrong credentials');
    inputCloseUsername.value = inputClosePin.value = '';
    inputCloseUsername.focus();
  } else {
    accounts.splice(accounts.indexOf(currentAccount), 1);
    inputCloseUsername.value = inputClosePin.value = '';
    containerApp.style.opacity = '0%';
    alert('Account deleted');
    labelWelcome.textContent = 'Log in to get started';
  }
});

/////////////////////////////////////////////////
// TIMEOUT TODO implement timeout
