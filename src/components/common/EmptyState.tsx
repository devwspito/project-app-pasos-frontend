import { IonButton, IonCard, IonCardContent, IonIcon } from '@ionic/react';

/**
 * Props for EmptyState component
 */
export interface EmptyStateProps {
  /** Ionicon name to display (from ionicons/icons) */
  icon: string;
  /** Main title text */
  title: string;
  /** Optional description text */
  description?: string;
  /** Optional action button label */
  actionLabel?: string;
  /** Optional callback when action button is clicked */
  onAction?: () => void;
  /** Optional custom class name for the container */
  className?: string;
}

/**
 * EmptyState - A component for displaying empty data scenarios
 *
 * Uses IonCard for consistent styling with configurable icon, title,
 * description, and optional action button.
 *
 * @example
 * ```tsx
 * // Basic empty state
 * <EmptyState
 *   icon={documentsOutline}
 *   title="No documents"
 * />
 *
 * // With description
 * <EmptyState
 *   icon={peopleOutline}
 *   title="No friends yet"
 *   description="Start by inviting your friends to join you!"
 * />
 *
 * // With action button
 * <EmptyState
 *   icon={flagOutline}
 *   title="No goals"
 *   description="Set your first goal to get started."
 *   actionLabel="Create Goal"
 *   onAction={() => navigate('/goals/create')}
 * />
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <IonCard className={`empty-state-card ${className}`.trim()}>
      <IonCardContent>
        <div className="empty-state">
          <IonIcon
            icon={icon}
            className="empty-state-icon"
            aria-hidden="true"
          />
          <h4 className="empty-state-title">{title}</h4>
          {description && (
            <p className="empty-state-description">{description}</p>
          )}
          {actionLabel && onAction && (
            <IonButton
              onClick={onAction}
              color="primary"
              size="default"
              className="mt-md"
            >
              {actionLabel}
            </IonButton>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
}
