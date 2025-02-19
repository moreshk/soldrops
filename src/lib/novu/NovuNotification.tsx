"use client";
import { SignedIn, useUser } from "@clerk/nextjs";
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
  ButtonTypeEnum,
  IMessage,
} from "@novu/notification-center";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export const NovuNotification = () => {
  const { user } = useUser();
  const { systemTheme, theme } = useTheme();
  const { push } = useRouter();
  const notificationTheme = getNotificationTheme(theme, systemTheme);

  if (!user?.id) {
    return null;
  }

  return (
    <SignedIn>
      <NovuProvider
        backendUrl="https://novu.soldrops.xyz/api"
        socketUrl="https://ws-novu.soldrops.xyz"
        subscriberId={user!.id}
        applicationIdentifier={
          process.env.NEXT_PUBLIC_NOVU_APPLICATION_IDENTIFIER!
        }
      >
        <PopoverNotificationCenter
          footer={() => <></>}
          colorScheme={notificationTheme}
          onActionClick={(
            templateIdentifier: string,
            type: ButtonTypeEnum,
            message: IMessage
          ) => {
            if (message.cta?.data.url) push(message.cta?.data.url);
          }}
        >
          {({ unseenCount }) => (
            <div className="border rounded-full p-1">
              <NotificationBell unseenCount={unseenCount} />
            </div>
          )}
        </PopoverNotificationCenter>
      </NovuProvider>
    </SignedIn>
  );
};

const getNotificationTheme = (
  theme: string | undefined,
  systemTheme: "dark" | "light" | undefined
) => {
  if (theme === "system") {
    if (systemTheme === "dark") {
      return "dark";
    }
    if (systemTheme === "light") {
      return "light";
    }
  }
  return theme === "light" ? "light" : "dark";
};
