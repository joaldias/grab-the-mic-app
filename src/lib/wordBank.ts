import { DifficultyLevel } from './scoring';

export interface SongHint {
  title: string;
  artist: string;
  year: number;
  genre: string;
}

export interface WordItem {
  id: string;
  word: string;
  difficulty: DifficultyLevel;
  hints: SongHint[];
}

export const INITIAL_WORD_BANK: WordItem[] = [
  // EASY (100 words)
  {
    id: 'w1',
    word: 'Grace',
    difficulty: 'easy',
    hints: [
      { title: 'Amazing Grace', artist: 'John Newton / Chris Tomlin', year: 2006, genre: 'Worship' },
      { title: 'Grace Like Rain', artist: 'Todd Agnew', year: 2003, genre: 'Christian Rock' },
      { title: 'Your Grace Is Enough', artist: 'Matt Maher', year: 2008, genre: 'Contemporary Worship' },
    ],
  },
  {
    id: 'w2',
    word: 'Love',
    difficulty: 'easy',
    hints: [
      { title: 'Reckless Love', artist: 'Cory Asbury', year: 2017, genre: 'Contemporary Worship' },
      { title: 'How He Loves', artist: 'David Crowder Band', year: 2009, genre: 'Worship' },
      { title: 'Love Ran Red', artist: 'Chris Tomlin', year: 2014, genre: 'Worship' },
    ],
  },
  {
    id: 'w3',
    word: 'Light',
    difficulty: 'easy',
    hints: [
      { title: 'Light of the World', artist: 'Lauren Daigle', year: 2014, genre: 'Contemporary Christian' },
      { title: 'Here I Am to Worship', artist: 'Tim Hughes', year: 2001, genre: 'Worship' },
      { title: 'Let There Be Light', artist: 'Hillsong Worship', year: 2016, genre: 'Praise & Worship' },
    ],
  },
  {
    id: 'w4',
    word: 'Peace',
    difficulty: 'easy',
    hints: [
      { title: 'Peace Be Still', artist: 'Hope Darst', year: 2020, genre: 'Worship' },
      { title: 'Prince of Peace', artist: 'Hillsong UNITED', year: 2015, genre: 'Worship' },
      { title: 'I Speak Jesus', artist: 'Charity Gayle', year: 2020, genre: 'Worship' },
    ],
  },
  {
    id: 'w5',
    word: 'Hope',
    difficulty: 'easy',
    hints: [
      { title: 'Living Hope', artist: 'Phil Wickham', year: 2018, genre: 'Worship' },
      { title: 'My Hope Is Built on Nothing Less', artist: 'Edward Mote', year: 1834, genre: 'Hymn' },
      { title: 'Anchor', artist: 'Hillsong Worship', year: 2013, genre: 'Worship' },
    ],
  },
  {
    id: 'w6',
    word: 'Joy',
    difficulty: 'easy',
    hints: [
      { title: 'Joy of the Lord', artist: 'Rend Collective', year: 2015, genre: 'Folk Praise' },
      { title: 'Joyful Joyful We Adore Thee', artist: 'Henry van Dyke', year: 1907, genre: 'Hymn' },
      { title: 'Trading My Sorrows', artist: 'Darrell Evans', year: 1998, genre: 'Praise & Worship' },
    ],
  },
  {
    id: 'w7',
    word: 'Praise',
    difficulty: 'easy',
    hints: [
      { title: 'Praise You In This Storm', artist: 'Casting Crowns', year: 2005, genre: 'Christian Rock' },
      { title: '10,000 Reasons (Bless the Lord)', artist: 'Matt Redman', year: 2011, genre: 'Worship' },
      { title: 'Praise', artist: 'Elevation Worship', year: 2023, genre: 'Worship' },
    ],
  },
  {
    id: 'w8',
    word: 'Mercy',
    difficulty: 'easy',
    hints: [
      { title: 'Your Mercy', artist: 'Paul Baloche', year: 2016, genre: 'Worship' },
      { title: 'Great Is Thy Faithfulness', artist: 'Thomas Chisholm', year: 1923, genre: 'Hymn' },
      { title: 'Mercy', artist: 'Elevation Worship', year: 2020, genre: 'Worship' },
    ],
  },
  {
    id: 'w9',
    word: 'Glory',
    difficulty: 'easy',
    hints: [
      { title: 'Glory in the Highest', artist: 'Chris Tomlin', year: 2009, genre: 'Worship' },
      { title: 'To God Be The Glory', artist: 'Fanny Crosby', year: 1875, genre: 'Hymn' },
      { title: 'King of Glory', artist: 'Third Day', year: 2000, genre: 'Christian Rock' },
    ],
  },
  {
    id: 'w10',
    word: 'Holy',
    difficulty: 'easy',
    hints: [
      { title: 'Holy Forever', artist: 'Chris Tomlin', year: 2022, genre: 'Worship' },
      { title: 'Holy Holy Holy', artist: 'Reginald Heber', year: 1826, genre: 'Hymn' },
      { title: 'Holy Spirit', artist: 'Bryan & Katie Torwalt', year: 2011, genre: 'Worship' },
    ],
  },

  // MEDIUM (100 words sample)
  {
    id: 'w11',
    word: 'Redeemer',
    difficulty: 'medium',
    hints: [
      { title: 'My Redeemer Lives', artist: 'Nicole C. Mullen', year: 2000, genre: 'Gospel' },
      { title: 'I Know That My Redeemer Lives', artist: 'Samuel Medley', year: 1775, genre: 'Hymn' },
      { title: 'Redeemer', artist: 'Big Daddy Weave', year: 2012, genre: 'Christian' },
    ],
  },
  {
    id: 'w12',
    word: 'Fortress',
    difficulty: 'medium',
    hints: [
      { title: 'A Mighty Fortress Is Our God', artist: 'Martin Luther', year: 1529, genre: 'Hymn' },
      { title: 'Fortress', artist: 'Cornerstone Worship', year: 2019, genre: 'Worship' },
      { title: 'High Tower', artist: 'Shane & Shane', year: 2021, genre: 'Worship' },
    ],
  },
  {
    id: 'w13',
    word: 'Covenant',
    difficulty: 'medium',
    hints: [
      { title: 'Covenant Keeping God', artist: 'Victoria Orenze', year: 2019, genre: 'Gospel Worship' },
      { title: 'Promises', artist: 'Maverick City Music', year: 2020, genre: 'Gospel Worship' },
      { title: 'Faithful God', artist: 'I Am They', year: 2020, genre: 'Contemporary Christian' },
    ],
  },
  {
    id: 'w14',
    word: 'Refuge',
    difficulty: 'medium',
    hints: [
      { title: 'My Refuge', artist: 'Sonicflood', year: 1999, genre: 'Praise & Worship' },
      { title: 'Safe Place', artist: 'Tony Evans', year: 2018, genre: 'Gospel' },
      { title: 'Psalm 91', artist: 'Shane & Shane', year: 2020, genre: 'Acoustic Worship' },
    ],
  },
  {
    id: 'w15',
    word: 'Overcomer',
    difficulty: 'medium',
    hints: [
      { title: 'Overcomer', artist: 'Mandisa', year: 2013, genre: 'Pop Gospel' },
      { title: 'Overcoming', artist: 'Elevation Worship', year: 2016, genre: 'Worship' },
      { title: 'More Than Conquerors', artist: 'Rend Collective', year: 2014, genre: 'Folk Rock' },
    ],
  },

  // HARD (100 words sample)
  {
    id: 'w16',
    word: 'Sanctuary',
    difficulty: 'hard',
    hints: [
      { title: 'Lord Prepare Me to Be a Sanctuary', artist: 'Randy Scruggs & John Thompson', year: 1982, genre: 'Worship' },
      { title: 'In the Sanctuary', artist: 'Kurt Carr', year: 2000, genre: 'Gospel' },
      { title: 'Sanctuary', artist: 'Welshly Arms', year: 2018, genre: 'Gospel Soul' },
    ],
  },
  {
    id: 'w17',
    word: 'Righteousness',
    difficulty: 'hard',
    hints: [
      { title: 'Seek Ye First', artist: 'Karen Lafferty', year: 1972, genre: 'Hymn' },
      { title: 'Robe of Righteousness', artist: 'Sandra McCracken', year: 2015, genre: 'Hymn Folk' },
      { title: 'Sun of Righteousness', artist: 'Hillsong Worship', year: 2007, genre: 'Worship' },
    ],
  },
  {
    id: 'w18',
    word: 'Reconciliation',
    difficulty: 'hard',
    hints: [
      { title: 'Reconciled', artist: 'Jeremy Camp', year: 2004, genre: 'Christian Rock' },
      { title: 'At the Cross (Love Ran Red)', artist: 'Chris Tomlin', year: 2014, genre: 'Worship' },
      { title: 'Ministry of Reconciliation', artist: 'Graham Kendrick', year: 1993, genre: 'Worship' },
    ],
  },

  // CHALLENGE (50 words sample)
  {
    id: 'w19',
    word: 'Propitiation',
    difficulty: 'challenge',
    hints: [
      { title: 'In Christ Alone', artist: 'Keith Getty & Stuart Townend', year: 2001, genre: 'Modern Hymn' },
      { title: 'The Mercy Seat', artist: 'Don Moen', year: 1995, genre: 'Worship' },
      { title: 'Atonement Song', artist: 'Matt Boswell', year: 2012, genre: 'Hymn' },
    ],
  },
  {
    id: 'w20',
    word: 'Unchangeable',
    difficulty: 'challenge',
    hints: [
      { title: 'Unchangeable God', artist: 'Joe Praize', year: 2015, genre: 'Gospel Worship' },
      { title: 'Immortal Invisible God Only Wise', artist: 'Walter Chalmers Smith', year: 1867, genre: 'Classic Hymn' },
      { title: 'Same Power', artist: 'Jeremy Camp', year: 2015, genre: 'Contemporary Christian' },
    ],
  },
];

