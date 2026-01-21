import { useState, useMemo } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonModal,
  IonDatetime,
  IonSkeletonText,
} from '@ionic/react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { calendarOutline } from 'ionicons/icons';
import { format } from 'date-fns';
import './HourlyChart.css';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

/**
 * Hourly activity data point
 */
export interface HourlyPeakResult {
  hour: number;
  total: number;
}

/**
 * Props for HourlyChart component
 */
export interface HourlyChartProps {
  /** Array of hourly step data */
  data: HourlyPeakResult[];
  /** Loading state indicator */
  loading?: boolean;
  /** Currently selected date in ISO format */
  selectedDate: string;
  /** Callback when date is changed */
  onDateChange: (date: string) => void;
}

/**
 * HourlyChart - Displays hourly step distribution with date picker
 *
 * Shows a bar chart with 24 hours of step activity data.
 * Peak hours (top 3) are highlighted in a different color.
 * Includes a date picker to select different days.
 *
 * @example
 * ```tsx
 * const data = [{ hour: 8, total: 1500 }, { hour: 12, total: 2000 }];
 * const [selectedDate, setSelectedDate] = useState(new Date().toISOString());
 *
 * <HourlyChart
 *   data={data}
 *   loading={false}
 *   selectedDate={selectedDate}
 *   onDateChange={setSelectedDate}
 * />
 * ```
 */
export function HourlyChart({
  data,
  loading = false,
  selectedDate,
  onDateChange,
}: HourlyChartProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fill all 24 hours with data (missing hours get 0)
  const fullData = useMemo(() => {
    const hourMap = new Map(data.map((d) => [d.hour, d.total]));
    return Array.from({ length: 24 }, (_, i) => hourMap.get(i) || 0);
  }, [data]);

  // Find peak hours (top 3 by total steps)
  const peakHours = useMemo(() => {
    if (data.length === 0) return new Set<number>();
    const sorted = [...data].sort((a, b) => b.total - a.total);
    const topThree = sorted.slice(0, 3).filter((d) => d.total > 0);
    return new Set(topThree.map((d) => d.hour));
  }, [data]);

  // Chart data with peak hours highlighted
  const chartData: ChartData<'bar'> = useMemo(() => {
    return {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [
        {
          label: 'Steps',
          data: fullData,
          backgroundColor: fullData.map((_, i) =>
            peakHours.has(i)
              ? 'rgba(255, 196, 9, 0.8)' // Gold for peak hours
              : 'rgba(56, 128, 255, 0.6)' // Blue for regular hours
          ),
          borderRadius: 4,
        },
      ],
    };
  }, [fullData, peakHours]);

  // Chart options
  const chartOptions: ChartOptions<'bar'> = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.parsed.y ?? 0;
              return `${value.toLocaleString()} steps`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => {
              if (typeof value === 'number') {
                return value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value;
              }
              return value;
            },
          },
        },
        x: {
          ticks: {
            maxRotation: 45,
            minRotation: 45,
          },
        },
      },
    }),
    []
  );

  // Format the selected date for display
  const formattedDate = useMemo(() => {
    try {
      return format(new Date(selectedDate), 'MMM d');
    } catch {
      return 'Select date';
    }
  }, [selectedDate]);

  // Handle date selection
  const handleDateChange = (event: CustomEvent) => {
    const value = event.detail.value;
    if (typeof value === 'string') {
      onDateChange(value);
      setShowDatePicker(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <IonCard className="hourly-chart">
        <IonCardHeader>
          <IonCardTitle>Hourly Activity</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonSkeletonText animated style={{ height: '200px', width: '100%' }} />
        </IonCardContent>
      </IonCard>
    );
  }

  return (
    <IonCard className="hourly-chart">
      <IonCardHeader>
        <div className="hourly-chart-header-row">
          <IonCardTitle>Hourly Activity</IonCardTitle>
          <IonButton
            fill="clear"
            size="small"
            onClick={() => setShowDatePicker(true)}
            aria-label="Select date"
          >
            <IonIcon slot="start" icon={calendarOutline} />
            {formattedDate}
          </IonButton>
        </div>
      </IonCardHeader>
      <IonCardContent>
        <div className="hourly-chart-container">
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="hourly-chart-legend">
          <span className="hourly-chart-peak-indicator" aria-hidden="true" />
          <span>Peak hours</span>
        </div>
      </IonCardContent>

      <IonModal isOpen={showDatePicker} onDidDismiss={() => setShowDatePicker(false)}>
        <IonDatetime
          presentation="date"
          value={selectedDate}
          onIonChange={handleDateChange}
          max={new Date().toISOString()}
          showDefaultButtons
        />
      </IonModal>
    </IonCard>
  );
}
