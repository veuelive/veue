// Allows easier used of dates rather than getDay(), getYear(), etc
export interface ParsedDate {
  date: Date;
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
}

export interface DateParts {
  timeZoneName: string;
  year: string;
  month: string;
  day: string;
}

export interface TimeAryArgs {
  minutesLeftInDay: number;
  increment: number;
}
