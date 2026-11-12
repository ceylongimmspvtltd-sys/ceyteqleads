export const BUSINESS_CATEGORIES = [
  "Tourism & Travel",
  "Hotels & Accommodation",
  "Restaurants & Food",
  "Cafés & Bakeries",
  "Transportation & Logistics",
  "Export & Import",
  "Finance & Banking",
  "Retail & Shopping",
  "Fashion & Clothing",
  "Beauty Salons & Hairdressing",
  "Beauty & Cosmetics",
  "IT & Technology",
  "Professional Services",
  "Healthcare & Medical",
  "Education & Training",
  "Real Estate & Construction",
  "Manufacturing & Industry",
  "Agriculture & Farming",
  "E-commerce & Online Business",
  "Automotive",
  "Events & Entertainment",
  "Other",
] as const;

export type BusinessCategory = (typeof BUSINESS_CATEGORIES)[number];

export type Lead = {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  category: BusinessCategory;
};

export const STORAGE_UNAVAILABLE_MESSAGE =
  "Persistent lead storage is not configured. No enquiry has been recorded.";
