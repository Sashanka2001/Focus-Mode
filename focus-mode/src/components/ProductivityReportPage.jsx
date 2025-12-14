import React from 'react';
import ProductivityReport from './ProductivityReport';
import useScreenTime from '../hooks/useScreenTime';

const ProductivityReportPage = () => {
  const screenTime = useScreenTime();
  const hours = Math.floor(screenTime / 3600);
  const minutes = Math.floor((screenTime % 3600) / 60);
  const seconds = screenTime % 60;

  return (
    <div className="ml-64 p-6">
      <h2 className="text-2xl font-bold mb-4">Productivity Report</h2>
      <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold">Screen Time</h3>
        <p className="text-2xl font-mono">
          {hours > 0 ? `${hours}h ` : ""}{minutes > 0 ? `${minutes}m ` : ""}{seconds}s
        </p>
      </div>
      <ProductivityReport />
    </div>
  );
};

export default ProductivityReportPage;