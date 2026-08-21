"use client"

import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { promotionService } from '@/lib/services';
import { Promotion } from '@/lib/services/types';
import PromotionForm from '@/components/admin/promotions/PromotionForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface EditPromotionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPromotionPage({ params }: EditPromotionPageProps) {
  const resolvedParams = use(params);
  const [promotion, setPromotion] = useState<Promotion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await promotionService.getById(resolvedParams.id);
        setPromotion(response.data as Promotion);
      } catch (err: unknown) {
        const error = err as { message?: string };
        console.error('Error fetching promotion:', error);
        setError(error.message || 'Failed to load promotion');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPromotion();
  }, [resolvedParams.id]);

  if (isLoading) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />
    );
  }

  if (error || !promotion) {
    return notFound();
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <Link 
          href="/admin/promotions" 
          className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm mb-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Promotions
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Edit Promotion: {promotion.name}</h1>
      </div>
      
      <Suspense fallback={<div className="h-96 bg-gray-100 rounded-lg animate-pulse" />}>
        <PromotionForm initialData={promotion} isEditing={true} />
      </Suspense>
    </div>
  );
}