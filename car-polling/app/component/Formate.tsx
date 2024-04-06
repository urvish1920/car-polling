import React, { FC } from "react";

interface FormattedDateProps {
  date: Date;
}

const FormattedDate: FC<FormattedDateProps> = ({ date }) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const dayName = dayNames[date.getDay()];
  const monthName = monthNames[month];

  const formattedDate = `${dayName} ${day}, ${monthName}`;

  return <span>{formattedDate}</span>;
};

export default FormattedDate;
