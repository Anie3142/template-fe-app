import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-24">
      <h1 className="text-4xl font-bold">Template App</h1>
      <p className="max-w-md text-center text-muted-foreground">
        Next.js 14 + shadcn/ui + Auth0 (server-side) + Cloudflare Workers.
        Replace this page with your real landing page.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <a href="/api/auth/login">Login with Auth0</a>
        </Button>
        <Button variant="outline" asChild>
          <a href="/api/auth/logout">Logout</a>
        </Button>
      </div>
    </main>
  );
}
