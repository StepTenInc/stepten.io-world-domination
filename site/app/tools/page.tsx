'use client';

import { useEffect } from 'react';

export default function ToolsPage() {
  useEffect(() => {
    window.location.href = '/tools.html';
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      color: '#00ff41',
      fontFamily: 'Orbitron, sans-serif',
    }}>
      Loading tools...
    </div>
  );
}
