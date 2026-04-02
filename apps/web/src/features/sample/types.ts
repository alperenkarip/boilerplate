// Sample feature — veri modeli
export interface SampleItem {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'archived';
  createdAt: string;
}
