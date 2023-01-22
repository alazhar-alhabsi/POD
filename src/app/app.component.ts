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
  events: Event[] = [];
  scaleMax: Number = 0;

  constructor(private api: ApiService) {}

  ngOnInit() {}

  generateGraph() {
    const yScale = d3
      .scaleLinear()
      .domain([0, this.scaleMax])
      .range([50, 700 + 50]);
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
      .data(this.events)
      .enter()
      .append('rect')
      .attr('x', (d: Event) => (220 + 100 - d.width) / 2)
      .attr('y', (d: Event) => yScale(d.start))
      .attr('width', (d: Event) => d.width)
      .attr('height', (d: Event) => yScale(d.end) - yScale(d.start))
      .style('fill', (d: Event) => d.color);
    g.selectAll('text')
      .data(this.events)
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
    d3.selectAll('svg').remove();

    this.api.getProcessedData(this.eventList).subscribe(
      (res) => {
        this.events = res.events;
        this.scaleMax = res.maxValue;
        this.generateGraph();
      },
      (error) => {
        console.log('look for this', error);
      }
    );
  }
}
