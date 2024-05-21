"use client";
import { LoginSignupDrawer } from "./modal/LoginSignupDrawer";
import { LoginSignupModal } from "./modal/LoginSignupModal";

type AuthLoginSignupProps = {
  showOauth?: boolean;
};

export const AuthLoginSignup = ({ showOauth }: AuthLoginSignupProps) => {
  // const { data: session } = useSession();
  // const { push } = useRouter();

  // useEffect(() => {
  //   if (session) {
  //     push(session.user.defaultURL);
  //   }
  // }, [session]);

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
