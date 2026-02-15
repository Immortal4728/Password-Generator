const characterAmountRange = document.getElementById('characterAmountRange');
const characterAmountNumber = document.getElementById('characterAmountNumber');
const includeUppercaseElement = document.getElementById('includeUppercase');
const includeNumbersElement = document.getElementById('includeNumbers');
const includeSymbolsElement = document.getElementById('includeSymbols');
const form = document.getElementById('passwordForm');
const passwordDisplay = document.getElementById('passwordDisplay');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const copyBtn = document.getElementById('copyBtn');
const copiedMsg = document.getElementById('copiedMsg');

const UPPERCASE_CHAR_CODES = arrayFromLowToHigh(65, 90);
const LOWERCASE_CHAR_CODES = arrayFromLowToHigh(97, 122);
const NUMBER_CHAR_CODES = arrayFromLowToHigh(48, 57);
const SYMBOL_CHAR_CODES = arrayFromLowToHigh(33, 47).concat(
  arrayFromLowToHigh(58, 64)
).concat(
  arrayFromLowToHigh(91, 96)
).concat(
  arrayFromLowToHigh(123, 126)
);

// Sync Slider and Number
characterAmountRange.addEventListener('input', syncCharacterAmount);

function syncCharacterAmount(e) {
  const value = e.target.value;
  characterAmountNumber.innerText = value;
  generateAndDisplay(); // Generate new password on slide
}

// Generate on Submit
form.addEventListener('submit', e => {
  e.preventDefault();
  generateAndDisplay();
});

// Copy to Clipboard
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(passwordDisplay.value);
    showCopiedMessage();
});

function showCopiedMessage() {
    copiedMsg.classList.add('active');
    setTimeout(() => {
        copiedMsg.classList.remove('active');
    }, 2000);
}

function generateAndDisplay() {
    const characterAmount = characterAmountRange.value;
    const includeUppercase = includeUppercaseElement.checked;
    const includeNumbers = includeNumbersElement.checked;
    const includeSymbols = includeSymbolsElement.checked;

    const password = generatePassword(
        characterAmount, 
        includeUppercase, 
        includeNumbers, 
        includeSymbols
    );
    
    passwordDisplay.value = password;
    updateStrengthMeter(password);
}

function generatePassword(characterAmount, includeUppercase, includeNumbers, includeSymbols) {
  let charCodes = LOWERCASE_CHAR_CODES;
  if (includeUppercase) charCodes = charCodes.concat(UPPERCASE_CHAR_CODES);
  if (includeNumbers) charCodes = charCodes.concat(NUMBER_CHAR_CODES);
  if (includeSymbols) charCodes = charCodes.concat(SYMBOL_CHAR_CODES);

  const passwordCharacters = [];
  for (let i = 0; i < characterAmount; i++) {
    const characterCode = charCodes[Math.floor(Math.random() * charCodes.length)];
    passwordCharacters.push(String.fromCharCode(characterCode));
  }
  return passwordCharacters.join('');
}

function arrayFromLowToHigh(low, high) {
  const array = [];
  for (let i = low; i <= high; i++) {
    array.push(i);
  }
  return array;
}

// Simple Strength Algorithm
function updateStrengthMeter(password) {
    let strength = 0;
    
    if (password.length > 8) strength += 1;
    if (password.length > 12) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    // Normalize to 0-4 for colors
    const colors = ['#f87171', '#f87171', '#facc15', '#4ade80', '#4ade80'];
    const texts = ['Very Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
    const widths = ['20%', '40%', '60%', '80%', '100%'];
    
    // Cap strength at 4 (index 4)
    const index = Math.min(strength, 4);

    strengthBar.style.width = widths[index];
    strengthBar.style.backgroundColor = colors[index];
    strengthText.innerText = texts[index];
}

// Initial generation
generateAndDisplay();