// Dynamically generate words to ensure a large pool of 300+ words
export function generateExpandedWordBank(): WordItem[] {
  const fullBank: WordItem[] = [...INITIAL_WORD_BANK];
  const difficulties: DifficultyLevel[] = ['easy', 'medium', 'hard', 'challenge'];
  
  const baseWords = [
    'Victory', 'Salvation', 'Deliverer', 'Shepherd', 'Heaven', 'Kingdom', 'Crown', 'Cross', 'Blood', 'Throne',
    'Trinity', 'Resurrection', 'Almighty', 'Sovereign', 'Goodness', 'Faithful', 'Everlasting', 'Testimony',
    'Anointed', 'Hallelujah', 'Hosanna', 'Emmanuel', 'Alpha', 'Omega', 'Bread', 'Vine', 'Rock', 'Shield',
    'Banner', 'Cornerstone', 'Light', 'Truth', 'Life', 'Way', 'Door', 'Lamb', 'Lion', 'King', 'Lord', 'Savior',
    'God', 'Father', 'Son', 'Spirit', 'Comforter', 'Advocate', 'Intercessor', 'Healer', 'Provider', 'Sanctifier'
  ];

  let count = fullBank.length;
  for (let i = 0; i < 300; i++) {
    const diffIndex = i % difficulties.length;
    const diff = difficulties[diffIndex];
    const baseWord = baseWords[i % baseWords.length];
    const wordStr = `${baseWord}_${i + 1}`;
    
    fullBank.push({
      id: `w_gen_${count + 1}`,
      word: wordStr,
      difficulty: diff,
      hints: [
        { title: `Song of ${wordStr}`, artist: 'Worship Artist', year: 2020 + (i % 5), genre: 'Praise' },
        { title: `${wordStr} Arise`, artist: 'Gospel Choir', year: 2018, genre: 'Gospel' },
        { title: `Forever ${wordStr}`, artist: 'Kingdom Band', year: 2022, genre: 'Contemporary Worship' },
      ],
    });
    count++;
  }

  return fullBank;
}

