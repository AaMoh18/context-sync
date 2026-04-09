import { useState } from 'react';
import { motion } from 'framer-motion';

export default function SketchInput({ onSubmit, isLoading }) {
  const [dump, setDump] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dump.trim()) onSubmit(dump);
  };

  return (
    <motion.div 
      className="sketch-card"
      initial={{ rotate: -1, opacity: 0 }}
      animate={{ rotate: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{ fontSize: '24px' }}>✏️</span>
        <h2 style={{ margin: 0, fontFamily: 'Caveat', borderBottom: '2px dashed #aaa', paddingBottom: '4px' }}>
          Brain Dump / Scribble Pad
        </h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={dump}
          onChange={(e) => setDump(e.target.value)}
          placeholder="Fixed the auth race condition... working on UI tweaks... blocked by CORS issue..."
          style={{
            width: '100%',
            minHeight: '140px',
            padding: '16px',
            background: '#fffcf5',
            border: '2px solid #2c3e50',
            borderRadius: '15px 5px 15px 5px',
            fontFamily: 'Patrick Hand',
            fontSize: '18px',
            resize: 'vertical',
            boxSizing: 'border-box',
            outline: 'none',
            lineHeight: '1.6'
          }}
        />
        
        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginTop: '16px',
            background: 'var(--pencil-yellow)',
            border: '2px solid #2c3e50',
            padding: '12px 24px',
            borderRadius: '10px 20px 10px 20px',
            fontFamily: 'Patrick Hand',
            fontSize: '20px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '3px 3px 0 #2c3e50',
            transition: 'all 0.1s',
            transform: isLoading ? 'scale(0.98)' : 'scale(1)'
          }}
        >
          {isLoading ? '🧠 AI is thinking...' : '📤 Sync & Translate →'}
        </button>
      </form>
    </motion.div>
  );
}