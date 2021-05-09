import { Controller } from "stimulus";
import { TimeAryArgs } from "types/date";
import { MINUTES_IN_A_DAY, DateHelper } from "helpers/date_helper";

export default class extends Controller {
  static targets = [
    "scheduledAt",
    "checkbox",
    "daySelect",
    "timeSelect",
    "submit",
  ];

  scheduledAtTarget!: HTMLInputElement;
  checkboxTarget!: HTMLInputElement;

  submitTarget: HTMLInputElement;

  daySelectTarget!: HTMLSelectElement;
  timeSelectTarget!: HTMLSelectElement;

  connect(): void {
    this.createDayOptions();
    this.modifyTimeOptions();
    this.toggleScheduling();
    this.fillInKnownData();
  }

  toggleScheduling(): void {
    const target = this.checkboxTarget;

    if (target.checked) {
      this.daySelectTarget.disabled = false;
    } else {
      this.daySelectTarget.disabled = true;
      this.timeSelectTarget.disabled = true;
    }
  }

  updateScheduledAt(): void {
    // If the checkbox target is unchecked, do not pass go, do not proceed
    if (!this.checkboxTarget.checked) {
      this.scheduledAtTarget.value = "";
      this.submitTarget.disabled = false;
      return;
    }

    const dayValue = this.daySelectValue;
    const timeValue = this.timeSelectValue;

    if (dayValue && timeValue) {
      const { year, month, day } = dayValue;
      const { hours, minutes } = timeValue;
      this.scheduledAtTarget.value = new Date(
        year,
        month,
        day,
        hours,
        minutes
      ).toISOString();
      this.submitTarget.disabled = false;
      return;
    }

    this.scheduledAtTarget.value = "";
    this.submitTarget.disabled = true;
  }

  fillInKnownData(): void {
    const scheduledAt = this.scheduledAtTarget.value;

    // if the hiddenvalue isnt prefilled, then its not scheduled.
    if (!scheduledAt) {
      return;
    }

    this.checkboxTarget.checked = true;

    const scheduledDate = new Date(scheduledAt);

    this.findDayOptionElement(scheduledDate).selected = true;
    this.modifyTimeOptions();
    this.findTimeOptionElement(scheduledDate).selected = true;
  }

  findDayOptionElement(scheduledDate: Date): HTMLOptionElement {
    // We dont want the hours / minutes since theyre not stored that way on the option
    const { year, month, day } = DateHelper.parseDate(scheduledDate);

    const optionQuery = `option#scheduled-day-${year}-${month}-${day}`;

    return this.daySelectTarget.querySelector(optionQuery);
  }

  findTimeOptionElement(scheduledDate: Date): HTMLOptionElement {
    const { hours, minutes } = DateHelper.parseDate(scheduledDate);

    const optionQuery = `option#scheduled-time-${hours}-${minutes}`;
    return this.timeSelectTarget.querySelector(optionQuery);
  }

  /**
   * Actually updates the dom with day options
   */
  createDayOptions(): void {
    this.daySelectTarget.appendChild(this.generateDayOptions());
  }

  /**
   * Actually updates the dom with time options
   */
  modifyTimeOptions(): void {
    // If day and time are already selected, no need to regen, unless they select
    // the current day, then it will reset.
    if (this.daySelectValue && this.timeSelectValue && !this.todayIsSelected) {
      return;
    }

    this.timeSelectTarget.innerHTML = "";

    // Should also be i18n sensitive for "Pick a time" in the future.
    const blankOpt = this.createBlankOption(
      `Pick a time (${DateHelper.getTimeZone(this.dateFormat)})`
    );

    this.timeSelectTarget.appendChild(blankOpt);

    if (this.daySelectValue) {
      this.timeSelectTarget.disabled = false;
      this.timeSelectTarget.appendChild(this.generateTimeOptions());
      return;
    }

    this.timeSelectTarget.disabled = true;
  }

