import { SignUp, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Head from "next/head";

export default function RegisterPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/").catch((err) => {
        console.error("Failed to redirect:", err);
      });
    }
  }, [router, isLoaded, isSignedIn]);

  if (isLoaded && isSignedIn) {
    // If the user is signed in and Clerk is loaded, render null while redirecting
    return null;
  }

  // If Clerk is not loaded or the user is not signed in, render the SignIn component
  return (
    <>
      <Head>
        <title>Login | VectorWave</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mb-8 text-center text-4xl font-bold text-white">
          Create your account.
        </h1>
        <SignUp
          path="/auth/register"
          routing="path"
          signInUrl="/auth/login"
          afterSignUpUrl="/"
        />
      </main>
    </>
  );
}
