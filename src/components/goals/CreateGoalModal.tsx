/**
 * CreateGoalModal component for creating new fitness goals.
 * Features form validation and goal type selection.
 */

import React, { useState, useCallback } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonDatetimeButton,
  IonSpinner,
  IonToggle,
  IonText,
  IonList,
  IonNote,
} from '@ionic/react';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import type { CreateGoalInput, GoalType } from '../../types/goal.types';
import type { TimePeriod } from '../../types/activity.types';

/**
 * Goal type options for selection
 */
const GOAL_TYPES: { value: GoalType; label: string; unit: string }[] = [
  { value: 'steps', label: 'Steps', unit: 'steps' },
  { value: 'distance', label: 'Distance', unit: 'meters' },
  { value: 'calories', label: 'Calories', unit: 'kcal' },
  { value: 'active_minutes', label: 'Active Minutes', unit: 'minutes' },
  { value: 'streak', label: 'Streak', unit: 'days' },
];

/**
 * Time period options for goal duration
 */
const TIME_PERIODS: { value: TimePeriod; label: string }[] = [
  { value: 'day', label: 'Daily' },
  { value: 'week', label: 'Weekly' },
  { value: 'month', label: 'Monthly' },
  { value: 'year', label: 'Yearly' },
];

/**
 * Default target values by goal type
 */
const DEFAULT_TARGETS: Record<GoalType, number> = {
  steps: 10000,
  distance: 5000, // 5km in meters
  calories: 500,
  active_minutes: 30,
  streak: 7, // 7 days
};

/**
 * Form validation errors
 */
interface FormErrors {
  title?: string;
  type?: string;
  targetValue?: string;
  period?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateGoalModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Function to create a goal */
  onCreate: (data: CreateGoalInput) => Promise<boolean>;
}

/**
 * Modal for creating a new fitness goal with form validation
 */
