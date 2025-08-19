// src/components/pages/ProfilePage.tsx
import React from 'react';

interface ProfilePageProps {
  userId?: string;
  onNavigate?: (page: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ userId, onNavigate }) => {
  return (
    <div>
      <h1>Profile Page</h1>
      <p>User ID: {userId || 'Anonymous'}</p>
      {onNavigate && (
        <button onClick={() => onNavigate('home')}>Go Home</button>
      )}
    </div>
  );
};
