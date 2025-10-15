// src/components/LoadingSkeleton.tsx
import React from 'react';

export function DoctorCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 h-full animate-fade-in">
      {/* Doctor Name and Specialty */}
      <div className="mb-4">
        <div className="skeleton h-6 w-3/4 mb-2"></div>
        <div className="skeleton h-4 w-1/2 mb-2"></div>
        <div className="skeleton h-4 w-1/3"></div>
      </div>

      {/* Bio */}
      <div className="mb-4">
        <div className="skeleton h-3 w-full mb-2"></div>
        <div className="skeleton h-3 w-5/6"></div>
      </div>

      {/* Details */}
      <div className="space-y-2 border-t pt-4">
        <div className="flex items-center">
          <div className="skeleton h-4 w-4 rounded-full mr-2"></div>
          <div className="skeleton h-3 w-3/4"></div>
        </div>
        <div className="flex items-center">
          <div className="skeleton h-4 w-4 rounded-full mr-2"></div>
          <div className="skeleton h-3 w-1/2"></div>
        </div>
        <div className="flex items-center">
          <div className="skeleton h-4 w-4 rounded-full mr-2"></div>
          <div className="skeleton h-3 w-2/3"></div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-6">
        <div className="skeleton h-10 w-full rounded-lg"></div>
      </div>
    </div>
  );
}

export function DoctorCardSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <DoctorCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PageHeaderSkeleton() {
  return (
    <div className="text-center mb-12 animate-fade-in">
      <div className="skeleton h-10 w-64 mx-auto mb-4"></div>
      <div className="skeleton h-6 w-96 mx-auto"></div>
    </div>
  );
}

export function FiltersSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="skeleton h-5 w-32 mb-2"></div>
          <div className="skeleton h-10 w-full rounded-lg"></div>
        </div>
        <div>
          <div className="skeleton h-5 w-24 mb-2"></div>
          <div className="skeleton h-10 w-full rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}

export function ProfileHeaderSkeleton() {
  return (
    <div className="border-b pb-6 mb-6 animate-fade-in">
      <div className="skeleton h-9 w-64 mb-2"></div>
      <div className="skeleton h-6 w-48 mb-3"></div>
      <div className="skeleton h-5 w-40"></div>
    </div>
  );
}

export function ProfileSectionSkeleton() {
  return (
    <div className="mb-6 animate-fade-in">
      <div className="skeleton h-7 w-32 mb-3"></div>
      <div className="skeleton h-4 w-full mb-2"></div>
      <div className="skeleton h-4 w-full mb-2"></div>
      <div className="skeleton h-4 w-3/4"></div>
    </div>
  );
}
