import { Component, OnInit } from '@angular/core';
import { ChartDataItem } from '../../models/ChartDataItem';
import { PortfolioTimelineSummary } from 'src/app/models/PortfolioTimelineSummary';
import { Chart, registerables } from 'chart.js';
import { TimelineDataItem } from 'src/app/models/TimelineDataItem';
import { ClassificationService } from 'src/app/services/classification.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})

export class WelcomeComponent implements OnInit {
  public timeform = new FormGroup({
    timeSelector: new FormControl('7days')
  });
  public pageTitle = 'Asset Overview'
  private pieChart: any; // Instance for the pie chart
  private timelineChart: any; // Instance for the timeline chart
  public  showCategoryData = true; // Toggle between category and broker data
  private currentView: 'all' | 'category' | 'broker' = 'all'; // default view
  public currentTimeSpan : '7days' | 'month' | 'YTD' = '7days' ;
  public chartData: ChartDataItem[] = []; // Initialize with an empty array

  constructor(private classificationService: ClassificationService, private activatedRoute: ActivatedRoute,
    ) {}

  ngOnInit(): void {
    this.chartData = (this.activatedRoute.snapshot.data as any).welcome;
    this.updatePieChart(this.chartData);
    this.updateTimelineChart(this.currentTimeSpan);
    }

    private updateTimelineChart(timeRange: string): void {
      let data;
    switch (this.currentView) {
      case 'all':
        data = this.mockFetchAllTimelineData(timeRange);
        break;
      case 'category':
        data = this.mockFetchCategoryTimelineData(timeRange);
        break;
      case 'broker':
        data = this.mockFetchBrokerTimelineData(timeRange);
        break;
    }
    this.renderTimelineChart(data);
  }

  public toggleView(view: 'all' | 'category' | 'broker'): void {
    this.currentView = view;
    const selectedValue = this.timeform.get('timeSelector')?.value ?? '7days';
    this.updateTimelineChart(selectedValue);
  }

  private updateChartData(): void {
    const data = this.showCategoryData ? this.FetchCategoryData() : this.FetchBrokerData();
  }


  public toggleChartData(): void {
    this.showCategoryData = !this.showCategoryData;
    this.updateChartData();
  }

  private FetchCategoryData(): void {
    this.classificationService.getCategoryDistribution('userId').subscribe({
      next: (response: any[]) => {
        this.chartData = response
        .filter(item => item.assetCount > 0)
        .map(item => ({
          name: item.name,
          assetCount: item.assetCount
        }));
        this.updatePieChart(this.chartData);
      },
      error: (any) => {
        console.error('Error fetching category data:', any);
      }
    });
  }

  private FetchBrokerData(): void {
    this.classificationService.getBrokerDistribution('userId').subscribe({
      next: (response: any[]) => {
        this.chartData = response
        .filter(item => item.assetCount > 0)
        .map(item => ({
          name: item.name,
          assetCount: item.assetCount
        }));
        this.updatePieChart(this.chartData);
      },
      error: (error) => {
        console.error('Error fetching broker data:', error);
      }
    });
  }

  private updatePieChart(data: ChartDataItem[]): void {
    console.log(data);
    const labels = data.map(item => item.name || item.name);
    const counts = data.map(item => item.assetCount);
  
    const chartData = {
      labels: labels,
      datasets: [{
        data: counts,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          // Add more colors as needed
        ],
        // other dataset properties
      }]
    };
  
