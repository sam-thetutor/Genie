import React from 'react';
import { useAuth } from '@nfid/identitykit/react';

function Profile() {
  const { identity } = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <p>Your profile information</p>
        {identity && (
          <div className="mt-4">
            <p>Principal ID: {identity.getPrincipal().toString()}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile; 