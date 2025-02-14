import { Link } from "wouter";

export default function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/">
            <a className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Apex Mobility
            </a>
          </Link>
          <div className="flex gap-6">
            <Link href="/">
              <a className="text-sm font-medium transition-colors hover:text-primary">
                Routines
              </a>
            </Link>
            <Link href="/calendar">
              <a className="text-sm font-medium transition-colors hover:text-primary">
                Calendar
              </a>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
