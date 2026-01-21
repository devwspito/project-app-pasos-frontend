/**
 * CreateGoalModal component for creating new group goals.
 * Features form validation and date pickers.
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
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonDatetime,
  IonSpinner,
  IonText,
} from '@ionic/react';
import type { CreateGroupGoalPayload } from '../../types/goal';

/**
 * Props for CreateGoalModal component
 */
export interface CreateGoalModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** Function to create a goal */
  onCreate: (payload: CreateGroupGoalPayload) => Promise<boolean>;
}

/**
 * Format date to YYYY-MM-DD
 */
const formatDateToISO = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Get today's date as YYYY-MM-DD
 */
const getToday = (): string => {
  return formatDateToISO(new Date());
};

/**
 * Get date 7 days from now as YYYY-MM-DD
 */
const getDefaultEndDate = (): string => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return formatDateToISO(date);
};

/**
 * Modal for creating new group goals
 */
export const CreateGoalModal: React.FC<CreateGoalModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetSteps, setTargetSteps] = useState<number>(10000);
  const [startDate, setStartDate] = useState<string>(getToday());
  const [endDate, setEndDate] = useState<string>(getDefaultEndDate());
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Validate form inputs
   */
  const validateForm = useCallback((): string | null => {
    if (!name.trim()) {
      return 'Please enter a goal name';
    }
    if (name.trim().length < 3) {
      return 'Goal name must be at least 3 characters';
    }
    if (targetSteps < 100) {
      return 'Target steps must be at least 100';
    }
    if (targetSteps > 1000000) {
      return 'Target steps cannot exceed 1,000,000';
    }
    if (!startDate) {
      return 'Please select a start date';
    }
    if (!endDate) {
      return 'Please select an end date';
    }
    if (new Date(endDate) <= new Date(startDate)) {
      return 'End date must be after start date';
    }
    return null;
  }, [name, targetSteps, startDate, endDate]);

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setCreating(true);
    setError(null);

    const payload: CreateGroupGoalPayload = {
      name: name.trim(),
      description: description.trim() || undefined,
      targetSteps,
      startDate,
      endDate,
    };

    try {
      const success = await onCreate(payload);
      if (success) {
        handleClose();
      } else {
        setError('Failed to create goal. Please try again.');
      }
    } catch (err) {
      setError('Failed to create goal. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  /**
   * Reset state when modal closes
   */
  const handleClose = () => {
    setName('');
    setDescription('');
    setTargetSteps(10000);
    setStartDate(getToday());
    setEndDate(getDefaultEndDate());
    setCreating(false);
    setError(null);
    onClose();
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Create Goal</IonTitle>
          <IonButtons slot="start">
            <IonButton onClick={handleClose} disabled={creating}>
              Cancel
            </IonButton>
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              onClick={handleSubmit}
              disabled={creating || !name.trim()}
              strong
            >
              {creating ? <IonSpinner name="dots" /> : 'Create'}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {error && (
          <div style={{ marginBottom: '1rem' }}>
            <IonText color="danger">
              <p style={{ margin: 0 }}>{error}</p>
            </IonText>
          </div>
        )}

        <IonList>
          <IonItem>
            <IonLabel position="stacked">Goal Name *</IonLabel>
            <IonInput
              value={name}
              placeholder="e.g., Summer Step Challenge"
              onIonInput={(e) => setName(e.detail.value || '')}
              disabled={creating}
              maxlength={100}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Description (optional)</IonLabel>
            <IonTextarea
              value={description}
              placeholder="Describe your goal..."
              onIonInput={(e) => setDescription(e.detail.value || '')}
              disabled={creating}
              rows={3}
              maxlength={500}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Target Steps *</IonLabel>
            <IonInput
              type="number"
              value={targetSteps}
              placeholder="10000"
              onIonInput={(e) => setTargetSteps(parseInt(e.detail.value || '0', 10) || 0)}
              disabled={creating}
              min={100}
              max={1000000}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Start Date *</IonLabel>
            <IonDatetime
              presentation="date"
              value={startDate}
              onIonChange={(e) => {
                const value = e.detail.value;
                if (typeof value === 'string') {
                  setStartDate(value.split('T')[0]);
                }
              }}
              disabled={creating}
              min={getToday()}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">End Date *</IonLabel>
            <IonDatetime
              presentation="date"
              value={endDate}
              onIonChange={(e) => {
                const value = e.detail.value;
                if (typeof value === 'string') {
                  setEndDate(value.split('T')[0]);
                }
              }}
              disabled={creating}
              min={startDate || getToday()}
            />
          </IonItem>
        </IonList>

        <div style={{ padding: '1rem', color: 'var(--ion-color-medium)' }}>
          <p style={{ fontSize: '0.875rem', margin: 0 }}>
            * Required fields. After creating your goal, you can invite friends to join!
          </p>
        </div>
      </IonContent>
    </IonModal>
  );
};
