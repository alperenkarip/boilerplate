// Sample feature — Zod validation schema
import { z } from 'zod';

export const sampleItemSchema = z.object({
  title: z.string().min(1, 'Baslik zorunludur').max(100, 'Baslik en fazla 100 karakter olabilir'),
  description: z.string().max(500, 'Aciklama en fazla 500 karakter olabilir'),
  status: z.enum(['active', 'archived']),
});

export type SampleItemFormData = z.infer<typeof sampleItemSchema>;
