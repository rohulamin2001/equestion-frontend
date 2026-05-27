import { SignIn } from "@clerk/react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-100 to-blue-50/50 p-4">
      <SignIn
        routing="path"
        path="/login"
        signUpUrl="/signup"
        fallbackRedirectUrl="/dashboard"
        forceRedirectUrl="/dashboard"
      />
    </div>
  );
}

