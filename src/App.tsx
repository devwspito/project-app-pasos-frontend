import { IonApp, setupIonicReact } from '@ionic/react';

/* Core Ionic CSS */
import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme CSS - must come after Ionic CSS */
import './theme/variables.css';
import './theme/global.css';

/* App Router */
import { AppRouter } from './router';

/* Initialize Ionic React - MUST be called before any Ionic components render */
setupIonicReact();

/**
 * Root App component.
 * Wraps the application with IonApp and includes the AppRouter for navigation.
 */
const App: React.FC = () => (
  <IonApp>
    <AppRouter />
  </IonApp>
);

export default App;
