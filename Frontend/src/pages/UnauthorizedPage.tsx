import React from 'react';
import { UnauthorizedMessage } from '../components/UnauthorizedMessage';

export function UnauthorizedPage() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <UnauthorizedMessage />
    </div>
  );
}