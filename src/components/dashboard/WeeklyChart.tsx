import React, { useState, useMemo } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSkeletonText,
} from '@ionic/react';
import type { SegmentChangeEventDetail } from '@ionic/react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import type { ChartOptions, ChartData } from 'chart.js';
import { format, parseISO } from 'date-fns';
import './WeeklyChart.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

/**
 * Data structure for weekly trend results
 */
export interface WeeklyTrendResult {
  /** Date string in ISO format (YYYY-MM-DD) */
  date: string;
  /** Total steps for that day */
  total: number;
}

/**
 * Props for WeeklyChart component
 */
export interface WeeklyChartProps {
  /** Array of weekly trend data points */
  data: WeeklyTrendResult[];
  /** Whether the component is in loading state */
  loading?: boolean;
}

/** Chart type options */
type ChartType = 'bar' | 'line';

/**
 * WeeklyChart - Displays a weekly trend chart with bar/line toggle
 *
 * Shows step data for the last 7 days with options to view as
 * either a bar chart or line chart. Uses Chart.js for rendering.
 *
 * @example
 * ```tsx
 * const weeklyData = [
 *   { date: '2024-01-15', total: 8500 },
 *   { date: '2024-01-16', total: 10200 },
 *   // ... more days
 * ];
 *
 * <WeeklyChart data={weeklyData} loading={false} />
 * ```
 */
export const WeeklyChart: React.FC<WeeklyChartProps> = ({
  data,
  loading = false,
}) => {
  const [chartType, setChartType] = useState<ChartType>('bar');

  // Transform data labels
  const labels = useMemo(
    () =>
      data.map((d) => {
        try {
          return format(parseISO(d.date), 'EEE');
        } catch {
          return d.date.slice(-2); // Fallback to last 2 chars if parse fails
        }
      }),
    [data]
  );

  // Transform data values
  const values = useMemo(() => data.map((d) => d.total), [data]);

  // Bar chart data
  const barChartData: ChartData<'bar'> = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Steps',
          data: values,
          backgroundColor: 'rgba(56, 128, 255, 0.6)',
          borderColor: 'rgba(56, 128, 255, 1)',
          borderWidth: 2,
        },
      ],
    }),
    [labels, values]
  );

  // Line chart data
  const lineChartData: ChartData<'line'> = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: 'Steps',
          data: values,
          backgroundColor: 'rgba(56, 128, 255, 0.6)',
          borderColor: 'rgba(56, 128, 255, 1)',
          borderWidth: 2,
          tension: 0.3,
          fill: false,
        },
      ],
    }),
    [labels, values]
  );

  // Bar chart options
  const barOptions: ChartOptions<'bar'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `${(context.raw as number).toLocaleString()} steps`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) =>
              typeof value === 'number' ? value.toLocaleString() : value,
          },
        },
      },
    }),
    []
  );

  // Line chart options
  const lineOptions: ChartOptions<'line'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `${(context.raw as number).toLocaleString()} steps`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) =>
              typeof value === 'number' ? value.toLocaleString() : value,
          },
        },
      },
    }),
    []
  );

  // Handle segment change with proper Ionic typing
  const handleSegmentChange = (e: CustomEvent<SegmentChangeEventDetail>) => {
    const value = e.detail.value;
    if (value === 'bar' || value === 'line') {
      setChartType(value);
    }
  };

  // Loading state
  if (loading) {
    return (
      <IonCard className="weekly-chart">
        <IonCardHeader>
          <IonCardTitle>Weekly Trend</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonSkeletonText
            animated
            style={{ height: '200px', width: '100%' }}
          />
        </IonCardContent>
      </IonCard>
    );
  }

  // Empty state
  if (data.length === 0) {
    return (
      <IonCard className="weekly-chart">
        <IonCardHeader>
          <IonCardTitle>Weekly Trend</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <div className="weekly-chart-empty">
            <p>No data available for the past week</p>
          </div>
        </IonCardContent>
      </IonCard>
    );
  }

  return (
    <IonCard className="weekly-chart">
      <IonCardHeader>
        <IonCardTitle>Weekly Trend</IonCardTitle>
        <IonSegment value={chartType} onIonChange={handleSegmentChange}>
          <IonSegmentButton value="bar">
            <IonLabel>Bar</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="line">
            <IonLabel>Line</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </IonCardHeader>
      <IonCardContent>
        <div
          className="chart-container"
          role="img"
          aria-label={`Weekly steps chart showing ${data.length} days of data`}
        >
          {chartType === 'bar' ? (
            <Bar data={barChartData} options={barOptions} />
          ) : (
            <Line data={lineChartData} options={lineOptions} />
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default WeeklyChart;
