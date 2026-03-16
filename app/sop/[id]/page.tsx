import SopDetailPage from '@/components/sop/SopDetailPage'

export default async function SopDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <SopDetailPage id={id} />
}
