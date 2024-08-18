import { SignIn, useUser } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex h-screen items-center justify-center">
      <SignIn
        afterSignInUrl={"/dashboard"}
        afterSignOutUrl={"/"}
        path="/sign-in"
      />
      ;
    </div>
  );
}
