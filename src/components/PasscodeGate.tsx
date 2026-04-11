import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const PASSCODE = "bethesda2024";
const STORAGE_KEY = "bcc-access";

const PasscodeGate = ({ children }: { children: React.ReactNode }) => {
  const [granted, setGranted] = useState(() => sessionStorage.getItem(STORAGE_KEY) === "true");
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().toLowerCase() === PASSCODE) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setGranted(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (granted) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm text-center space-y-6">
        <img src={logo} alt="Bethesda CC" className="w-20 h-20 rounded-2xl object-cover mx-auto" />
        <div>
          <h1 className="text-xl font-semibold text-foreground font-serif">Bethesda Planning Hub</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter the access code to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Access code"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`pl-10 h-12 text-center text-lg ${error ? "border-destructive" : ""}`}
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-destructive">Incorrect code. Please try again.</p>}
          <Button type="submit" className="w-full h-12 text-base">Enter</Button>
        </form>
        <p className="text-xs text-muted-foreground">Ask your leader for the access code</p>
      </div>
    </div>
  );
};

export default PasscodeGate;
