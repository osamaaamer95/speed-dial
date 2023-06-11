enum AppIcons {
  Zoom = "zoom.png",
  Teams = "teams.png",
  Meet = "meet.png",
  Generic = "generic.png",
}

enum SupportedApps {
  Zoom = "Zoom",
  Teams = "Microsoft Teams",
  Meet = "Google Meet",
  Generic = "Generic",
}

type Room = {
  url: string;
  name: string;
  app: SupportedApps;
  icon: AppIcons;
};

type GetCalendarsResponse = {
  kind: string;
  etag: string;
  nextSyncToken: string;
  items: Calendar[];
};

type Calendar = {
  kind: string;
  etag: string;
  id: string;
  summary: string;
  summaryOverride?: string;
  description?: string;
  primary?: boolean;
  timeZone: string;
  colorId: string;
  backgroundColor: string;
  foregroundColor: string;
  selected: boolean;
  accessRole: string;
  defaultReminders: {
    method: string;
    minutes: number;
  }[];
};

export { SupportedApps, AppIcons };

export type { Room, GetCalendarsResponse, Calendar };
