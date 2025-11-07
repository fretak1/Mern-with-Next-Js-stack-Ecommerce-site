import { Suspense } from 'react';
import ManageProductContent from './addProductContent';

// A simple loading placeholder for the initial server render
const LoadingState = () => (
  <div className="p-8 bg-gray-100 rounded-xl shadow-lg h-full min-h-[500px] flex items-center justify-center">
    <div className="text-gray-500 font-medium animate-pulse">
      Loading product form...
    </div>
  </div>
);

// This Server Component renders the client component wrapped in Suspense
export default function SuperAdminManageProductPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ManageProductContent />
    </Suspense>
  );
}
