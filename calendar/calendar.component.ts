import { Component, OnInit } from '@angular/core';
import { PTODateRepository } from "../../../model/pto-date.repository";
import { HolidayRepository } from "../../../model/holiday.repository";
import { CountryRepository } from "../../../model/country.repository";
import { Country } from '../../../model/country.model';
import { Router } from "@angular/router";
import { Observable } from "rxjs/Rx";

export class calendarItem {
    constructor(public itemName: string, public color: string, public backgroundColor: string) { }
}

export class calendarDayData {
    constructor() { }
    public day: string;
    public items: calendarItem[];
}

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
    public processing: boolean = true;
    public weeks: number[];
    public processedDate: Date;
    public calendarDay: number;
    public roles = Roles;
    public countries: Country[] = [];

    private calendarItems: any[];
    private daysInMonth: number;
    private year: number;
    private month: number;

    constructor(private ptoDateRepository: PTODateRepository, private holidayRepository: HolidayRepository, private countryRepository: CountryRepository, private router: Router) { }

    ngOnInit() {
        let currentDate: Date = new Date();
        this.month = currentDate.getMonth() + 1;
        this.year = currentDate.getFullYear();

        this.countryRepository.getCountriesWithHolidaysBySegmentId().subscribe(data => {
            this.countries = data;
            this.processMonth(0);
        });
    }

    processMonth(nextOrPrevious: number) {
        this.processing = true;

        if (nextOrPrevious == 1) {
            if (this.month == 12) {
                this.month = 1;
                this.year++;
            }
            else {
                this.month++;
            }
        }
        else if (nextOrPrevious == -1) {
            if (this.month == 1) {
                this.month = 12;
                this.year--;
            }
            else {
                this.month--;
            }
        }

        this.daysInMonth = new Date(this.month == 12 ? this.year + 1 : this.year, this.month == 12 ? 0 : this.month, 0).getDate();

        // calculates number of weeks of the month
        this.weeks = [];
        let i: number;
        let weekDay: number;
        let tempDate: Date;
        let lastSunday: number;
        let weekIndex: number = 0;
        for (i = 1; i <= this.daysInMonth; i++) {
            tempDate = new Date(this.year, this.month - 1, i);
            // ? Sunday
            if (tempDate.getDay() == 6) {
                weekIndex++;
                this.weeks.push(weekIndex);
                lastSunday = i;
            }
        }
        // ? one more week
        if (this.daysInMonth > lastSunday) {
            weekIndex++;
            this.weeks.push(weekIndex);
        }

        // ? first day != Sunday -> calculates the negative-starting secuence for the day of the calendar
        this.processedDate = new Date(this.year, this.month - 1, 1);
        this.calendarDay = 1 - (this.processedDate.getDay());

        // get the Calendar Items
        // -------------------------------------------------------------------------
        this.calendarItems = new Array<any>(this.daysInMonth);
        let startDay, endDay: number;

        //  get PTOs of the month
        let getPTOs = this.ptoDateRepository.getByYearMonth(this.year, this.month);
        //  get holidays of the month
        let getHolidays = this.holidayRepository.getByYearMonth(this.year, this.month);

        Observable.forkJoin(getPTOs, getHolidays).subscribe(data => {
            // PTOs
            data[0].forEach(ptod => {
                startDay = new Date(ptod.startDate).getDate();
                endDay = new Date(ptod.endDate).getDate();
                for (i = startDay; i <= endDay; i++) {
                    this.addCalendarItem(i - 1, `${ptod.resource.firstName} ${ptod.resource.lastName}`, "#000000", "#ffc107");
                }
            });

            // holidays
            data[1].forEach(h => {
                startDay = new Date(h.startDate).getDate();
                endDay = new Date(h.endDate).getDate();
                for (i = startDay; i <= endDay; i++) {
                    this.addCalendarItem(i - 1, h.name, "#ffffff", h.calendarColorCode);
                }
            });

            this.processing = false;
        });
    }

    addCalendarItem(day: number, itemName: string, color: string, backgroundColor: string) {
        let items: calendarItem[];
        if (this.calendarItems[day] == null) {
            items = [new calendarItem(itemName, color, backgroundColor)];
        }
        else {
            items = this.calendarItems[day]
            items.push(new calendarItem(itemName, color, backgroundColor));
        }
        this.calendarItems[day] = items;
    }

    getCalendarData(calendarDay: number): calendarDayData {
        let cdd = new calendarDayData();

        if (!(calendarDay < 1 || calendarDay > this.daysInMonth)) {
            cdd.day = calendarDay.toString();
            cdd.items = this.calendarItems[calendarDay - 1];
        }

        this.calendarDay++;
        return cdd;
    }

    goToPTO() {
        this.router.navigate(["mypto"]);
    }

    goToHolidays() {
        this.router.navigate(["holidays"]);
    }

    goToResourceAvailabilityRpt() {
        this.router.navigate(["resourceavailabilityreport"]);
    }

}