    this.renderPieChart(chartData);
  }
  private renderTimelineChart(portfolioData: PortfolioTimelineSummary): void {
    const datasets = portfolioData.summaries.map(summary => {
      return {
        label: summary.name,
        data: summary.timelineData.map(item => ({ x: item.date, y: item.price })),
        // Customize each dataset (e.g., line color)
      };
    });
    const chartData = {
      datasets: datasets
    };
  
    this.createTimelineChart(chartData);
  }

  private createTimelineChart(chartData: any): void {
    const canvasElement = document.getElementById('timelineChart');
  
    if (canvasElement instanceof HTMLCanvasElement) {
      const ctx = canvasElement.getContext('2d');
      if (ctx) {
        if (this.timelineChart) this.timelineChart.destroy();
  
        this.timelineChart = new Chart(ctx, {
          type: 'line',
          data: chartData,
          
          options: {
            responsive: true,
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day'
                }
              }
            },
            // other chart options
          }
        });
      } else {
        console.error('Unable to get canvas context for timeline chart');
      }
    } else {
      console.error('Timeline Chart canvas element not found');
    }
  }
  

  private renderPieChart(chartData: any): void {
    const canvasElement = document.getElementById('myChart');
  
    if (canvasElement instanceof HTMLCanvasElement) {
      const ctx = canvasElement.getContext('2d');
      if (ctx) {
        // Destroy existing chart instance if it exists
        if (this.pieChart) {
          this.pieChart.destroy();
        }
  
        // Create a new chart instance
        this.pieChart = new Chart(ctx, {
          type: 'pie',
          data: chartData,
          
          options: {
            responsive: true
          }
        });
      } else {
        console.error('Unable to get canvas context');
      }
    } else {
      console.error('Canvas element not found or not a canvas element');
    }
  }
  public onTimeSpanChange(): void {
    const selectedValue = this.timeform.get('timeSelector')?.value ?? '7days';
    this.updateTimelineChart(selectedValue);
  }

  private mockFetchCategoryTimelineData(timeRange: string): PortfolioTimelineSummary {
    let techData: TimelineDataItem[] = [];
    let cryptoData: TimelineDataItem[] = [];

    switch (timeRange) {
        case '7days':
            techData = [
              { date: '2023-01-01', price: 180 },
              { date: '2023-02-01', price: 815 },
              { date: '2023-03-01', price: 910 },
              { date: '2023-04-01', price: 935 },
              { date: '2023-05-01', price: 1400 },
              { date: '2023-06-01', price: 1305 },
              { date: '2023-07-01', price: 110 }
           ];
            cryptoData = [
              { date: '2023-01-01', price: 80 },
              { date: '2023-02-01', price: 85 },
              { date: '2023-03-01', price: 90 },
              { date: '2023-04-01', price: 95 },
              { date: '2023-05-01', price: 100 },
              { date: '2023-06-01', price: 105 },
              { date: '2023-07-01', price: 110 }
                        ];
            break;
        case 'month':
            techData = [
              { date: '2023-01-01', price: 180 },
              { date: '2023-02-01', price: 815 },
              { date: '2023-03-01', price: 910 },
              { date: '2023-04-01', price: 935 },
              { date: '2023-05-01', price: 1400 },
              { date: '2023-06-01', price: 1305 },
              { date: '2023-10-01', price: 125 },
              { date: '2023-11-01', price: 1340 }     
            ];
            cryptoData = [
              { date: '2023-01-01', price: 180 },
              { date: '2023-02-01', price: 8315 },
              { date: '2023-03-01', price: 9140 },
              { date: '2023-04-01', price: 935 },
              { date: '2023-05-01', price: 13400 },
              { date: '2023-06-01', price: 13305 },
              { date: '2023-10-01', price: 1225 },
              { date: '2023-11-01', price: 13240 }     
            ];
            break;
        case 'YTD':
          techData = [
            { date: '2023-01-01', price: 180 },
            { date: '2023-02-01', price: 815 },
            { date: '2023-03-01', price: 910 },
            { date: '2023-04-01', price: 935 },
            { date: '2023-05-01', price: 1400 },
            { date: '2023-06-01', price: 1305 },
            { date: '2023-07-01', price: 110 },
            { date: '2023-08-01', price: 1125 },
            { date: '2023-09-01', price: 1220 },
            { date: '2023-10-01', price: 125 },
            { date: '2023-11-01', price: 1340 }
            // ... Additional data points
        ];
        cryptoData = [
          { date: '2023-01-01', price: 80 },
          { date: '2023-02-01', price: 85 },
          { date: '2023-03-01', price: 90 },
          { date: '2023-04-01', price: 95 },
          { date: '2023-05-01', price: 100 },
          { date: '2023-06-01', price: 105 },
          { date: '2023-07-01', price: 110 },
          { date: '2023-08-01', price: 115 },
          { date: '2023-09-01', price: 120 },
          { date: '2023-10-01', price: 125 },
          { date: '2023-11-01', price: 130 }
      ];
            break;
        case 'all':
            techData = [
                { date: '2023-01-01', price: 1200 },
                { date: '2023-02-01', price: 1250 },
                { date: '2023-03-01', price: 1300 },
                { date: '2023-04-01', price: 1350 },
                { date: '2023-05-01', price: 1400 },
                // ... Additional data points
            ];
            cryptoData = [
                { date: '2023-01-01', price: 3000 },
                { date: '2023-02-01', price: 2800 },
                { date: '2023-03-01', price: 3200 },
                { date: '2023-04-01', price: 3100 },
                { date: '2023-05-01', price: 3300 },
                // ... Additional data points
            ];
            break;
    }

    return {
        type: 'category',
        summaries: [
            {
                name: 'Tech',
                timelineData: techData
            },
            {
                name: 'Crypto',
                timelineData: cryptoData
            },
            // ... Additional categories
        ]
    };
}


