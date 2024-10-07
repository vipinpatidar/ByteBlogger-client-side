const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const getTimeFormate = (date) => {
  let formateDate = new Date(date);

  return `${formateDate.getDate()} ${
    months[formateDate.getMonth()]
  }, ${formateDate.getFullYear()}`;
};

export const getDay = (date) => {
  let formateDate = new Date(date);

  return `${formateDate.getDate()} ${months[formateDate.getMonth()]}`;
};

export const getFullDayFormate = (date) => {
  let formateDate = new Date(date);

  return `${formateDate.getDate()} ${
    months[formateDate.getMonth()]
  }, ${formateDate.getFullYear()}
  `;
};

export const getFullDayWithTimeFormate = (date) => {
  let formatDate = new Date(date);

  const hours = formatDate.getHours();
  const minutes = formatDate.getMinutes();

  const formattedTime = `${hours % 12 || 12}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${hours >= 12 ? "PM" : "AM"}`;

  return `${formatDate.getDate()} ${
    months[formatDate.getMonth()]
  }, ${formatDate.getFullYear()} at ${formattedTime}`;
};
