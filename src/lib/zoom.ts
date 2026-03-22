let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const credentials = Buffer.from(
    `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
  ).toString("base64");

  const res = await fetch("https://zoom.us/oauth/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "account_credentials",
      account_id: process.env.ZOOM_ACCOUNT_ID!,
    }),
  });

  if (!res.ok) {
    throw new Error(`Zoom token hatası: ${res.status}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000, // 1 dk erken expire
  };

  return cachedToken.token;
}

interface CreateMeetingParams {
  topic: string;
  startTime: string; // ISO 8601
  duration: number; // dakika
  recurring?: {
    type: 2; // Weekly
    weeklyDays: string; // "1"=Sun, "2"=Mon, ... "7"=Sat
    repeatInterval: number; // Her kaç haftada bir
    endTimes: number; // Kaç kez tekrarlansın
  };
}

interface ZoomMeeting {
  id: number;
  join_url: string;
  start_url: string;
}

export async function createZoomMeeting(
  params: CreateMeetingParams
): Promise<ZoomMeeting> {
  const token = await getAccessToken();

  const body: Record<string, unknown> = {
    topic: params.topic,
    type: params.recurring ? 8 : 2, // 8 = Recurring with fixed time, 2 = Scheduled
    start_time: params.startTime,
    duration: params.duration,
    timezone: "Europe/Istanbul",
    settings: {
      join_before_host: false,
      waiting_room: true,
      mute_upon_entry: true,
      auto_recording: "cloud",
    },
  };

  if (params.recurring) {
    body.recurrence = {
      type: params.recurring.type,
      weekly_days: params.recurring.weeklyDays,
      repeat_interval: params.recurring.repeatInterval,
      end_times: params.recurring.endTimes,
    };
  }

  const res = await fetch("https://api.zoom.us/v2/users/me/meetings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Zoom meeting oluşturma hatası: ${error}`);
  }

  return res.json();
}
