import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage(): Promise<JSX.Element> {
  const user = await currentUser();
  if (!user) {
    redirect('/?clerk_modal=sign-in');
  }

  return (
    <main>
      <h1>Dashboard</h1>
    </main>
  );
}
