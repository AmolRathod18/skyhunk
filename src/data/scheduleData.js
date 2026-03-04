// ============================================================
// scheduleData.js — All roster and daily protocol data
// Edit client names / slots here — no component changes needed
// ============================================================

// Morning Shift 7am – 12pm
// Columns: [Day,  7-8,          8-9,       9-10,      10-11,     11-12]
export const morning = [
  ["Sun", "",            "Nitin",   "",        "Aswathy", ""],
  ["Mon", "Shri Raksha", "Guphtak", "Bhargav", "",        "Bishnu"],
  ["Tue", "",            "Nitin",   "",        "Aswathy", ""],
  ["Wed", "Shri Raksha", "Guphtak", "Bhargav", "",        "Bishnu"],
  ["Thu", "",            "Nitin",   "",        "Aswathy", ""],
  ["Fri", "Shri Raksha", "Guphtak", "Bhargav", "",        "Bishnu"],
  ["Sat", "WEEK",        "OFF",     "WEEK",    "OFF",     "WEEK"],
];

// Evening Shift 6pm – 10pm
// Columns: [Day,  6-7,    7-8,      8-9,       9-10]
export const evening = [
  ["Sun", "",     "Balaji", "",        ""],
  ["Mon", "",     "",       "Kalyani", ""],
  ["Tue", "",     "Balaji", "",        ""],
  ["Wed", "",     "",       "Kalyani", ""],
  ["Thu", "",     "Balaji", "",        ""],
  ["Fri", "",     "",       "Kalyani", ""],
  ["Sat", "WEEK", "OFF",   "WEEK",    "OFF"],
];

// Daily High-Performance Protocol
// Columns: [Time, Activity, Purpose]
export const dailyProtocol = [
  ["04:40 AM", "Wake Up + Hydrate", "Hormonal Reset"],
  ["05:00 AM", "Personal Training", "ICN Prep Strength"],
  ["07:00 AM", "Morning Shift",     "Client Coaching"],
  ["01:00 PM", "Power Nap",         "CNS Recovery"],
  ["06:00 PM", "Evening Shift",     "Client Coaching"],
  ["11:00 PM", "Deep Sleep",        "Full Recovery"],
];
