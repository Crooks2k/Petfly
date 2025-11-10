export interface CreateExampleRequestEntity {
  name: string;
  description: string;
  category: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface UpdateExampleRequestEntity extends CreateExampleRequestEntity {
  id: string;
}
