import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getLinksByUserId } from '@/data/links';

export default async function DashboardPage(): Promise<JSX.Element> {
  const user = await currentUser();
  if (!user) {
    redirect('/?clerk_modal=sign-in');
  }

  const links = await getLinksByUserId(user.id);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Links</h2>
        
        {links.length === 0 ? (
          <p className="text-muted-foreground">No links created yet.</p>
        ) : (
          <ul className="space-y-4">
            {links.map((link) => (
              <li
                key={link.id}
                className="border rounded-lg p-4 hover:bg-accent transition-colors"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold">
                      /{link.code}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Destination:</span>{' '}
                    <a
                      href={link.destinationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {link.destinationUrl}
                    </a>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created: {new Date(link.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
