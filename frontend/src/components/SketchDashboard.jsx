import { useEffect, useState } from 'react';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const SketchWidget = ({ title, items, color, icon }) => (
  <div className="sketch-card" style={{ borderTop: `6px solid ${color}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
      <span style={{ fontSize: '28px' }}>{icon}</span>
      <h3 style={{ margin: 0, fontFamily: 'Caveat', fontSize: '28px' }}>{title}</h3>
    </div>
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {items && items.length > 0 ? items.map((item, i) => (
        <li key={i} style={{ 
          padding: '8px 0', 
          borderBottom: '1px dashed #ccc',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>📋</span>
          <span style={{ fontSize: '18px' }}>{item}</span>
        </li>
      )) : <li style={{ opacity: 0.6, fontStyle: 'italic' }}>✨ Nothing here yet</li>}
    </ul>
  </div>
);

export default function SketchDashboard() {
  const [latestUpdate, setLatestUpdate] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'updates'), orderBy('timestamp', 'desc'), limit(1));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          setLatestUpdate(data);
          
          const cards = document.querySelectorAll('.sketch-card');
          cards.forEach(card => card.classList.add('wobble'));
          setTimeout(() => cards.forEach(card => card.classList.remove('wobble')), 500);
        }
      });
    });
    return () => unsubscribe();
  }, []);

  const processed = latestUpdate?.processedData || { done: [], inProgress: [], blockers: [] };

  return (
    <div>
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <div className="sketch-card" style={{ flex: 1 }}>
          <div style={{ fontSize: '18px', opacity: 0.7 }}>Team Velocity</div>
          <div className="stat-number">{processed.done.length + processed.inProgress.length}</div>
          <div className="chart-bar" style={{ width: '100%', marginTop: '8px' }}></div>
        </div>
        <div className="sketch-card" style={{ flex: 1, background: '#fff9e6' }}>
          <div style={{ fontSize: '18px', opacity: 0.7 }}>Blockers</div>
          <div className="stat-number" style={{ color: 'var(--pencil-red)' }}>{processed.blockers.length}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
        <SketchWidget title="Done" items={processed.done} color="var(--pencil-green)" icon="✅" />
        <SketchWidget title="In Progress" items={processed.inProgress} color="var(--pencil-blue)" icon="🔄" />
        <SketchWidget title="Blockers" items={processed.blockers} color="var(--pencil-red)" icon="🚧" />
      </div>
    </div>
  );
}