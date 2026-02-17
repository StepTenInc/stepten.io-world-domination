import { notFound } from 'next/navigation';
import { tales, getTaleBySlug } from '@/lib/tales';
import { TaleContent } from './TaleContent';

// ISR: Revalidate every 60 seconds for fresh content
export const revalidate = 60;

export function generateStaticParams() {
  return tales.map((tale) => ({ slug: tale.slug }));
}

export default async function TaleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tale = getTaleBySlug(slug);
  if (!tale) notFound();

  return <TaleContent tale={tale} allTales={tales} />;
}
