/**
 * Mission 1 — Basic Zeroing
 *
 * Static frontal silhouette targets at 25m, 50m, and 100m.
 * 15 rounds, 45 seconds, no environmental modifiers.
 * Pass: >= 80% accuracy AND >= 1,000 pts.
 */
export const Mission1 = {
  number:      1,
  codename:    'BASIC ZEROING',
  objective:   'Engage static silhouette targets at 25m, 50m, and 100m.',
  constraints: '15 ROUNDS  |  45 SECONDS  |  NO ENVIRONMENTAL INTERFERENCE',
  threshold:   '>= 80% ACCURACY  |  >= 1,000 PTS',

  totalAmmo:   15,
  magCapacity: 15,
  timeLimit:   45,

  // Static target placements (logical 1920×1080 coords)
  targets: [
    { x: 480,  y: 640, distance: '25m'  },
    { x: 960,  y: 510, distance: '50m'  },
    { x: 1440, y: 430, distance: '100m' },
  ],

  /** @param {{accuracy: number, totalScore: number}} stats */
  checkPass(stats) {
    return stats.accuracy >= 80 && stats.totalScore >= 1000;
  },
};

