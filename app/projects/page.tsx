// app/projects/page.tsx
import { Suspense } from 'react';
import ProjectsClient from './ProjectsClient';
import Loading from '@/components/ui/Loading'; // or use a fallback div

export default function ProjectsPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProjectsClient />
    </Suspense>
  );
}
