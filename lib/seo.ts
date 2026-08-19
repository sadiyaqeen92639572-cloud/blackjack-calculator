export const SITE_URL = 'https://blackjackhelpercalculator.com';
export const SITE_NAME = 'Blackjack Calculator';

export const GESMINE_ORG = {
  '@type': 'Organization',
  name: SITE_NAME,
  legalName: 'Gesmine-Invest Limited',
  identifier: { '@type': 'PropertyValue', propertyID: 'UK Company Number', value: '14120136' },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Hardy House, 269 Poynders Gardens',
    addressLocality: 'London',
    postalCode: 'SW4 8PQ',
    addressCountry: 'GB',
  },
};

export interface FAQItem {
  question: string;
  answer: string;
}

export function getSoftwareApplicationSchema(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    operatingSystem: 'All',
    applicationCategory: 'UtilitiesApplication',
    description,
    offers: { '@type': 'Offer', price: '0.00', priceCurrency: 'USD' },
    url,
  };
}

export function getFAQPageSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getWebSiteOrgSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: SITE_URL,
      },
      { ...GESMINE_ORG, url: SITE_URL },
    ],
  };
}
