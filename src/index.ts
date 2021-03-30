import Game from './Game';
import './styles.scss';
import { windowBounds } from './utils';

const HIGH_SCORE = 'sg_+sdlkfj234fsd1!@#$';

function updateScoreView(score: number) {
  const scoreEle = document.getElementById('score');
  if (scoreEle) {
    scoreEle.innerHTML = score.toString();
  }
}

function updateHighScoreView(highScore: number | string) {
  const highScoreEle = document.getElementById('highScore');
  if (highScoreEle) {
    highScoreEle.innerHTML = highScore.toString();
  }
}

export function main() {
  const { width, height } = windowBounds();

  let highScore = localStorage.getItem(HIGH_SCORE) || 40;

  // initialize scoring views
  updateHighScoreView(highScore);
  updateScoreView(40);

  const game = Game.init({
    height,
    width: width * 0.75,
    onPlay: updateScoreView,
    onScoreUpdate: (score) => {
      if (score >= highScore) {
        highScore = score;
        localStorage.setItem(HIGH_SCORE, score.toString());
        updateHighScoreView(highScore);
      }
      updateScoreView(score);
    },
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      game.pause();
    }
  });
}

main();
