
export interface GameStats {
  score: number;
  highScore: number;
  merges: number;
  highestTile: number;
  isGameOver: boolean;
}

export interface CircleDefinition {
  value: number;
  radius: number;
  color: string;
  textColor: string;
}

export interface CommentaryMessage {
  text: string;
  type: 'info' | 'success' | 'warning' | 'danger';
}
