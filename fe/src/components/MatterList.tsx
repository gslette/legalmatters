import React from 'react';
import type { Matter } from '../models/Matter';

interface MatterListProps {
  matters: Matter[];
}

export const MatterList: React.FC<MatterListProps> = ({ matters }) => {
  return (
    <div className="matters-section">
      <h2 className="text-2xl font-normal text-red-500">Matters</h2>
      <div className="matters-list">
        {matters.map(matter => (
          <div key={matter.matterId} className="matter-item">
            <h3>{matter.name}</h3>
            <p>{matter.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};