export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<GoalType>('steps');
  const [targetValue, setTargetValue] = useState<number>(DEFAULT_TARGETS.steps);
  const [period, setPeriod] = useState<TimePeriod>('week');
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(addWeeks(new Date(), 1), 'yyyy-MM-dd'));
  const [isPrimary, setIsPrimary] = useState(false);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  /**
   * Reset form to default state
   */
  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setType('steps');
    setTargetValue(DEFAULT_TARGETS.steps);
    setPeriod('week');
    setStartDate(format(new Date(), 'yyyy-MM-dd'));
    setEndDate(format(addWeeks(new Date(), 1), 'yyyy-MM-dd'));
    setIsPrimary(false);
    setErrors({});
    setSubmitting(false);
  }, []);

  /**
   * Handle goal type change - update default target value
   */
  const handleTypeChange = useCallback((newType: GoalType) => {
    setType(newType);
    setTargetValue(DEFAULT_TARGETS[newType]);
  }, []);

  /**
   * Handle period change - auto-adjust end date
   */
  const handlePeriodChange = useCallback((newPeriod: TimePeriod) => {
    setPeriod(newPeriod);
    const start = new Date(startDate);
    let newEndDate: Date;

    switch (newPeriod) {
      case 'day':
        newEndDate = addDays(start, 1);
        break;
      case 'week':
        newEndDate = addWeeks(start, 1);
        break;
      case 'month':
        newEndDate = addMonths(start, 1);
        break;
      case 'year':
        newEndDate = addMonths(start, 12);
        break;
      default:
        newEndDate = addWeeks(start, 1);
    }

    setEndDate(format(newEndDate, 'yyyy-MM-dd'));
  }, [startDate]);

  /**
   * Handle start date change - validate end date is after
   */
  const handleStartDateChange = useCallback((newStartDate: string) => {
    setStartDate(newStartDate);
    const start = new Date(newStartDate);
    const end = new Date(endDate);

    // If end date is before or equal to start date, adjust it
    if (end <= start) {
      setEndDate(format(addWeeks(start, 1), 'yyyy-MM-dd'));
    }
  }, [endDate]);

  /**
   * Validate the form
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (title.trim().length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    // Target value validation
    if (!targetValue || targetValue <= 0) {
      newErrors.targetValue = 'Target must be a positive number';
    } else if (targetValue > 1000000) {
      newErrors.targetValue = 'Target value is too large';
    }

    // Date validation
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime())) {
      newErrors.startDate = 'Invalid start date';
    }

    if (isNaN(end.getTime())) {
      newErrors.endDate = 'Invalid end date';
    } else if (end <= start) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [title, targetValue, startDate, endDate]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const goalData: CreateGoalInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        targetValue,
        period,
        startDate,
        endDate,
        isPrimary,
      };

      const success = await onCreate(goalData);
      if (success) {
        resetForm();
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  }, [
    validateForm,
    title,
    description,
    type,
    targetValue,
    period,
    startDate,
    endDate,
    isPrimary,
    onCreate,
    resetForm,
    onClose,
  ]);

  /**
   * Handle modal close
   */
  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  /**
   * Get unit label for current goal type
   */
  const getUnitLabel = useCallback((): string => {
    const goalType = GOAL_TYPES.find(g => g.value === type);
    return goalType?.unit || '';
  }, [type]);

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Goal</IonTitle>
          <IonButtons slot="start">
            <IonButton onClick={handleClose} disabled={submitting}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              onClick={handleSubmit}
              disabled={submitting}
              strong
            >
              {submitting ? <IonSpinner name="crescent" /> : 'Create'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonList>
          {/* Title Input */}
          <IonItem className={errors.title ? 'ion-invalid' : ''}>
            <IonLabel position="stacked">Goal Title *</IonLabel>
            <IonInput
              value={title}
              onIonInput={(e) => setTitle(e.detail.value || '')}
              placeholder="e.g., Walk 10,000 steps daily"
              disabled={submitting}
              maxlength={100}
            />
            {errors.title && (
              <IonNote slot="error" color="danger">
                {errors.title}
              </IonNote>
            )}
          </IonItem>

          {/* Description Input */}
          <IonItem>
            <IonLabel position="stacked">Description (optional)</IonLabel>
            <IonTextarea
              value={description}
              onIonInput={(e) => setDescription(e.detail.value || '')}
              placeholder="Add any notes about this goal..."
              disabled={submitting}
              rows={3}
              maxlength={500}
            />
          </IonItem>

          {/* Goal Type Selection */}
          <IonItem>
            <IonLabel position="stacked">Goal Type *</IonLabel>
            <IonSelect
              value={type}
              onIonChange={(e) => handleTypeChange(e.detail.value as GoalType)}
              interface="action-sheet"
              disabled={submitting}
            >
              {GOAL_TYPES.map((goalType) => (
                <IonSelectOption key={goalType.value} value={goalType.value}>
                  {goalType.label}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          {/* Target Value Input */}
          <IonItem className={errors.targetValue ? 'ion-invalid' : ''}>
            <IonLabel position="stacked">Target ({getUnitLabel()}) *</IonLabel>
            <IonInput
              type="number"
              value={targetValue}
              onIonInput={(e) => setTargetValue(Number(e.detail.value) || 0)}
              disabled={submitting}
              min={1}
              max={1000000}
            />
            {errors.targetValue && (
              <IonNote slot="error" color="danger">
                {errors.targetValue}
              </IonNote>
            )}
          </IonItem>

          {/* Time Period Selection */}
          <IonItem>
            <IonLabel position="stacked">Period *</IonLabel>
            <IonSelect
              value={period}
              onIonChange={(e) => handlePeriodChange(e.detail.value as TimePeriod)}
              interface="action-sheet"
              disabled={submitting}
            >
              {TIME_PERIODS.map((p) => (
                <IonSelectOption key={p.value} value={p.value}>
                  {p.label}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          {/* Start Date */}
          <IonItem className={errors.startDate ? 'ion-invalid' : ''}>
            <IonLabel position="stacked">Start Date *</IonLabel>
            <IonDatetimeButton datetime="start-date" />
            <IonModal keepContentsMounted>
              <IonDatetime
                id="start-date"
                presentation="date"
                value={startDate}
                onIonChange={(e) => handleStartDateChange(e.detail.value as string)}
                disabled={submitting}
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </IonModal>
            {errors.startDate && (
              <IonNote slot="error" color="danger">
                {errors.startDate}
              </IonNote>
            )}
          </IonItem>

          {/* End Date */}
          <IonItem className={errors.endDate ? 'ion-invalid' : ''}>
            <IonLabel position="stacked">End Date *</IonLabel>
            <IonDatetimeButton datetime="end-date" />
            <IonModal keepContentsMounted>
              <IonDatetime
                id="end-date"
                presentation="date"
                value={endDate}
                onIonChange={(e) => setEndDate(e.detail.value as string)}
                disabled={submitting}
                min={format(addDays(new Date(startDate), 1), 'yyyy-MM-dd')}
              />
            </IonModal>
            {errors.endDate && (
              <IonNote slot="error" color="danger">
                {errors.endDate}
              </IonNote>
            )}
          </IonItem>

          {/* Primary Goal Toggle */}
          <IonItem>
            <IonLabel>Set as Primary Goal</IonLabel>
            <IonToggle
              checked={isPrimary}
              onIonChange={(e) => setIsPrimary(e.detail.checked)}
              disabled={submitting}
            />
          </IonItem>
        </IonList>

        {/* Info Text */}
        <div style={{ padding: '1rem', marginTop: '1rem' }}>
          <IonText color="medium">
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              * Required fields. Your primary goal will be displayed prominently on your dashboard.
            </p>
          </IonText>
        </div>
      </IonContent>
    </IonModal>
  );
};
