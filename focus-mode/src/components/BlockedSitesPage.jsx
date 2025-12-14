import React from 'react';
import SiteList from './SiteList';

const BlockedSitesPage = () => {
  return (
    <div className="ml-64 p-6">
      <h2 className="text-2xl font-bold mb-4">Blocked Sites</h2>
      <SiteList />
    </div>
  );
};

export default BlockedSitesPage;