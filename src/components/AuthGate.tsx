import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, LogIn } from "lucide-react";
import logo from "@/assets/logo.jpeg";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

const ALLOWED_EMAILS = [
  "lincolnmaorc@gmail.com",
  "gracelim.xw@gmail.com",
  "gracelimxw@gmail.com",
  "ng.shawnaa@gmail.com",
  "ngshawnaa@gmail.com",
  "rachelker@gmail.com",
  "leongbryan@gmail.com",
  "leong.bryan@gmail.com",
  "joanneleongjy@gmail.com",
];

const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !ALLOWED_EMAILS.includes(session.user.email ?? "")) {
        supabase.auth.signOut();
        setSession(null);
      } else {
        setSession(session);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && !ALLOWED_EMAILS.includes(session.user.email ?? "")) {
        supabase.auth.signOut();
        setSession(null);
      } else {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (!ALLOWED_EMAILS.includes(email.trim().toLowerCase())) {
      setError("This email is not authorised to access this app.");
      return;
    }
    setSending(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: window.location.href.split("#")[0] },
    });
    setSending(false);
    if (err) {
      setError(err.message);
    } else {
      setSent(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground text-sm">Loading…</div>
      </div>
    );
  }

  if (session) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm text-center space-y-6">
        <img src={logo} alt="Bethesda CC" className="w-20 h-20 rounded-2xl object-cover mx-auto" />
        <div>
          <h1 className="text-xl font-semibold text-foreground font-serif">Bethesda Planning Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {sent ? "Check your inbox" : "Sign in with your email"}
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted text-sm text-muted-foreground">
              A sign-in link has been sent to <span className="font-medium text-foreground">{email}</span>.
              Click the link in the email to continue.
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setSent(false); setEmail(""); }}>
              Use a different email
            </Button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className={`pl-10 h-12 ${error ? "border-destructive" : ""}`}
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" className="w-full h-12 text-base gap-2" disabled={sending}>
              <LogIn size={16} /> {sending ? "Sending…" : "Send sign-in link"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthGate;
