import { useState } from 'react';
import SketchInput from './components/SketchInput';
import SketchDashboard from './components/SketchDashboard';
import axios from 'axios';

function App() {
  const [isLoading, setIsLoading] = useState(false);

  const handleBrainDump = async (rawText) => {
    setIsLoading(true);
    try {
      await axios.post('/api/translate', { rawText });
    } catch (error) {
      alert('Oops! The pencil broke. Try again?');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontFamily: 'Caveat', 
          fontSize: '64px', 
          margin: 0, 
          borderBottom: '4px solid #2c3e50',
          display: 'inline-block',
          paddingRight: '20px',
          transform: 'rotate(-1deg)'
        }}>
          📋 Context-Sync
        </h1>
        <p style={{ fontFamily: 'Patrick Hand', fontSize: '20px', opacity: 0.8 }}>
          Async updates that don't feel like homework.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        <div>
          <SketchInput onSubmit={handleBrainDump} isLoading={isLoading} />
        </div>
        <div>
          <SketchDashboard />
        </div>
      </div>
    </div>
  );
}

export default App;