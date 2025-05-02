import React from 'react';
import CapacityAnalysis from './CapacityAnalysis';
import RevenueAnalysis from './RevenueAnalysis';
import UserAnalysis from './UserAnalysis';

export default function AdminAnalysis() {
  return (
    <div className="admin-analysis">
      <CapacityAnalysis />
      <RevenueAnalysis />
      <UserAnalysis />
    </div>
  );
}
