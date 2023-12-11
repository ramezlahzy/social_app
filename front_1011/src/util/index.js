import AsyncStorage from '@react-native-async-storage/async-storage';

export const formatNumber = (x, suffix0 = false) => {
  const isNegative = x < 0;
  const parts = Math.abs(x).toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  if(suffix0){
    if (parts.length == 1) {
      parts.push("00");
    }
  }
  if(parts.length == 2){
    parts[1] = (parts[1]).length == 1 ? "" + parts[1] + "0" : parts[1];
  }
  const formatted = parts.join(".");
  return isNegative ? "-" + formatted : formatted;
};

export const formatCurrency = (x, suffix0=false) => {
  return `$${formatNumber(x, suffix0)}`;
};

export const formatSignedPercent = (x, suffix0=false) => {
  let sign = x >= 0 ? "+" : "";
  return `${sign}${formatNumber(x, suffix0)}%`;
};

export const formatFixed2 = (x) => {
  return Number.parseFloat(x).toFixed(2);
};

export const formatCurrencyFixed2 = (x, suffix0=false) => {
  console.log("dfj  ", formatCurrency(formatFixed2(x)));
  return formatCurrency(formatFixed2(x), suffix0);
};

export const getTimeString = (datetimeString) => {
  const dateObject = new Date(datetimeString);
  const options = { hour: '2-digit', minute: '2-digit', hour12: false };
  const timeString = dateObject.toLocaleTimeString([], options);
  console.log(timeString); // "06:57"
  return timeString;
}

export const  getTokenFromAyncStorage =  async () => {
  try {
    const value = await AsyncStorage.getItem("token");
    if (value !== null) {
      return value;

    } else {
      console.log('Data not found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
}