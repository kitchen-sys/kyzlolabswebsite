import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <Link href="/landing" className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--accent-neon)] to-[var(--accent-gold)] flex items-center justify-center">
          <span className="text-black font-bold">K</span>
        </div>
        <span className="text-2xl font-bold text-gradient-gold">KYZLO</span>
      </Link>

      {/* Auth Card Container */}
      <div className="w-full max-w-md">{children}</div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          By continuing, you agree to our{" "}
          <Link href="#" className="text-[var(--accent-neon)] hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="#" className="text-[var(--accent-neon)] hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
