// Everything a tester sees that changes often lives here: product name, where requests go, and the game library.

export const SITE_NAME = "Ice Hockey Video";
export const TAGLINE =
  "AI film room for hockey: every player tracked, every shift and goal tagged, from a YouTube link.";

// Beta requests and feedback are sent here (by email for now, until the site gets its own database).
export const CONTACT_EMAIL = "israelhockey2021@gmail.com";

// How long a tester waits while the beta is run by hand on our side.
export const TURNAROUND = "Same day to 1 day";

export type FilmRoom = { label: string; url: string; summary: string };
export type Game = {
  id: string;
  date: string;
  home: { name: string; color: string };
  away: { name: string; color: string };
  league: string;
  note: string;
  library?: string;
  rooms: FilmRoom[];
};

const art = (id: string) => `https://claude.ai/artifact/${id}`;

export const GAMES: Game[] = [
  {
    id: "tlv-jer",
    date: "2026",
    home: { name: "HC Tel Aviv", color: "#2346aa" },
    away: { name: "Jerusalem Capitals", color: "#c8232d" },
    league: "Broadcast game · NHL-size rink",
    note: "Full game, all three periods. 11 goals, each one tagged with the scorer.",
    library: art("Nr5vyexPP4Qwj9exqYNfq6"),
    rooms: [
      {
        label: "1st period",
        url: art("MephEJskWXwKs84BA3hc1H"),
        summary: "Goals by Isaac Levy and Aaron Berisha; commentary-tagged events",
      },
      {
        label: "2nd period",
        url: art("BCZMWswtytsiTRVVw7HvA6"),
        summary: "The first period we built the film room on: stats, shot map, shift chart",
      },
      {
        label: "3rd period",
        url: art("QqpwSyPAWqaeGA212gMLVS"),
        summary: "Jeremy Sprung and two from Natanel Peretz for the Capitals",
      },
    ],
  },
];

export const FEATURES = [
  {
    t: "Every player tracked",
    d: "Players, goalies, refs and the puck followed frame by frame and mapped onto the rink, even as the camera pans and zooms.",
  },
  {
    t: "Names that stick",
    d: "Jersey numbers, each player's look, his linemates and the broadcast commentary all have to agree before a name is given. If it isn't sure, it says so.",
  },
  {
    t: "Events tagged for you",
    d: "Goals with scorers, shots, faceoffs, stoppages, zone entries, hits and shifts, pulled from the video, the scoreboard and the commentary.",
  },
  {
    t: "Skater workload",
    d: "Distance, average and top speed, sprint bursts, time on ice, shift length and fatigue for every identified player.",
  },
  {
    t: "Shot map and xG",
    d: "Where every shot came from, slot shots highlighted, expected goals per team.",
  },
  {
    t: "Film room",
    d: "Watch the game with boxes and names on the players. Filter by player or event, jump to every shift, tag plays, fix any AI tag, download clips.",
  },
];

export const STEPS = [
  {
    n: "1",
    t: "Send the game",
    d: "Paste the YouTube link (or send the file), pick the period or time range, and add both rosters.",
  },
  {
    n: "2",
    t: "We run it",
    d: "The AI tracks every player, reads jersey numbers, transcribes the commentary and tags the events.",
  },
  {
    n: "3",
    t: "Open your film room",
    d: "You get a link to the film room with stats, shot map, shift chart and every tagged play.",
  },
];
