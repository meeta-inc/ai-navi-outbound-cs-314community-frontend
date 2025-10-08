export interface SubAttribute {
  id: string;
  name: string;
}

export interface AttributeItem {
  attributeId: string;
  attributeName: string;
  attributeIcon: string;
  group: string;
  isActive: boolean;
  priority: number;
  subAttributes: SubAttribute[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  archivedAt: string | null;
  archivedBy: string | null;
}

export interface AttributesApiResponse {
  items: AttributeItem[];
}

export interface AttributesRequest {
  clientId: string;
  group: string;
  isActive?: boolean;
}
