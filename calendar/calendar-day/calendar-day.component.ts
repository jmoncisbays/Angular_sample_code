import { Component, OnInit, Input } from '@angular/core';
import { calendarItem, calendarDayData } from "../calendar.component"

@Component({
    selector: 'app-calendar-day',
    templateUrl: './calendar-day.component.html',
    styleUrls: ['./calendar-day.component.css']
})
export class CalendarDayComponent implements OnInit {
    @Input()
    data: calendarDayData;

    constructor() { }

    ngOnInit() { }
}
