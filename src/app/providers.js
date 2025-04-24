// src/app/providers.js
'use client';

import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import { HealthProvider } from '../contexts/HealthContext';
import { TrainingProvider } from '../contexts/TrainingContext';
import { ProfileProvider } from '../contexts/ProfileContext';
import { SupportProvider } from '../contexts/SupportContext';

export function Providers({ children }) {
  return (
    <AuthProvider>
      <HealthProvider>
        <TrainingProvider>
          <ProfileProvider>
            <SupportProvider>
              {children}
            </SupportProvider>
          </ProfileProvider>
        </TrainingProvider>
      </HealthProvider>
    </AuthProvider>
  );
}
