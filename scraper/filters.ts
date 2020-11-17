export default {
  whitespace: (value: string) => {
    return value.replace(/\\n/g, "").trim();
  },
  price: (value: string) => {
    return value.replace(/(sek|kr)/, "");
  },
  toNum: (value: string) => parseInt(value),
  dlstock: (value: string) => {
    const matches = value.match(/\d+/g);
    return matches.reduce((a, b) => a + parseInt(b, 10), 0);
  },
  sfbstock: (value: string) => value === "Köp",
  wobstock: (value: string) => value === "K�p",
  escapadestock: (value: string) => value === "I lager",
  sestock: (value: string) => value === "I lager",
  asstock: (value: string) => parseInt(value, 10) || 0,
  sku: (value: string) => {
    const matches = value.match(/SW[X|Z]\d+/);
    if (matches) {
      return matches[0];
    }
    return null;
  },
  fixTitle: (value: string) => {
    const original = value;

    // Look at all the things! Hack hack hackety hack
    value = value.replace(/–/g, "-");
    value = value.replace("X-Wing 2nd Edition:", "");
    value = value.replace("X-Wing (2nd Ed):", "");
    value = value.replace("X-WING (2nd Ed):", "");
    value = value.replace("Star Wars: X-Wing (Second Edition) -", "");
    value = value.replace("Star Wars: X-Wing Miniatures Game -", "");
    value = value.replace("Star Wars: X-Wing Second Edition -", "");
    value = value.replace(/Star Wars: X-Wing \(2nd Ed\.?\) -/, "");
    value = value.replace("(Second Edition):", "");
    value = value.replace("Second Edition", "");
    value = value.replace("T-70 Expansion Pack", "T-70 X-Wing");
    value = value.replace("Expansion Pack", "");
    value = value.replace(/\(Exp\.?\)/, "");
    value = value.replace("Star Wars X-Wing:", "");
    value = value.replace("Star Wars X-Wing", "");
    value = value.replace("Star Wars: X-Wing -", "");
    value = value.replace("Star Wars: X-Wing", "");
    value = value.replace("Star Wars X-Wing -", "");
    value = value.replace("Expansion Pack", "");
    value = value.replace(/Expansion/i, "");
    value = value.replace("Exp.", "");
    value = value.replace(/\(2nd( ed)?\)[ -]?/i, "");
    value = value.replace(/2nd ed[\.:]?[ -]?/i, "");
    value = value.replace("2nd Ed -", "");
    value = value.replace("2nd Ed:", "");
    value = value.replace("(1st ed)", "(1st Edition)");
    value = value.replace("’", "'");
    value = value.replace("(Skrymmande)", "");
    value = value.replace("Maneuver Dials", "Maneuver Dial Upgrade Kit");
    value = value.replace(/Maneuver Dial$/, "Maneuver Dial Upgrade Kit");
    value = value.replace("3x3 ~ 91,5x91,5cm (Mousepad)", "");
    value = value.replace("3x3 ~ 91,5x91,5cm (PVC)", "");
    value = value.replace("Play Mat", "Playmat");
    value = value.replace("Slave I", "Slave 1");
    value = value.replace(" Class", "-Class");
    value = value.replace(/ Squad$/, " Squadron Pack");
    value = value.replace("Wave 1 ", "");
    value = value.replace("Conv. Kit", "Conversion Kit");
    value = value.replace(/^X-Wing:/, "");
    value = value.replace("Scum & Villainy", "Scum And Villainy");
    value = value.replace("Scum and Villainy", "Scum And Villainy");
    value = value.replace(/pre[ -]?order/i, "");
    value = value.replace(/^ ?-?/, "");

    if (
      value.endsWith("Servants of Strife") ||
      value.endsWith("Guardians of the Republic")
    ) {
      value = value + " Squadron Pack";
    }

    if (value.endsWith("ARC-170")) {
      value = value + " Starfighter";
    }

    if (value.endsWith("Playmat")) {
      value = "Playmat " + value.replace("Playmat", "").trim();
    }

    if (value.startsWith("X-Wing Deluxe ")) {
      value = value.replace("X-Wing ", "");
    }
    value = value.replace("Tools & Range Ruler", "Tools and Range Ruler");

    value = value.trim();

    // DL has mistyped TIE/ln as TIE/In
    if (value === "TIE/In Fighter") {
      return "TIE/ln Fighter";
    }

    if (original === "X-Wing Dice Pack") {
      return "Dice Pack (1st Edition)";
    }

    if (
      original === "Star Wars: X-Wing Second Edition" ||
      value === "2nd Core Set" ||
      value === "Core Set" ||
      original === "Star Wars: X-Wing (Second Edition)" ||
      value === "Core Set 2018" ||
      original === "X-Wing 2nd Edition Core Set"
    ) {
      return "Core Set (2nd Edition)";
    }
    if (value === "Force Awakens Core Set") {
      return "Core Set (1st Edition - The Force Awakens)";
    }
    if (value === "Core Set (1st Edition)") {
      return "Core Set (1st Edition - Original)";
    }
    if (value.includes("Never Tell Me")) {
      return "Never Tell Me the Odds Obstacles Pack";
    }
    if (value.includes("Fully Loaded")) {
      return "Fully Loaded Devices Pack";
    }
    if (value.includes("Hotshots")) {
      return "Hotshots and Aces Reinforcements Pack";
    }

    return value;
  },
};
