const formatDate = (inputDate: any) => {
  // TODO fix type
  const date = new Date(inputDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export default formatDate;

export const longDateLocaleString = ({
  date,
  locale,
}: {
  date: Date;
  locale: string;
}) => {
  return date.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
