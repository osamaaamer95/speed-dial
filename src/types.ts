import { AppIcons, SupportedApps } from "./enums";

type Room = {
  url: string;
  name: string;
  app: SupportedApps;
  icon: AppIcons;
};

export type { Room };
