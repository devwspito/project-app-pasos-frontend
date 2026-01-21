/**
 * CreateGoalModal component for creating new fitness goals.
 * Features form inputs for goal configuration.
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
  IonSpinner,
  IonText,
  IonDatetime,
  IonList,
} from '@ionic/react';
import type { CreateGoalInput, GoalType } from '../../types/goal.types';
import type { TimePeriod } from '../../types/activity.types';

export interface CreateGoalModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Callback when goal is created */
  onCreate: (input: CreateGoalInput) => Promise<boolean>;
}

/** Goal type options */
const GOAL_TYPE_OPTIONS: { value: GoalType; label: string }[] = [
  { value: 'steps', label: 'Steps' },
  { value: 'distance', label: 'Distance (meters)' },
  { value: 'calories', label: 'Calories' },
  { value: 'active_minutes', label: 'Active Minutes' },
  { value: 'streak', label: 'Streak (days)' },
];

/** Period options */
const PERIOD_OPTIONS: { value: TimePeriod; label: string }[] = [
  { value: 'day', label: 'Daily' },
  { value: 'week', label: 'Weekly' },
  { value: 'month', label: 'Monthly' },
  { value: 'year', label: 'Yearly' },
];

/** Default target values by goal type */
const DEFAULT_TARGETS: Record<GoalType, number> = {
  steps: 10000,
  distance: 5000,
  calories: 500,
  active_minutes: 30,
  streak: 7,
};

/**
 * Get today's date in ISO format
 */
function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get date N days from now in ISO format
 */
function getDateFromNowISO(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

/**
 * Modal for creating new fitness goals
 */
export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [goalType, setGoalType] = useState<GoalType>('steps');
  const [targetValue, setTargetValue] = useState<number>(DEFAULT_TARGETS.steps);
  const [period, setPeriod] = useState<TimePeriod>('day');
  const [startDate, setStartDate] = useState<string>(getTodayISO());
  const [endDate, setEndDate] = useState<string>(getDateFromNowISO(30));
  const [isPrimary, setIsPrimary] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  /**
   * Reset form to defaults
   */
  const resetForm = useCallback(() => {
    setTitle('');
    setDescription('');
    setGoalType('steps');
    setTargetValue(DEFAULT_TARGETS.steps);
    setPeriod('day');
    setStartDate(getTodayISO());
    setEndDate(getDateFromNowISO(30));
    setIsPrimary(false);
    setSubmitting(false);
    setValidationError(null);
  }, []);

  /**
   * Handle goal type change - update default target
   */
  const handleGoalTypeChange = (type: GoalType) => {
    setGoalType(type);
    setTargetValue(DEFAULT_TARGETS[type]);
  };

  /**
   * Validate form inputs
   */
  const validateForm = (): boolean => {
    if (!title.trim()) {
      setValidationError('Please enter a goal title');
      return false;
    }
    if (targetValue <= 0) {
      setValidationError('Target value must be greater than 0');
      return false;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setValidationError('End date must be after start date');
      return false;
    }
    setValidationError(null);
    return true;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const input: CreateGoalInput = {
        title: title.trim(),
        description: description.trim() || undefined,
        type: goalType,
        targetValue,
        period,
        startDate,
        endDate,
        isPrimary,
      };

      const success = await onCreate(input);
      if (success) {
        resetForm();
        onClose();
      } else {
        setValidationError('Failed to create goal. Please try again.');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      setValidationError('An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Handle modal close
   */
  const handleClose = () => {
    resetForm();
    onClose();
  };

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
              strong
              onClick={handleSubmit}
              disabled={submitting || !title.trim()}
            >
              {submitting ? <IonSpinner name="crescent" /> : 'Create'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {validationError && (
          <div style={{ padding: '0.5rem 0', marginBottom: '0.5rem' }}>
            <IonText color="danger">
              <p style={{ margin: 0 }}>{validationError}</p>
            </IonText>
          </div>
        )}

        <IonList>
          <IonItem>
            <IonLabel position="stacked">Goal Title *</IonLabel>
            <IonInput
              value={title}
              onIonInput={(e) => setTitle(e.detail.value || '')}
              placeholder="e.g., Walk 10,000 steps daily"
              disabled={submitting}
              maxlength={100}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Description</IonLabel>
            <IonTextarea
              value={description}
              onIonInput={(e) => setDescription(e.detail.value || '')}
              placeholder="Optional description for your goal"
              disabled={submitting}
              rows={3}
              maxlength={500}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Goal Type *</IonLabel>
            <IonSelect
              value={goalType}
              onIonChange={(e) => handleGoalTypeChange(e.detail.value as GoalType)}
              disabled={submitting}
              interface="popover"
            >
              {GOAL_TYPE_OPTIONS.map((option) => (
                <IonSelectOption key={option.value} value={option.value}>
                  {option.label}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Target Value *</IonLabel>
            <IonInput
              type="number"
              value={targetValue}
              onIonInput={(e) => setTargetValue(parseInt(e.detail.value || '0', 10))}
              placeholder="Enter target value"
              disabled={submitting}
              min={1}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Period *</IonLabel>
            <IonSelect
              value={period}
              onIonChange={(e) => setPeriod(e.detail.value as TimePeriod)}
              disabled={submitting}
              interface="popover"
            >
              {PERIOD_OPTIONS.map((option) => (
                <IonSelectOption key={option.value} value={option.value}>
                  {option.label}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Start Date *</IonLabel>
            <IonDatetime
              value={startDate}
              onIonChange={(e) => setStartDate(
                typeof e.detail.value === 'string'
                  ? e.detail.value.split('T')[0]
                  : getTodayISO()
              )}
              presentation="date"
              disabled={submitting}
              min={getTodayISO()}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">End Date *</IonLabel>
            <IonDatetime
              value={endDate}
              onIonChange={(e) => setEndDate(
                typeof e.detail.value === 'string'
                  ? e.detail.value.split('T')[0]
                  : getDateFromNowISO(30)
              )}
              presentation="date"
              disabled={submitting}
              min={startDate}
            />
          </IonItem>

          <IonItem>
            <IonLabel>Set as Primary Goal</IonLabel>
            <IonSelect
              value={isPrimary ? 'yes' : 'no'}
              onIonChange={(e) => setIsPrimary(e.detail.value === 'yes')}
              disabled={submitting}
              interface="popover"
            >
              <IonSelectOption value="no">No</IonSelectOption>
              <IonSelectOption value="yes">Yes</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default CreateGoalModal;
