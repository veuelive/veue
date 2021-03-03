import { DateParts, ParsedDate } from "types/date";

export const MINUTES_IN_A_DAY = 1440;

export const DateHelper = {
  parseDate,
  findMinutesLeftInDay,
  isSameDay,
  getLocale,
  getTimeZone,
  getPartsOfDate,
  findPartOfDate,
};

/**
 * Finds the minutes left in the day rounded to the closest interval.
 */
function findMinutesLeftInDay(date: Date, increment = 15): number {
  const parsedDate = parseDate(date);
  const minutesElapsed = parsedDate.hours * 60 + parsedDate.minutes;
  const minutesElapsedClosestIncrement =
    minutesElapsed + (increment - (minutesElapsed % increment));
  const minutesLeftInDay = MINUTES_IN_A_DAY - minutesElapsedClosestIncrement;
  return minutesLeftInDay;
}

/**
 * Checks to see if 2 parsed dates are the same day
 */
function isSameDay(dateA: Date, dateB: Date): boolean {
  const parsedDateA = parseDate(dateA);
  const parsedDateB = parseDate(dateB);

  if (
    parsedDateA.year === parsedDateB.year &&
    parsedDateA.month === parsedDateB.month &&
    parsedDateA.day === parsedDateB.day
  ) {
    return true;
  }

  return false;
}

/**
 * Convenience function for getting the current date, month, year, day, etc
 */
function parseDate(date: Date): ParsedDate {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  return { date, year, month, day, hours, minutes };
}

/**
 * Returns the value of navigation.language, or "en" by default
 */
function getLocale(): string {
  return navigator.language || "en";
}

function getTimeZone(dateFormat: Intl.DateTimeFormat): string {
  const { timeZoneName } = getPartsOfDate(new Date(), dateFormat);
  return timeZoneName;
}

/**
 * Find a type from formatToParts(date)
 */
function findPartOfDate(
  parts: Intl.DateTimeFormatPart[],
  partType: string
): string {
  return parts.find((obj) => obj.type === partType).value;
}

function getPartsOfDate(
  date: Date,
  dateFormat: Intl.DateTimeFormat
): DateParts {
  const formattedParts = dateFormat.formatToParts(date);

  return {
    day: findPartOfDate(formattedParts, "day"),
    month: findPartOfDate(formattedParts, "month"),
    year: findPartOfDate(formattedParts, "year"),
    timeZoneName: findPartOfDate(formattedParts, "timeZoneName"),
  };
}