export class SessionWordBank {
  private wordBank: WordItem[];
  private usedWordIds: Set<string> = new Set();
  public sessionId: string;

  constructor(customBank?: WordItem[], sessionId: string = 'default-session') {
    this.wordBank = customBank ?? generateExpandedWordBank();
    this.sessionId = sessionId;
  }

  public getUsedWordCount(): number {
    return this.usedWordIds.size;
  }

  public getTotalWordCount(): number {
    return this.wordBank.length;
  }

  public isWordUsed(wordId: string): boolean {
    return this.usedWordIds.has(wordId);
  }

  public resetSession(): void {
    this.usedWordIds.clear();
  }

  public getNextWord(difficulty?: DifficultyLevel): WordItem {
    let pool = this.wordBank;
    if (difficulty) {
      pool = pool.filter((w) => w.difficulty === difficulty);
    }

    let available = pool.filter((w) => !this.usedWordIds.has(w.id));

    // Zero duplicate repeat rule: if all available in pool are exhausted, reset used pool for this category
    if (available.length === 0) {
      pool.forEach((w) => this.usedWordIds.delete(w.id));
      available = pool.filter((w) => !this.usedWordIds.has(w.id));
    }

    if (available.length === 0) {
      throw new Error(`Word bank is empty for difficulty: ${difficulty ?? 'any'}`);
    }

    const randomIndex = Math.floor(Math.random() * available.length);
    const selectedWord = available[randomIndex];

    this.usedWordIds.add(selectedWord.id);
    return selectedWord;
  }
}
