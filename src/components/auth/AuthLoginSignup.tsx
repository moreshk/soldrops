"use client";
import { LoginSignupDrawer } from "./modal/LoginSignupDrawer";
import { LoginSignupModal } from "./modal/LoginSignupModal";

type AuthLoginSignupProps = {
  showOauth: boolean;
};

export const AuthLoginSignup = ({ showOauth }: AuthLoginSignupProps) => {
  return (
    <div className="w-full">
      <div className="w-full hidden sm:block">
        <LoginSignupModal showOauth={showOauth} />
      </div>
      <div className="w-full block sm:hidden">
        <LoginSignupDrawer showOauth={showOauth} />
      </div>
    </div>
  );
};