  /**
   * Generates a doc frag of <option> tags for time selecting
   */
  generateTimeOptions(increment = 15): DocumentFragment {
    let minutesLeftInDay = MINUTES_IN_A_DAY;

    // If its the same day, find the number of minutes left, rounded up to the closest interval
    if (this.todayIsSelected) {
      minutesLeftInDay = DateHelper.findMinutesLeftInDay(new Date(), increment);
    }

    const docFrag = new DocumentFragment();

    this.generateTimeAry({ minutesLeftInDay, increment }).forEach(
      (date: Date) => {
        const option = document.createElement("option");
        const text = date.toLocaleTimeString(
          DateHelper.getLocale(),
          this.localeOptions
        );
        option.innerText = `${text} (${DateHelper.getTimeZone(
          this.dateFormat
        )})`;

        const { hours, minutes } = DateHelper.parseDate(date);
        option.value = JSON.stringify({ hours, minutes });
        option.id = `scheduled-time-${hours}-${minutes}`;
        docFrag.appendChild(option);
      }
    );

    return docFrag;
  }

  /**
   * Generates a doc frag of <option> tags for date selecting
   */
  generateDayOptions(daysAhead = 14): DocumentFragment {
    const docFrag = new DocumentFragment();
    const {
      year: currentYear,
      month: currentMonth,
      day: currentDay,
    } = DateHelper.parseDate(new Date());

    // We should probably provide a locale translation for this in the future.
    const blankOpt = this.createBlankOption("Pick a Day");
    docFrag.appendChild(blankOpt);

    for (let i = 0; i <= daysAhead; i++) {
      const { date, year, month, day } = DateHelper.parseDate(
        new Date(currentYear, currentMonth, currentDay + i)
      );

      const option = document.createElement("option");

      option.value = JSON.stringify({ year, month, day });
      option.id = `scheduled-day-${year}-${month}-${day}`;

      const dateString = this.toDateString(date, i);

      option.innerText = dateString;
      docFrag.appendChild(option);
    }

    return docFrag;
  }

  get localeOptions(): Intl.DateTimeFormatOptions {
    return {
      hour: "numeric",
      minute: "numeric",
    };
  }

  get todayIsSelected(): boolean {
    const { year, month, day } = this.daySelectValue;
    const selectedDate = new Date(year, month, day);
    const today = new Date();

    return DateHelper.isSameDay(selectedDate, today);
  }

  get daySelectValue(): Record<string, number> | null {
    const value = this.daySelectTarget.value || null;

    return JSON.parse(value);
  }

  get timeSelectValue(): Record<string, number> | null {
    const value = this.timeSelectTarget.value || null;

    return JSON.parse(value);
  }

  /**
   * Relative time formatting via Intl.RelativeTimeFormat
   */
  get timeFormat(): Intl.RelativeTimeFormat {
    return new Intl.RelativeTimeFormat(DateHelper.getLocale(), {
      numeric: "auto",
    });
  }

  /**
   * Date formatting via Intl.DateTimeFromat
   */
  get dateFormat(): Intl.DateTimeFormat {
    return new Intl.DateTimeFormat(DateHelper.getLocale(), {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZoneName: "short",
    });
  }

  /**
   * Generates an array of times and returns the given Date
   */
  private generateTimeAry({
    minutesLeftInDay = MINUTES_IN_A_DAY,
    increment = 15,
  }: TimeAryArgs): Date[] {
    const dateAry = [];
    const { year, month, day } = DateHelper.parseDate(new Date());

    const totalValues = MINUTES_IN_A_DAY / increment;

    let i = (MINUTES_IN_A_DAY - minutesLeftInDay) / 15;

    for (i; i < totalValues; i++) {
      const totalCurrentMinutes = i * increment;
      const minutes = Math.floor(totalCurrentMinutes % 60);
      const hours = Math.floor((totalCurrentMinutes / 60) % 60);

      dateAry.push(new Date(year, month, day, hours, minutes));
    }

    return dateAry;
  }

  private toDateString(date: Date, index: number) {
    const { day, month, year } = DateHelper.getPartsOfDate(
      date,
      this.dateFormat
    );

    let dateString = `${day} ${month} ${year}`;

    // Adds (today / tomorrow) relative dates
    if (index < 2) {
      const relativeDate = this.timeFormat.format(index, "day");
      const capitalizedRelativeDate =
        relativeDate.charAt(0).toUpperCase() + relativeDate.slice(1);

      dateString += ` (${capitalizedRelativeDate})`;
    }

    return dateString;
  }

  private createBlankOption(text: string): HTMLOptionElement {
    const option = document.createElement("option");
    option.value = "";
    option.innerText = text;
    return option;
  }
}
