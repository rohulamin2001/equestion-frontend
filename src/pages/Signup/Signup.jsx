import { SignUp } from "@clerk/react";

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-100 to-blue-50/50 p-4">
      <SignUp
        routing="path"
        path="/signup"
        signInUrl="/login"
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}

