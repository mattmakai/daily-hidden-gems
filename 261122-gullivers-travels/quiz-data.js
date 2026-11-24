// All quiz questions. `answer` is the index of the correct option.
// Each explanation points back to where it happens in the book.
window.QUIZ_SECTIONS = {
  intro: { label: "Meet Gulliver", color: "#b5ca8d" },
  p1: { label: "I · Lilliput", color: "#8bb174" },
  p2: { label: "II · Brobdingnag", color: "#b5ca8d" },
  p3: { label: "III · Laputa & beyond", color: "#6f9e9b" },
  p4: { label: "IV · Houyhnhnms", color: "#5f8c8a" },
  links: { label: "Connections", color: "#8bb174" }
};

window.QUIZ = [
  // ---------- Intro ----------
  {
    id: "i1", section: "intro",
    q: "What was Lemuel Gulliver's job when he first went to sea?",
    options: ["A navy admiral", "A ship's surgeon (doctor)", "A mapmaker", "A lawyer"],
    answer: 1,
    explain: "He trained under the London surgeon Mr. Bates and sailed as a ship's surgeon. Only on the fourth voyage does he become a captain. (Part I, Ch. 1)"
  },
  {
    id: "i2", section: "intro",
    q: "Gulliver's Travels is a satire. What does that mean?",
    options: [
      "It is a true diary of real voyages",
      "It uses humour and exaggeration to make fun of real people, politics and human nature",
      "It is a fairy tale written only for children",
      "It is a guidebook for sailors"
    ],
    answer: 1,
    explain: "Swift invents strange lands so he can poke fun at real things: English politics, wars, scientists, lawyers and human pride. The invented countries are mirrors."
  },

  // ---------- Part I ----------
  {
    id: "l1", section: "p1",
    q: "How tall are the people of Lilliput?",
    options: ["About three feet", "Knee-high to Gulliver", "Under six inches", "About the size of an ant"],
    answer: 2,
    explain: "Gulliver first sees \"a human creature not six inches high.\" The emperor's mathematicians work out that Gulliver is 12 times their height, so he needs the food of 1,724 Lilliputians. (Part I, Ch. 1 & 3)"
  },
  {
    id: "l2", section: "p1",
    q: "What started the long war between Lilliput and Blefuscu?",
    options: [
      "A quarrel over which end of an egg to break",
      "A fight over fishing waters",
      "Whether to wear high or low heels",
      "A stolen royal crown"
    ],
    answer: 0,
    explain: "An emperor ordered everyone to break eggs at the small end. The 'Big-Endians' rebelled and fled to Blefuscu, which backs them. (Heels split Lilliput's own political parties — the Tramecksan and Slamecksan — but they aren't the cause of the war.) (Part I, Ch. 4)"
  },
  {
    id: "l3", section: "p1",
    q: "How does Gulliver stop Blefuscu's invasion?",
    options: [
      "He frightens their soldiers with his pistols",
      "He wades across the channel and drags away about fifty warships with hooks and cables",
      "He blows their ships over with his breath",
      "He negotiates a peace treaty"
    ],
    answer: 1,
    explain: "He ties a hook to each ship, cuts the anchor ropes and pulls the whole fleet back to Lilliput while arrows stick in his face. The emperor makes him a Nardac, the highest title. (Part I, Ch. 5)"
  },
  {
    id: "l4", section: "p1",
    q: "After the victory, the emperor asks Gulliver for more. What does Gulliver refuse to do?",
    options: [
      "Carry the emperor around the city",
      "Capture the rest of Blefuscu's ships and turn its free people into slaves",
      "Teach the army how to use guns",
      "Leave the country forever"
    ],
    answer: 1,
    explain: "The emperor wants to conquer Blefuscu and force everyone there to break eggs at the small end. Gulliver says he will never help bring \"a free and brave people into slavery\" — and the emperor never forgives him. (Part I, Ch. 5)"
  },
  {
    id: "l5", section: "p1",
    q: "How do people win top government jobs in Lilliput?",
    options: [
      "By passing a written exam",
      "By being the emperor's relatives",
      "By rope-dancing — leaping and dancing on a thin rope",
      "By winning a sword fight"
    ],
    answer: 2,
    explain: "Candidates dance on a tightrope; whoever jumps highest without falling gets the job. Flimnap the treasurer can jump highest of all. Others win coloured silk threads by leaping over or creeping under a stick. Swift is mocking how politicians win favour. (Part I, Ch. 3)"
  },
  {
    id: "l6", section: "p1",
    q: "Why does Gulliver secretly escape to Blefuscu?",
    options: [
      "He has eaten nearly all of Lilliput's food",
      "He learns he is to be charged with treason and punished by having his eyes put out",
      "The emperor of Blefuscu offered him a palace",
      "He wants to find a ship to England"
    ],
    answer: 1,
    explain: "A friend warns him of secret 'articles of impeachment' (partly for putting out the palace fire by urinating on it). His 'merciful' sentence is blinding, with a plan to slowly starve him later. (Part I, Ch. 7)"
  },

  // ---------- Part II ----------
  {
    id: "b1", section: "p2",
    q: "How does Gulliver end up alone in Brobdingnag?",
    options: [
      "His ship is wrecked in a storm",
      "Pirates throw him overboard",
      "His shipmates row away in terror from a giant, leaving him behind on shore",
      "He swims ashore to explore"
    ],
    answer: 2,
    explain: "He goes ashore with a boat crew to find water. When a giant appears, the sailors flee and abandon him. Compare: shipwreck in Part I, abandonment in Part II. (Part II, Ch. 1)"
  },
  {
    id: "b2", section: "p2",
    q: "Who is Glumdalclitch?",
    options: [
      "The queen's cruel dwarf",
      "The farmer's nine-year-old daughter, who becomes Gulliver's 'little nurse'",
      "The king of Brobdingnag",
      "The capital city"
    ],
    answer: 1,
    explain: "She sews his clothes, teaches him the language, and names him Grildrig (\"mannikin\"). She follows him to court and cares for him there. The capital city is Lorbrulgrud. (Part II, Ch. 2)"
  },
  {
    id: "b3", section: "p2",
    q: "Before the queen buys him, how does the farmer use Gulliver?",
    options: [
      "As a scarecrow in the fields",
      "As a toy for his son",
      "He shows him for money as a curiosity in towns, nearly working him to death",
      "He keeps him hidden in a box"
    ],
    answer: 2,
    explain: "Gulliver performs tricks many times a day in markets and the capital. When he grows thin and ill, the greedy farmer gladly sells him to the queen for a thousand pieces of gold. (Part II, Ch. 2–3)"
  },
  {
    id: "b4", section: "p2",
    q: "What 'gift' does Gulliver offer the king — which the king angrily refuses?",
    options: [
      "The secret of making gunpowder and cannons",
      "A map of the whole world",
      "A pocket watch",
      "A plan to conquer Lilliput"
    ],
    answer: 0,
    explain: "Gulliver proudly explains how guns could flatten cities. The king is horrified that such \"an impotent and grovelling insect\" could have such inhuman ideas, and forbids him to mention it again. (Part II, Ch. 7)"
  },
  {
    id: "b5", section: "p2",
    q: "After Gulliver describes England's government, wars and history, what does the king conclude?",
    options: [
      "That England is the greatest nation on earth",
      "That most English people are \"the most pernicious race of little odious vermin\"",
      "That he would like to visit England",
      "That Gulliver must be lying"
    ],
    answer: 1,
    explain: "This is one of the most famous lines in the book. Gulliver thinks he's praising England; the wise king hears only corruption, greed and violence. (Part II, Ch. 6)"
  },
  {
    id: "b6", section: "p2",
    q: "How does Gulliver finally leave Brobdingnag?",
    options: [
      "He builds a tiny boat and rows away",
      "The queen sends him home on a giant ship",
      "An eagle snatches his travelling box and drops it in the sea, where an English ship finds him",
      "He rides on the back of a giant bird"
    ],
    answer: 2,
    explain: "While he naps in his box at the seaside, an eagle grabs it by the ring, flies off, and drops it into the ocean. Sailors haul it aboard and think he is mad when he talks about giants. (Part II, Ch. 8)"
  },

  // ---------- Part III ----------
  {
    id: "p1", section: "p3",
    q: "What keeps the flying island of Laputa in the air?",
    options: [
      "Giant balloons of hot air",
      "A huge magnet (loadstone) that is tilted to attract or repel the land below",
      "Thousands of trained birds",
      "Magic spells"
    ],
    answer: 1,
    explain: "A gigantic loadstone in a cave at the island's centre is tilted by astronomers so the island rises, sinks, or moves over the kingdom of Balnibarbi below. (Part III, Ch. 3)"
  },
  {
    id: "p2", section: "p3",
    q: "Why do important Laputans keep servants called 'flappers'?",
    options: [
      "To fan them in the heat",
      "To tap them with a bladder on the mouth and ears so they snap out of deep thought and can listen or speak",
      "To scare away birds",
      "To carry their books"
    ],
    answer: 1,
    explain: "Laputans are so lost in maths and music that they forget the real world. A flapper strikes them with a dried bladder (with pebbles in it) to remind them to pay attention. (Part III, Ch. 2)"
  },
  {
    id: "p3", section: "p3",
    q: "How does the king of Laputa punish a rebellious town on the ground?",
    options: [
      "He sends an army down by ladder",
      "He hovers the island above it to block sun and rain — or even drops the island onto it",
      "He cuts off its trade",
      "He sends the flappers to scold them"
    ],
    answer: 1,
    explain: "Floating overhead, the island causes darkness, disease and famine. But when the city of Lindalino fought back with its own magnets, the king had to give in. Swift is hinting at how England treated Ireland. (Part III, Ch. 3)"
  },
  {
    id: "p4", section: "p3",
    q: "Which of these is a real project at the Grand Academy of Lagado?",
    options: [
      "Extracting sunbeams out of cucumbers",
      "Inventing the steam engine",
      "Measuring the speed of light",
      "Breeding faster horses"
    ],
    answer: 0,
    explain: "One scientist had spent eight years on it. Others build houses from the roof down, plough fields with hogs, and turn ice into gunpowder. Swift is mocking useless 'experts' and their schemes. (Part III, Ch. 5)"
  },
  {
    id: "p5", section: "p3",
    q: "What is special about the governor of Glubbdubdrib?",
    options: [
      "He is a giant",
      "He can call up the ghosts of the dead to serve him and talk with visitors",
      "He can fly",
      "He never sleeps"
    ],
    answer: 1,
    explain: "Gulliver talks with ghosts such as Alexander the Great, Hannibal, Caesar, Brutus, Homer and Aristotle — and learns that history books are full of lies. (Part III, Ch. 7–8)"
  },
  {
    id: "p6", section: "p3",
    q: "What does Gulliver learn about the Struldbrugs of Luggnagg?",
    options: [
      "They are immortal and stay young forever",
      "They are immortal but keep growing older, sicker and more miserable — living forever is a curse",
      "They are giant birds",
      "They are the island's wisest rulers"
    ],
    answer: 1,
    explain: "Gulliver first dreams of the wonderful things he'd do if he were immortal. Then he learns they never die but never stop ageing — at 80 they are treated as legally dead, and at 90 they lose their teeth, hair, taste and memory. (Part III, Ch. 10)"
  },

  // ---------- Part IV ----------
  {
    id: "h1", section: "p4",
    q: "Why is Gulliver stranded in the land of the Houyhnhnms?",
    options: [
      "A storm sinks his ship",
      "His own crew mutinies, locks him up, and puts him ashore",
      "He is captured by Yahoos",
      "He gets lost on a hunting trip"
    ],
    answer: 1,
    explain: "Now a captain, he had to hire sailors who turned out to be buccaneers. They take over his ship and maroon him. (Part IV, Ch. 1)"
  },
  {
    id: "h2", section: "p4",
    q: "What are the Yahoos?",
    options: [
      "Wise, talking horses",
      "Filthy, greedy, human-like creatures who are kept like animals",
      "The servants of the king of Luggnagg",
      "Tiny people who live in trees"
    ],
    answer: 1,
    explain: "To Gulliver's horror, the Yahoos look like humans. The Houyhnhnms (the horses) see Gulliver as a strange, clever Yahoo who wears clothes. (Part IV, Ch. 1–2)"
  },
  {
    id: "h3", section: "p4",
    q: "Houyhnhnms say someone has \"said the thing which is not.\" What do they mean?",
    options: [
      "He has told a lie — they have no word for lying",
      "He has spoken a foreign language",
      "He has made a joke",
      "He has said something rude"
    ],
    answer: 0,
    explain: "The Houyhnhnms are guided by pure reason and have never needed a word for lying. Gulliver's master says it when he can't believe what Gulliver tells him about war. (Part IV, Ch. 4–5)"
  },
  {
    id: "h4", section: "p4",
    q: "Why must Gulliver leave the Houyhnhnms?",
    options: [
      "He is homesick for his family",
      "His master grows tired of him",
      "The general assembly fears a Yahoo with reason might lead the wild Yahoos against them",
      "He is caught stealing oats"
    ],
    answer: 2,
    explain: "The assembly issues an 'exhortation' (they have no word for command): either treat him like other Yahoos or send him away. Gulliver faints from grief, but obeys. (Part IV, Ch. 10)"
  },
  {
    id: "h5", section: "p4",
    q: "What does Gulliver use to build and cover his escape canoe?",
    options: [
      "Branches and the skins of Yahoos",
      "Parts of his old ship",
      "Woven grass",
      "A hollow log the horses carved"
    ],
    answer: 0,
    explain: "With the sorrel nag's help he builds an Indian-style canoe and covers it with Yahoo skins — a dark detail that shows how completely he now sides with the horses. (Part IV, Ch. 10)"
  },
  {
    id: "h6", section: "p4",
    q: "What happens when Gulliver finally gets home?",
    options: [
      "He throws a big party for his family",
      "He writes a letter to the king",
      "He faints when his wife kisses him, and spends his time talking to two horses he buys",
      "He sets off on a fifth voyage"
    ],
    answer: 2,
    explain: "He can't stand the smell or touch of his family (\"Yahoos\") and talks to his horses at least four hours a day. Even kind Captain Pedro de Mendez, who rescued him, could not change his mind. (Part IV, Ch. 11)"
  },

  // ---------- Connections ----------
  {
    id: "c1", section: "links",
    q: "In what order do Gulliver's four voyages happen?",
    options: [
      "Brobdingnag → Lilliput → Houyhnhnms → Laputa",
      "Lilliput → Brobdingnag → Laputa → Houyhnhnms",
      "Lilliput → Laputa → Brobdingnag → Houyhnhnms",
      "Laputa → Lilliput → Brobdingnag → Houyhnhnms"
    ],
    answer: 1,
    explain: "Small → Big → Up in the air → Horses. A handy memory hook: \"Little, Big, Brainy, Beasts.\""
  },
  {
    id: "c2", section: "links",
    q: "Look at how each voyage goes wrong. What pattern do you see?",
    options: [
      "Each disaster is caused by bad weather",
      "The disasters get more and more human-made: a storm, then being abandoned, then pirates, then his own crew's mutiny",
      "Each time he is captured by the same pirates",
      "Each disaster is his own fault"
    ],
    answer: 1,
    explain: "Nature wrecks him first, then his shipmates desert him, then strangers attack him, and finally his own men betray him. It's a ladder that points straight at the book's ending: humans are the real danger."
  },
  {
    id: "c3", section: "links",
    q: "Parts I and II are mirrors. In Brobdingnag, Gulliver plays the role the Lilliputians played in Part I. What does that mean?",
    options: [
      "He becomes the one who is tiny, proud and boastful — while a giant looks down and sees how petty he is",
      "He becomes a ruler of a small kingdom",
      "He fights in a war over eggs",
      "He is again tied down by ropes"
    ],
    answer: 0,
    explain: "In Lilliput, Gulliver laughs at tiny people fighting over eggs and heels. In Brobdingnag, the giant king laughs at tiny Gulliver bragging about England. Size changes, and so does who looks ridiculous."
  },
  {
    id: "c4", section: "links",
    q: "How has Gulliver changed by the end of the book?",
    options: [
      "He is prouder of England than ever",
      "He has become a famous explorer and statesman",
      "He has gone from a curious, proud Englishman to someone who can't bear other humans",
      "He has not changed at all"
    ],
    answer: 2,
    explain: "Each voyage chips away at his pride in humankind. By the end he is a misanthrope (someone who dislikes humanity). Many readers think Swift wants us to laugh at Gulliver here, too — he has gone too far the other way."
  }
];
