module.exports = {
  whitespace: value => {
    return value.replace(/\\n/g, "").trim();
  },
  price: value => {
    return value.replace(/(sek|kr)/, "");
  },
  toNum: value => parseInt(value),
  dlstock: value => value === "Ja",
  sfbstock: value => value === "Köp",
  wobstock: value => value === "K�p",
  asstock: value => parseInt(value, 10) || 0,
  fixTitle: value => {
    const original = value;

    // Look at all the things! Hack hack hackety hack
    value = value.replace("Star Wars: X-Wing (Second Edition) -", "");
    value = value.replace("Star Wars: X-Wing Miniatures Game -", "");
    value = value.replace("Star Wars: X-Wing Second Edition -", "");
    value = value.replace("(Second Edition):", "");
    value = value.replace("Second Edition", "");
    value = value.replace("T-70 Expansion Pack", "T-70 X-Wing");
    value = value.replace("Expansion Pack", "");
    value = value.replace("(Exp.)", "");
    value = value.replace("Star Wars X-Wing:", "");
    value = value.replace("Star Wars X-Wing", "");
    value = value.replace("Star Wars: X-Wing -", "");
    value = value.replace("Star Wars: X-Wing", "");
    value = value.replace("Expansion Pack", "");
    value = value.replace(/Expansion/i, "");
    value = value.replace("(2nd ed)", "");
    value = value.replace("2nd Ed -", "");
    value = value.replace("(1st ed)", "(1st Edition)");
    value = value.replace("’", "'");
    value = value.replace("Maneuver Dials", "Maneuver Dial Upgrade Kit");
    value = value.replace(/Maneuver Dial$/, "Maneuver Dial Upgrade Kit");
    value = value.replace("3x3 ~ 91,5x91,5cm (Mousepad)", "");
    value = value.replace("3x3 ~ 91,5x91,5cm (PVC)", "");
    value = value.replace("Play Mat", "Playmat");
    value = value.replace("Slave I", "Slave 1");
    value = value.replace(" Class", "-Class");
    value = value.replace(/ Squad$/, " Squadron Pack");
    value = value.replace("Wave 1 ", "");

    if (value.endsWith("Playmat")) {
      value = "Playmat " + value.replace("Playmat", "").trim();
    }

    value = value.trim();

    // DL has mistyped TIE/ln as TIE/In
    if (value === "TIE/In Fighter") {
      return "TIE/ln Fighter";
    }

    if (
      original === "Star Wars: X-Wing Second Edition" ||
      value === "2nd Core Set" ||
      value === "Core Set" ||
      original === "Star Wars: X-Wing (Second Edition)" ||
      value === "Core Set 2018"
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
  }
};
