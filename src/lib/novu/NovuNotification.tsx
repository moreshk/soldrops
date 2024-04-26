"use client";
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
  ButtonTypeEnum,
  IMessage,
} from "@novu/notification-center";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export const NovuNotification = ({
  subscriberId,
}: {
  subscriberId?: string;
}) => {
  const { systemTheme, theme } = useTheme();
  const notificationTheme = getNotificationTheme(theme, systemTheme);
  const { push } = useRouter();
  if (!subscriberId) {
    return null;
  }

  return (
    <NovuProvider
      backendUrl="https://novu.soldrops.xyz/api"
      socketUrl="https://ws-novu.soldrops.xyz"
      subscriberId={subscriberId}
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
        {({ unseenCount }) => <NotificationBell unseenCount={unseenCount} />}
      </PopoverNotificationCenter>
    </NovuProvider>
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
