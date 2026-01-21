import React from 'react';
import { IonText, IonSkeletonText } from '@ionic/react';
import { ProgressRing } from './ProgressRing';
import './StepCounter.css';

export interface StepCounterProps {
  steps: number;
  dailyGoal?: number;
  loading?: boolean;
}

export const StepCounter: React.FC<StepCounterProps> = ({
  steps,
  dailyGoal = 10000,
  loading = false
}) => {
  const percentage = Math.min((steps / dailyGoal) * 100, 100);
  const remaining = Math.max(dailyGoal - steps, 0);

  if (loading) {
    return (
      <div className="step-counter">
        <IonSkeletonText animated style={{ width: '200px', height: '200px', borderRadius: '50%' }} />
      </div>
    );
  }

  return (
    <div className="step-counter">
      <ProgressRing progress={percentage} size={220} strokeWidth={14}>
        <IonText color="dark" className="step-count">
          <h1>{steps.toLocaleString()}</h1>
        </IonText>
        <IonText color="medium" className="step-label">
          <p>steps today</p>
        </IonText>
      </ProgressRing>
      <div className="step-details">
        <IonText color="primary">
          <span className="percentage">{Math.round(percentage)}%</span>
        </IonText>
        <IonText color="medium">
          <span className="remaining">{remaining.toLocaleString()} to go</span>
        </IonText>
      </div>
    </div>
  );
};
