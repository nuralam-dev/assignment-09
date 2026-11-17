
"use client";

import { FcGoogle } from "react-icons/fc";

type GoogleAuthButtonProps = {
  text: string;
};

export default function GoogleAuthButton({
  text,
}: GoogleAuthButtonProps) {

  const handleGoogleAuth = () => {

    // TODO: Implement BetterAuth Google OAuth here.
    // Example:
    // await authClient.signIn.social({
    //   provider: "google",
    //   callbackURL: "/dashboard/customer",
    // });

    console.log("Google authentication will be added later");
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white py-3.5 font-semibold text-slate-700 transition hover:border-teal-500 hover:bg-teal-50"
    >
      <FcGoogle className="text-2xl" />
      {text}
    </button>
  );
}
