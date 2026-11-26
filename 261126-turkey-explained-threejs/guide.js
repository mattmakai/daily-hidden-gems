// Each cut supplies the copy for both the carving board and its accessible index.
export const cuts = [
  {
    id: "breast",
    name: "Breast",
    type: "White meat",
    short: "Lean & mild",
    taste:
      "Broad slices with a fine grain and a mild flavor. Breast has little fat, so a thin slice can feel dry as it cools.",
    dinner:
      "Slice across the grain and spoon warm pan gravy over the cut faces.",
    later:
      "Layer cold slices on toasted bread with cranberry sauce and a little mayo.",
  },
  {
    id: "thigh",
    name: "Thigh",
    type: "Dark meat",
    short: "Rich & juicy",
    taste:
      "The thigh does much of the bird’s walking. Its darker muscle and extra fat give it a deeper flavor and a juicy bite.",
    dinner:
      "Serve a thick piece alongside sage stuffing. Its juices soak into the crisp bread.",
    later:
      "Dice the meat for pot pie. The rich pieces hold their own in a creamy filling.",
  },
  {
    id: "drumstick",
    name: "Drumstick",
    type: "Dark meat",
    short: "Hearty & firm",
    taste:
      "Long strands of dark meat have a savory flavor and a firmer bite than the thigh. Slender tendons run alongside the bone.",
    dinner:
      "Serve on the bone for someone who likes to pull the meat off in bites.",
    later:
      "Pick around the tendons, then chop the meat into a skillet of crisp potato hash.",
  },
  {
    id: "wing",
    name: "Wing",
    type: "White meat",
    short: "Crisp & savory",
    taste:
      "There’s just a little meat between the bones. With so much browned skin in each bite, the wing tastes especially roasty.",
    dinner: "Serve straight from the platter while the skin still crackles.",
    later:
      "Pick off any meat for soup. Simmer the wing bones with the frame for a roasted stock.",
  },
  {
    id: "carcass",
    name: "Carcass",
    type: "Bones & trimmings",
    short: "The stock pot",
    taste:
      "The frame holds small pockets of tender meat. Roasted bones and connective tissue give stock its savory flavor and body.",
    dinner:
      "After carving, pick the remaining morsels from the backbone and ribs. Reserve them for soup.",
    later:
      "Gently simmer the frame with onion, carrot, and celery. Strain the stock, then add noodles and the reserved meat.",
  },
];
export const ideas = [
  {
    id: "gravy",
    cut: "breast",
    group: "dinner",
    name: "Pass the gravy",
    sub: "Sliced turkey breast",
    text: "Fan thin slices of breast across a warm plate. Spoon gravy over the exposed meat and leave the browned edge peeking out.",
  },
  {
    id: "sandwich",
    cut: "breast",
    group: "leftovers",
    name: "The next-day sandwich",
    sub: "Breast & cranberry sauce",
    text: "Toast two slices of sturdy bread. Spread one with mayo and the other with cranberry sauce, then tuck in thin slices of breast and a handful of greens.",
  },
  {
    id: "soup",
    cut: "carcass",
    group: "leftovers",
    name: "Turkey noodle soup",
    sub: "Carcass & wing bones",
    text: "Pick off and reserve any remaining meat. Simmer the frame and wing bones with vegetables, strain well, and cook noodles in the broth. Add the picked turkey near the end.",
  },
  {
    id: "stuffing",
    cut: "thigh",
    group: "dinner",
    name: "A forkful of stuffing",
    sub: "Thigh & sage stuffing",
    text: "Pair a juicy piece of thigh with sage-and-onion stuffing. A spoonful of the pan juices softens the bread while its toasted corners stay crisp.",
  },
  {
    id: "potpie",
    cut: "thigh",
    group: "leftovers",
    name: "Under a pastry lid",
    sub: "Dark-meat pot pie",
    text: "Fold diced thigh, peas, and carrots into a thick turkey gravy. Spoon into a baking dish, cap with pastry, and bake until the crust is golden and the filling bubbles.",
  },
  {
    id: "hash",
    cut: "drumstick",
    group: "leftovers",
    name: "Morning turkey hash",
    sub: "Drumstick & crisp potatoes",
    text: "Strip the drumstick meat from the bone and remove the tendons. Brown diced potatoes and onions in a skillet, then stir in the chopped turkey and a little sage.",
  },
];
