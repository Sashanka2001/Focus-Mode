import React from 'react';
import SiteList from './SiteList';

const BlockedSitesPage = () => {
  return (
    <div className="ml-6 p-6">
       <div className="w-full max-w-5xl">
      <h2 className="text-2xl font-bold mb-4">Blocked Sites</h2>
      </div>
      <SiteList />
    </div>
  );
};

export default BlockedSitesPage;