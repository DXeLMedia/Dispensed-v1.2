import React from 'react';

export const Spinner = () => (
  <div className="flex justify-center items-center h-full w-full">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
  </div>
);

export const PageSpinner = () => (
    <div className="flex justify-center items-center h-screen w-full bg-[var(--background)]">
        <Spinner />
    </div>
)
