import { Component, OnInit } from '@angular/core';
import { ChartDataItem } from '../../models/ChartDataItem';
import { TimelineSummary } from 'src/app/models/TimelineSummary';
import { Chart, registerables } from 'chart.js';
import { TimelineDataItem } from 'src/app/models/TimelineDataItem';
import { ClassificationService } from 'src/app/services/classification.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { PriceService } from 'src/app/services/price.service';

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
  public showCategoryData = true; // Toggle between category and broker data
  private currentView: 'all' | 'category' | 'broker' = 'all'; // default view
  public currentTimeSpan: '7days' | 'month' | 'YTD' = '7days';
  public chartData: ChartDataItem[] = []; // Initialize with an empty array
  public timeLinePrices: TimelineSummary = {
    name: '',
    components: [],
    prices: [],
  };
  constructor(private classificationService: ClassificationService, private activatedRoute: ActivatedRoute, private priceService: PriceService,
  ) { }

  ngOnInit(): void {
    this.chartData = (this.activatedRoute.snapshot.data as any).welcome;
    this.updatePieChart(this.chartData);
    this.updateTimelineChart(this.currentTimeSpan);
  }

  private updateTimelineChart(timeRange: string): void {
    this.fetchTimelineData(this.currentView);
    if (this.timeLinePrices != null)
      this.filterAndRenderTimelineChart(this.currentTimeSpan);
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

  private renderTimelineChart(portfolioData: TimelineSummary): void {
    const datasets = portfolioData.components?.map(summary => {
      return {
        label: summary.name,
        data: summary.prices.map(item => ({ x: item.date, y: item.price })),
      };
    }) || [];

    if (portfolioData.prices && portfolioData.prices.length > 0) {
      const pricesDataset = {
        label: 'Overall Prices', // Assuming you want to label this dataset as such
        data: portfolioData.prices.map(price => ({ x: price.date, y: price.price })),
      };
      datasets.push(pricesDataset); // Add this dataset to the existing datasets array
    }
    const chartData = { datasets };

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
    console.log('onTimeSpanChange');
    const selectedValue = this.timeform.get('timeSelector')?.value ?? '7days';
    this.currentTimeSpan = selectedValue as '7days' | 'month' | 'YTD';
    this.filterAndRenderTimelineChart(this.currentTimeSpan);
  }

  private filterAndRenderTimelineChart(timeSpan: '7days' | 'month' | 'YTD'): void {
    const now = new Date();
    let startDate: Date;
    switch (timeSpan) {
      case '7days':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'YTD':
        startDate = new Date(new Date().getFullYear(), 0, 1);
        break;
    }
  
    let filteredData: TimelineSummary = JSON.parse(JSON.stringify(this.timeLinePrices));
  
    // Check and filter prices if not null or undefined
    if (filteredData.prices) {
      filteredData.prices = filteredData.prices.filter(price => new Date(price.date) >= startDate);
    }
  
    if (this.currentView !== 'all' && filteredData.components) {
      const filterNestedComponents = (nestedComponents: TimelineSummary[]) => {
        nestedComponents.forEach(nestedComponent => {
          // Check and filter nestedComponent.prices if not null or undefined
          if (nestedComponent.prices) {
            nestedComponent.prices = nestedComponent.prices.filter(price => new Date(price.date) >= startDate);
          }
          // Recursively filter any nested components
          if (nestedComponent.components) {
            filterNestedComponents(nestedComponent.components);
          }
        });
      };
  
      filteredData.components.forEach(component => {
        // Check and filter component.prices if not null or undefined
        if (component.prices) {
          component.prices = component.prices.filter(price => new Date(price.date) >= startDate);
        }
        // Apply filtering to nested components if any
        if (component.components) {
          filterNestedComponents(component.components);
        }
      });
    }
  
    this.renderTimelineChart(filteredData);
  }
  
  

    private fetchTimelineData(view: 'all' | 'category' | 'broker'): void {
      this.priceService.fetchTimelineSummary(view).subscribe({
        next: (data) => {
          this.timeLinePrices = this.transformToPortfolioSummary(data);
        },
        error: (error) => console.error('Error fetching timeline data:', error)
      });
    }

  private transformToPortfolioSummary(data: any): TimelineSummary {
    // Check if data and summaries exist
    if (!data) {
      // Handle the case where data or summaries are missing or not an array
      return { name: 'all', components: [], prices: [] };
    }

    if (data.name == 'all') {
      return {
        name: data.name,
        prices: data.prices,
        components: []
      }
    }

    return {
      name: data.name,
      prices: data.prices,
      components: data.components.map((summary: any) => {

        if (!summary || !summary.prices || !Array.isArray(summary.prices)) {
          // Handle the case where timelineData is missing or not an array
          return { name: 'all', prices: [] };
        }
        return {
          name: summary.name,
          prices: summary.prices.map((item: any) => {
            return {
              date: item.date,
              price: item.price
            };
          })
        };
      })
    };
  }
}