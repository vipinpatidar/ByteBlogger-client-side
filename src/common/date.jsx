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
