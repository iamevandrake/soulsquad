import pc from "picocolors";

const OPENSOUL_ART = [
  " ██████╗ ██████╗ ███████╗███╗   ██╗███████╗ ██████╗ ██╗   ██╗██╗     ",
  "██╔═══██╗██╔══██╗██╔════╝████╗  ██║██╔════╝██╔═══██╗██║   ██║██║     ",
  "██║   ██║██████╔╝█████╗  ██╔██╗ ██║███████╗██║   ██║██║   ██║██║     ",
  "██║   ██║██╔═══╝ ██╔══╝  ██║╚██╗██║╚════██║██║   ██║██║   ██║██║     ",
  "╚██████╔╝██║     ███████╗██║ ╚████║███████║╚██████╔╝╚██████╔╝███████╗",
  " ╚═════╝ ╚═╝     ╚══════╝╚═╝  ╚═══╝╚══════╝ ╚═════╝  ╚═════╝ ╚══════╝",
] as const;

const TAGLINE = "Open-source agentic marketing stack";

export function printOpenSoulCliBanner(): void {
  const lines = [
    "",
    ...OPENSOUL_ART.map((line) => pc.cyan(line)),
    pc.blue("  ───────────────────────────────────────────────────────"),
    pc.bold(pc.white(`  ${TAGLINE}`)),
    "",
  ];

  console.log(lines.join("\n"));
}