private mockFetchBrokerTimelineData(timeRange: string): PortfolioTimelineSummary {
  let broker1Data: TimelineDataItem[] = [];
  let broker2Data: TimelineDataItem[] = [];

  switch (timeRange) {
      case '7days':
          broker1Data = [
              { date: '2023-11-23', price: 500 },
              { date: '2023-11-24', price: 505 },
              { date: '2023-11-25', price: 510 },
              { date: '2023-11-26', price: 515 },
              { date: '2023-11-27', price: 520 },
              { date: '2023-11-28', price: 525 },
              { date: '2023-11-29', price: 530 }
          ];
          broker2Data = [
              { date: '2023-11-23', price: 600 },
              { date: '2023-11-24', price: 605 },
              { date: '2023-11-25', price: 610 },
              { date: '2023-11-26', price: 615 },
              { date: '2023-11-27', price: 620 },
              { date: '2023-11-28', price: 625 },
              { date: '2023-11-29', price: 630 }
          ];
          break;
      case 'month':
          broker1Data = [
            { date: '2023-11-23', price: 600 },
            { date: '2023-11-24', price: 605 },
            { date: '2023-11-25', price: 610 },
            { date: '2023-11-26', price: 615 },
            { date: '2023-11-27', price: 620 },
            { date: '2023-11-28', price: 625 },
            { date: '2023-11-29', price: 630 }
                    ];
          broker2Data = [
            { date: '2023-11-23', price: 600 },
            { date: '2023-11-24', price: 605 },
            { date: '2023-11-25', price: 610 },
            { date: '2023-11-26', price: 615 },
            { date: '2023-11-27', price: 620 },
            { date: '2023-11-28', price: 625 },
            { date: '2023-11-29', price: 630 }          ];
          break;
      case 'YTD':
          broker1Data = [
            { date: '2023-11-23', price: 600 },
            { date: '2023-11-24', price: 605 },
            { date: '2023-11-25', price: 610 },
            { date: '2023-11-26', price: 615 },
            { date: '2023-11-27', price: 620 },
            { date: '2023-11-28', price: 625 },
            { date: '2023-11-29', price: 630 }          ];
          broker2Data = [
            { date: '2023-11-23', price: 600 },
            { date: '2023-11-24', price: 605 },
            { date: '2023-11-25', price: 610 },
            { date: '2023-11-26', price: 615 },
            { date: '2023-11-27', price: 620 },
            { date: '2023-11-28', price: 625 },
            { date: '2023-11-29', price: 630 }          ];
          break;
      case 'all':
          broker1Data = [
              { date: '2023-01-01', price: 1000 },
              { date: '2023-02-01', price: 1020 },
              { date: '2023-03-01', price: 1040 },
              { date: '2023-04-01', price: 1060 },
              { date: '2023-05-01', price: 1080 },
              // ... Additional data points
          ];
          broker2Data = [
              { date: '2023-01-01', price: 1100 },
              { date: '2023-02-01', price: 1120 },
              { date: '2023-03-01', price: 1140 },
              { date: '2023-04-01', price: 1160 },
              { date: '2023-05-01', price: 1180 },
              // ... Additional data points
          ];
          break;
  }

  return {
      type: 'broker',
      summaries: [
          { name: 'Broker1', timelineData: broker1Data },
          { name: 'Broker2', timelineData: broker2Data },
          // ... Additional brokers
      ]
  };
}

  
  private mockFetchAllTimelineData(timeRange: string): PortfolioTimelineSummary {
    let allData: TimelineDataItem[] = [];

    switch (timeRange) {
      case '7days':
        allData = [
          { date: '2023-11-23', price: 100 },
          { date: '2023-11-24', price: 105 },
          { date: '2023-11-25', price: 110 },
          { date: '2023-11-26', price: 107 },
          { date: '2023-11-27', price: 115 },
          { date: '2023-11-28', price: 120 },
          { date: '2023-11-29', price: 125 }
        ];
        break;
      case 'month':
        allData = [
          { date: '2023-11-01', price: 100 },
          { date: '2023-11-05', price: 104 },
          { date: '2023-11-10', price: 108 },
          { date: '2023-11-15', price: 110 },
          { date: '2023-11-20', price: 115 },
          { date: '2023-11-25', price: 120 },
          { date: '2023-11-30', price: 125 }
        ];
        break;
      case 'YTD':
        allData = [
          { date: '2023-01-01', price: 80 },
          { date: '2023-02-01', price: 85 },
          { date: '2023-03-01', price: 90 },
          { date: '2023-04-01', price: 95 },
          { date: '2023-05-01', price: 100 },
          { date: '2023-06-01', price: 105 },
          { date: '2023-07-01', price: 110 },
          { date: '2023-08-01', price: 115 },
          { date: '2023-09-01', price: 120 },
          { date: '2023-10-01', price: 125 },
          { date: '2023-11-01', price: 130 }
        ];
        break;
      case 'all':
        // Assuming 'all' spans over two years
        allData = [
          { date: '2022-01-01', price: 70 },
          { date: '2022-04-01', price: 75 },
          { date: '2022-07-01', price: 80 },
          { date: '2022-10-01', price: 85 },
          { date: '2023-01-01', price: 90 },
          { date: '2023-04-01', price: 95 },
          { date: '2023-07-01', price: 100 },
          { date: '2023-10-01', price: 105 }
        ];
        break;
}
        return {
          type: 'all',
          summaries: [
            {
              name: 'Total Portfolio',
              timelineData: allData
            }
          ]
        };
      }
  }
  
  
