import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { NumberValue } from 'd3';
import { ApiService } from './api.service';

interface Event {
  start: number;
  end: number;
  name: string;
  color: string;
  width: number;
}

interface SentEvent {
  start: number;
  end: number;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'PDO';
  eventList: SentEvent[] = [];
  startValue: any = null;
  endValue: any = null;
  eventValue: any = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    const events: Event[] = [
      { start: 50, end: 150, name: 'Stuck pipe', color: '#f00', width: 220 },
      { start: 100, end: 200, name: 'Mud loss', color: '#afafaf', width: 100 },
      {
        start: 150,
        end: 250,
        name: 'Cricnlation loss',
        color: '#000',
        width: 40,
      },
      { start: 400, end: 450, name: 'Stuck pipe', color: '#f00', width: 220 },
      {
        start: 550,
        end: 700,
        name: 'Cricnlation loss',
        color: '#000',
        width: 40,
      },
    ];

    const yScale = d3
      .scaleLinear()
      .domain([0, 700])
      .range([50, 800 - 50]);
    const yAxis = d3.axisRight(yScale).tickSize(0);

    const svg = d3
      .select('#chart')
      .append('svg')
      .attr('viewBox', '0 00 800 800')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('width', '600')
      .attr('height', '600');
    const g = svg.append('g').attr('transform', 'translate(120, 40)');
    g.selectAll('rect')
      .data(events)
      .enter()
      .append('rect')
      .attr('x', (d: Event) => (220 + 100 - d.width) / 2)
      .attr('y', (d: Event) => yScale(d.start))
      .attr('width', (d: Event) => d.width)
      .attr('height', (d: Event) => yScale(d.end) - yScale(d.start))
      .style('fill', (d: Event) => d.color);
    g.selectAll('text')
      .data(events)
      .enter()
      .append('text')
      .attr('x', (d: Event) => 220 + 80)
      .attr('y', (d: Event) => yScale(d.end))
      .text((d: Event) => d.name)
      .style('fill', (d: Event) => d.color);

    g.append('g').attr('transform', 'translate(0,0)').call(yAxis);
  }

  addEvent() {
    this.eventList.push({
      start: +this.startValue,
      end: +this.endValue,
      name: this.eventValue,
    });

    this.startValue = null;
    this.endValue = null;
    this.eventValue = null;

    console.log(this.eventList);
  }

  delete(item: SentEvent, i: number) {
    const index = this.eventList.indexOf(item);
    if (index > -1) {
      // only splice array when item is found
      this.eventList.splice(index, 1); // 2nd parameter means remove one item only
    }
  }

  proccess() {
    let data = [
      { Start: 50, End: 150, Event: 'Stuck Pipe' },
      { Start: 100, End: 200, Event: 'Mud Loss' },
      { Start: 150, End: 200, Event: 'Circulation Loss' },
      { Start: 400, End: 450, Event: 'Stuck Pipe' },
      { Start: 600, End: 650, Event: 'Circulation Loss' },
      { Start: 550, End: 700, Event: 'Circulation Loss' },
    ];

    this.api.getProcessedData(data).subscribe(
      (res) => {
        console.log('look for this', res);
      },
      (error) => {
        console.log('look for this', error);
      }
    );
  }
}
