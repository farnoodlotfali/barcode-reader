// validate number input
export const validateNumberInput = (val) => {
  const valueInput = Number(
    faToEnNumber(val.replaceAll(",", "").replaceAll(" ", ""))
  );

  return !isNaN(valueInput);
};

// separate 3 by 3 digits of number with comma in farsi
export function numberWithCommas(number) {
  if (number === 0) return "۰";
  if (!number) return null;

  const numberIsNegative = number < 0;
  number = faToEnNumber(number);
  let decimals = number.toString()?.split(".")[1];
  if (parseFloat(decimals)) number -= parseFloat("0." + decimals);
  number = number.toString().replaceAll(",", "").replace("-", "");

  var separatedNumber = "";
  var count = 0;
  for (var i = number.length - 1; i >= 0; i--) {
    separatedNumber = number[i] + separatedNumber;
    count++;
    if (count === 3 && i !== 0) {
      separatedNumber = "," + separatedNumber;
      count = 0;
    }
  }
  if (decimals)
    separatedNumber += parseFloat("0." + decimals)
      .toString()
      ?.split("0")[1];

  if (numberIsNegative) separatedNumber += "-";

  return enToFaNumber(separatedNumber);
}

// should return english number with given input
export function faToEnNumber(number) {
  if (number === "۰") return 0;
  if (!number) return null;

  number = number.toString();

  const farsiDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

  for (let i = 0; i < farsiDigits.length; i++) {
    number = number.replace(new RegExp(farsiDigits[i], "g"), englishDigits[i]);
  }

  return number;
}

// should return farsi number with giver input
export function enToFaNumber(number) {
  if (number === 0) return "۰";
  if (!number) return null;
  const data = {
    1: "۱",
    2: "۲",
    3: "۳",
    4: "۴",
    5: "۵",
    6: "۶",
    7: "۷",
    8: "۸",
    9: "۹",
    0: "۰",
  };
  let result = "";
  number = number.toString();

  for (var i = 0; i < number?.length; i++) {
    if (data[number[i]]) result += data[number[i]];
    else result += number[i];
  }

  return result;
}
