// src/components/StructuredData.tsx
import React from 'react';

interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo?: string;
  description?: string;
}

export function OrganizationSchema({ name, url, logo, description }: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name,
    url,
    ...(logo && { logo }),
    ...(description && { description }),
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English'],
    },
    medicalSpecialty: [
      'Cardiology',
      'Dermatology',
      'Neurology',
      'Pediatrics',
      'Internal Medicine',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface DoctorSchemaProps {
  name: string;
  specialization: string;
  bio?: string;
  city?: string;
  education?: string;
  experienceYears?: number;
  rating?: number;
  totalReviews?: number;
  url: string;
}

export function DoctorSchema({
  name,
  specialization,
  bio,
  city,
  education,
  experienceYears,
  rating,
  totalReviews,
  url,
}: DoctorSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name,
    url,
    medicalSpecialty: specialization,
    ...(bio && { description: bio }),
    ...(education && {
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: education,
      },
    }),
    ...(city && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: city,
      },
    }),
    ...(rating &&
      totalReviews && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: rating,
          reviewCount: totalReviews,
          bestRating: 5,
          worstRating: 1,
        },
      }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebsiteSchemaProps {
  name: string;
  url: string;
  description: string;
}

export function WebsiteSchema({ name, url, description }: WebsiteSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/doctors?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
