'use client';
import { db } from '../../firebase';
import AuthForm from '../components/form';
import Section from '../components/section';
import { doc, setDoc } from 'firebase/firestore';
import { formatDate, StateContext } from '../home';
import LeaderBoard from '../components/leaderboard';
import { useContext, useEffect, useRef, useState } from 'react';

export default function Game() {
  let runGame: any;
  let startHP = 100;
  let startScore = 0;
  let lowHealth = 25;
  let medHealth = 50;
  let playerSpeed = 1;
  let startDamage = 2;
  let enemyScale = 15;
  let coinsDistance = 1;
  let controlWidth = 115;
  let coinsPlacement = 80;
  let initialDeathTimer = 25;
  let initialMoveSpeed = 2.5;
  let playerInput: any = null;
  let loadedRef = useRef(false);
  let [hits, setHits] = useState(0);
  let [time, setTime] = useState(0);
  let [win, setWin] = useState(false);
  let [points, setPoints] = useState(0);
  let [deaths, setDeaths] = useState(0);
  let [hurt, setHurt] = useState(false);
  let [game, setGame] = useState(false);
  let [speed, setSpeed] = useState(2500);
  let dangerColor = `var(--dangerColor)`;
  let [movement, setMovement] = useState(0);
  let [scoring, setScoring] = useState(false);
  let [score, setScore] = useState(startScore);
  let [leftWind, setLeftWind] = useState(false);
  let [gameOver, setGameOver] = useState(false);
  let [jumpSpeed, setJumpSpeed] = useState(500);
  let [totalDamage, setTotalDamage] = useState(0);
  let [gameHeight, setGameHeight] = useState(415);
  let [damage, setDamage] = useState(startDamage);
  let [prevHealth, setPrevHealth] = useState(100);
  let [gameLoaded, setGameLoaded] = useState(true);
  let [direction, setDirection] = useState(`standing`);
  let [initialHealth, setInitialHealth] = useState(startHP);
  let [deathTimer, setDeathTimer] = useState(initialDeathTimer);
  let [gameBackground, setGameBackground] = useState( `#74d7ff`);
  let [moveSpeed, setMoveSpeed] = useState<any>(initialMoveSpeed);
  let [controls, setControls] = useState({minWidth: controlWidth});
  let playerAnim = `https://assets7.lottiefiles.com/packages/lf20_9xRdLu.json`;
  let shipAnim = `https://lottie.host/520bb91b-0130-4949-91d1-3a512fde1751/UGP7Ccvvfl.json`;
  let cloudsAnimation = `https://assets8.lottiefiles.com/datafiles/mBcU0bs3hiqgyCF/data.json`;
  let { width, updates, setUpdates, user, setPage, setUser, focus, setFocus, users, highScore, setHighScore, authState, devEnv, showLeaders, setShowLeaders } = useContext(StateContext);
  let initialBounds = {background: `var(--ground)`, height: 40, width: `${initialHealth}%`, color: `white`, fontWeight: 700};
  let initialPlayer = {height: 55, width: 55, bottom: initialBounds.height - 1, left: 70};
  let [finish, setFinish] = useState({background: `var(--blackGlass)`, height: 80, width: controlWidth, bottom: initialBounds.height - 1, right: 25, borderRadius: 4});
  let [enemy, setEnemy] = useState({background: `transparent`, height: initialPlayer.height - (enemyScale), width: initialPlayer.width - (enemyScale), bottom: initialBounds.height - 1, left: 25, animation: `enemy ${speed}ms linear infinite`});
  let [ground, setGround] = useState({...initialBounds, width: `100%`, background: `transparent`});
  let [health, setHealth] = useState(initialBounds);
  let [player, setPlayer] = useState(initialPlayer);

  const startGame = (Event?: Event) => {
    setUpdates(updates+1);
    if (Event) setGame(true);

    if (playerInput == null) {
      playerInput = window.addEventListener(`keyup`, KeyboardEvent => {
        KeyboardEvent.preventDefault();
        let gameKeys = [`Enter`];
        let exitKeys = [`Escape`];
        let nullKeys = [`ArrowDown`];
        let leftKeys = [`ArrowLeft`, `KeyA`];
        let rightKeys = [`ArrowRight`, `KeyD`];
        let jumpKeys = [`ArrowUp`, `Space`, `KeyW`];

        if (document.querySelector(`.gameOver`) && isElementInView(document.querySelector(`.gameOver`)) && gameKeys.includes(KeyboardEvent.code)) {
          saveAndRestartGame(true);
        }
        
        let jumpButton: any = document.querySelector(`#jumpButton`);
        let moveLeftButton: any = document.querySelector(`#moveLeftButton`);
        let moveRightButton: any = document.querySelector(`#moveRightButton`);
        if (leftKeys.includes(KeyboardEvent.code)) {
          if (moveLeftButton) moveLeftButton.click();
        } else  if (rightKeys.includes(KeyboardEvent.code)) {
          if (moveRightButton) moveRightButton.click();
        } else if (jumpKeys.includes(KeyboardEvent.code)) {
          if (jumpButton) jumpButton.click();
        } else if (exitKeys.includes(KeyboardEvent.code)) {
          hardReset();
        } else if (nullKeys.includes(KeyboardEvent.code)) {
          return;
        } else {
          if (game) {
            console.log(`Playing Game`, KeyboardEvent);
          } else {
            if (gameKeys.includes(KeyboardEvent.code) && !game) setGame(true);
          }
        }
      });
    }
  }

  const moveLeft = () => {
    if (player.left > 70) {
      setLeftWind(true);
      let distance = player.left - (moveSpeed * 35);
      setMovement(2);
      setDirection(`left`);
      setUpdates(updates+1);
      setPlayer({...player, left: distance});
      setLeftWind(false);
    }
  }
  
  const moveRight = () => {
    let plyr: any = document.querySelector(`.player`)?.getBoundingClientRect();
    if (plyr.left < (width - (width/8))) {
      let distance = plyr.left + (moveSpeed * 35);
      setMovement(2);
      setDirection(`right`);
      setUpdates(updates+1);
      setPlayer({...player, left: distance});
    }
  }

  const jump = () => {
    let plyr: any = document.querySelector(`.player`)?.getBoundingClientRect();
    let distance = (plyr.bottom / 16) + (moveSpeed * 50) > 250 ? 250 : (plyr.bottom / 16) + (moveSpeed * 50);
    setUpdates(updates+1);
    setPlayer({...player, bottom: distance});
    setTimeout(() => setPlayer({...player, bottom: initialPlayer.bottom}), (jumpSpeed / (speed / 2000)));
  }

  const genSeconds = (seconds?:any) => {
    let date = new Date(seconds * 1000).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      useGrouping: false
    } as any);
    return date?.substr(date?.length - 8, 5);
  }

  const updateGame = () => {
    let tim: any = document.querySelector(`.time`);
    let spd: any = document.querySelector(`#speed`);
    let ded: any = document.querySelector(`.deaths`);
    let dmg: any = document.querySelector(`#damage`);
    let pnts: any = document.querySelector(`.points`);
    let dthtm: any = document.querySelector(`#deathTimer`);
    let jmpSpd: any = document.querySelector(`#jumpSpeed`);
    let mvspd: any = document.querySelector(`#moveSpeed`);
    let hlth: any = document.querySelector(`.healthPoints`);
    let hlthPts: any = parseFloat(hlth?.innerHTML);
    let ctrls: any = document.querySelector(`.controls`)?.getBoundingClientRect();
    let plyr: any = document.querySelector(`.player`)?.getBoundingClientRect();
    let enmy: any = document.querySelector(`.enemy`)?.getBoundingClientRect();
    let fnsh: any = document.querySelector(`.finish`)?.getBoundingClientRect();
    let enemies: any =  document.querySelectorAll(`.enemy`);
    setFinish({...finish, width: ctrls?.width});
    setDeathTimer(parseFloat(dthtm?.value));
    setJumpSpeed(parseFloat(jmpSpd?.value));
    setMoveSpeed(parseFloat(mvspd?.value));
    setDamage(parseFloat(dmg?.value));
    setSpeed(parseFloat(spd?.value));
    setLeftWind(false);

    if (plyr && enmy && fnsh) {
      setEnemy({...enemy, animation: `enemy ${parseFloat(spd?.value)}ms linear infinite`});

      // Check for Game Active
      let gameActive = document.querySelector(`.enemy`)?.classList?.contains(`moving`);
      if (gameActive) {
        setTime(parseFloat(tim?.innerHTML) + 0.01);
        if (enemies.length > 1) {
          enemies.forEach((enmi: any) => {
            let enmy = enmi?.getBoundingClientRect();
            damagePlayerWithMultipleEnemies(plyr, enmy, dmg, hlthPts, ded);
          });
        } else if (plyr.right >= enmy.left && 
          plyr.left <= enmy.right && 
          plyr.bottom >= enmy.top &&
          plyr.top <= enmy.bottom) {
            if (hlthPts > 0) {
              setHurt(true);
              setScoring(false);
              setHealth({...health, width: `${hlthPts - (dmg.value / 2)}%`, background: hlthPts <= lowHealth ? `rgba(184, 13, 0, 0.75)` : (hlthPts <= medHealth ? `#cbcb1c` : initialBounds.background), color: hlthPts <= lowHealth ? `white` : (hlthPts <= medHealth ? `black` : `white`), fontWeight: hlthPts <= lowHealth ? 700 : (hlthPts <= medHealth ? 500 : 700)});
              setHits(JSON.parse(localStorage.getItem(`health`) as any) - (hlthPts - 1) > (((damage * 10) * (speed /3333))/1.5) ? ((JSON.parse(localStorage.getItem(`health`) as any) - (hlthPts - 1)) / 2) : JSON.parse(localStorage.getItem(`health`) as any) - (hlthPts - 1));
              setTotalDamage(totalDamage + (prevHealth - parseFloat(health.width)));
              calcScore(true);
              setTimeout(() => {
                let hit: any = document.querySelector(`.hits`);
                if (parseFloat(hit?.innerHTML) != 0) {
                  localStorage.setItem(`health`, JSON.stringify(hlthPts));
                  setPrevHealth(hlthPts);
                };
                setHurt(false);
                setHits(0);
              }, 500);
            } else {
              // localStorage.setItem(`deaths`, JSON.stringify(parseInt(ded?.innerHTML) + 1));
              setDeaths(parseInt(ded?.innerHTML) + 1);
              setScoring(false);
              calcScore(true);
              restartGame();
            }
          } else if (plyr.right >= fnsh.left && 
            plyr.left <= fnsh.right && 
            plyr.bottom >= fnsh.top &&
            plyr.top <= fnsh.bottom) {
              let gameActive: any = document.querySelector(`.enemy`)?.classList?.contains(`moving`);
              setWin(gameActive ? true : false);
              setTimeout(() => resetPlayer(true), 490);
              setPoints(parseInt(pnts?.innerHTML) + (gameActive ? 1 : 0));
              setScoring(true);
              calcScore();
          } else if (plyr.right >= enmy.left && 
            plyr.left <= enmy.right) {
              let gameActive: any = document.querySelector(`.enemy`)?.classList?.contains(`moving`);
              setPoints(parseInt(pnts?.innerHTML) + (gameActive ? 1 : 0));
              setScoring(false);
              calcScore();
          }
      };
      
      // Check for Game Over
      if (hlthPts <= 0) {
        setHealth({...health, width: `${0}%`, background: hlthPts <= lowHealth ? `rgba(184, 13, 0, 0.75)` : (hlthPts <= medHealth ? `#cbcb1c` : initialBounds.background), color: hlthPts <= lowHealth ? `white` : (hlthPts <= medHealth ? `black` : `white`), fontWeight: hlthPts <= lowHealth ? 700 : (hlthPts <= medHealth ? 500 : 700)});
        // localStorage.setItem(`deaths`, JSON.stringify(parseInt(ded?.innerHTML) + 1));
        setDeaths(parseInt(ded?.innerHTML) + 1);
        setGameOver(true);
        setGame(false);
        saveScore();
      } else if ((parseFloat(tim?.innerHTML) + 0.01) > parseFloat((document.querySelector(`.deathTime`) as any)?.innerHTML)) {
        if (!document.querySelector(`.gameOver`) || !isElementInView(document.querySelector(`.gameOver`))) {
          // localStorage.setItem(`deaths`, JSON.stringify(parseInt(ded?.innerHTML) + 1));
          setDeaths(parseInt(ded?.innerHTML) + 1);
          setGameOver(true);
          resetPlayer();
          saveScore();
        }
      };
    } else {
      endGame();
    }
  }

  const clickReset = () => {
    let storedUser = JSON.parse(localStorage.getItem(`user`) as any);
    let currentUser = storedUser;
    window.location.reload();
    if (currentUser) localStorage.removeItem(`highScore`);
  }
  
  const resetPlayer = (fast?: boolean) => {
    window.removeEventListener(`keydown`, playerInput);
    setDeathTimer(initialDeathTimer);
    setPlayer(initialPlayer);
    setDamage(startDamage);
    setDirection(`left`);
    setJumpSpeed(500);
    setSpeed(2500);
    if (fast) {
      setGame(true);
    } else {
      setGame(false);
    }
  }

  const endGame = () => {
    let hp: any = document.querySelector(`#initialHealth`);
    setHealth({...initialBounds, width: `${parseFloat(hp?.value) || startHP}%`});
    window.removeEventListener(`keydown`, playerInput);
    localStorage.setItem(`health`, `100`);
    setDeathTimer(initialDeathTimer);
    setPlayer(initialPlayer);
    setDamage(startDamage);
    setJumpSpeed(500);
    setSpeed(2500);
    setGame(false);
  }

  const hardReset = () => {
    endGame();
    setTime(0);
    setScore(startScore);
    setPoints(0);
    setWin(false);
    setMovement(0);
    setGameOver(false);
    setDirection(`standing`);
    // window.location.reload();
  }

  const restartGame = () => {
    endGame();
    startGame();
  }

  const resetGame = () => {
    endGame();
    setTime(0);
  }

  const saveAndRestartGame = (fast?: any) => {
    let hp: any = document.querySelector(`#initialHealth`);
    setTime(0);
    setPoints(0);
    setWin(false);
    setGameOver(false);
    if (fast) {     
      setScore(startScore);
      setPlayer(initialPlayer);
      setHealth({...initialBounds, width: `${parseFloat(hp?.value) || startHP}%`});
      localStorage.setItem(`health`, `100`);
    }
    startGame();
  }

  const saveScore = (clickEvent?: any) => {
    let storedHighScore = JSON.parse(localStorage.getItem(`highScore`) as any);
    let storedScore = JSON.parse(localStorage.getItem(`score`) as any);
    let storedUser = JSON.parse(localStorage.getItem(`user`) as any);
    let currentUser = storedUser;
    let currentScore = Math.floor(storedScore);
    if (currentScore > storedHighScore) setHighScore(currentScore);
    if (currentUser) {
      if (currentScore > currentUser?.highScore) {
        setHighScore(currentScore);
        addOrUpdateUserGame(currentUser?.id, { ...currentUser, deaths, highScore: currentScore, updated: formatDate(new Date())});
        localStorage.setItem(`highScore`, JSON.stringify(currentScore));
      };
    } else {
      if (clickEvent) {
        let emailField: any = document.querySelector(`input[type=email]`);
        setFocus(true);
        emailField?.classList.toggle(`attention`);
        setTimeout(() => emailField?.classList.toggle(`attention`), 1000);
        emailField?.focus();
      }
      localStorage.setItem(`highScore`, JSON.stringify(currentScore));
    }
  }

  const calcScore = (decrease?: any) => {
    let ded: any = document.querySelector(`.deaths`);
    let hlth: any = document.querySelector(`.healthPoints`);
    let hlthPts: any = parseFloat(hlth?.innerHTML);
    let dam: any = (100 - hlthPts) / 2;
    let dmg: any = document.querySelector(`#damage`);
    let pnts: any = document.querySelector(`.points`);
    let tim: any = document.querySelector(`.time`);
    let dths: any = parseInt(ded?.innerHTML);
    let pts: any = parseInt(pnts?.innerHTML);
    let times: any = parseInt(tim?.innerHTML) + 0.01;
    let scr: any = parseInt((document.querySelector(`#score`) as any)?.innerHTML?.replace(/,/g, ``));
    let healthBonus = hlthPts < 10 ? 10 : hlthPts;
    let rawScore: any = pts > 15 ? ((pts - dam) * healthBonus) : ((15 - dam) * healthBonus);
    let scor = Math.abs(parseInt((rawScore / times) as any));
    let min = (parseFloat(dmg?.value) * 8) * (speed /8000);
    let max = (parseFloat(dmg?.value) * 10) * (speed /3333);
    let scoreVariables = {times, scr, healthBonus, damage, initialHealth, deathTimer, min, max};
    let bonus = Math.floor(Math.random() * (scoreVariables.max - scoreVariables.min) + scoreVariables.min) * (deathTimer + deathTimer);
    let scoreToSet: any = 0;
    if (decrease) {
      if (scr > 0) {
        scoreToSet = scr - (bonus * min);
      } else {
        scoreToSet = 0;
      }
    } else {
      scoreToSet = scr + (bonus * max);
    }
    setScore(scoreToSet);
    localStorage.setItem(`score`, JSON.stringify(scoreToSet));
  }

  const clearHighScore = () => {
    setScore(startScore);
    setHighScore(startScore);
    localStorage.removeItem(`score`);
    localStorage.removeItem(`highScore`);
  }

  const changeHP = () => {
    let hp: any = document.querySelector(`#initialHealth`);
    setHealth({...health, width: `${parseFloat(hp?.value)}%`});
    setInitialHealth(parseFloat(hp?.value));
  }

  const addOrUpdateUserGame = async (id: any, user: User) => {
    setDoc(doc(db, `users`, id), { ...user, id }).then(newSub => {
      localStorage.setItem(`user`, JSON.stringify({ ...user, id }));
      setUser({ ...user, id });
      setUpdates(updates + 1);
      return newSub;
    }).catch(error => console.log(error));
  }

  const isElementInView = (element: any) => {
    if (element) {
      let rect = element.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    } else {
      return false;
    }
  }

  const damagePlayerWithMultipleEnemies = (plyr: any, enmy: any, dmg: any, hlthPts: any, ded: any) => {
    if (plyr.right >= enmy.left && 
      plyr.left <= enmy.right && 
      plyr.bottom >= enmy.top &&
      plyr.top <= enmy.bottom) {
        if (hlthPts > 0) {
          setHurt(true);
          setHealth({...health, width: `${hlthPts - dmg.value}%`, background: hlthPts <= lowHealth ? `rgba(184, 13, 0, 0.75)` : (hlthPts <= medHealth ? `#cbcb1c` : initialBounds.background), color: hlthPts <= lowHealth ? `white` : (hlthPts <= medHealth ? `black` : `white`), fontWeight: hlthPts <= lowHealth ? 700 : (hlthPts <= medHealth ? 500 : 700)});
          setHits(JSON.parse(localStorage.getItem(`health`) as any) - (hlthPts - 1) > (((damage * 10) * (speed /3333))/1.5) ? ((JSON.parse(localStorage.getItem(`health`) as any) - (hlthPts - 1)) / 2) : JSON.parse(localStorage.getItem(`health`) as any) - (hlthPts - 1));
          setTotalDamage(totalDamage + (prevHealth - parseFloat(health.width)));
          calcScore(true);
          setTimeout(() => {
            let hit: any = document.querySelector(`.hits`);
            if (parseFloat(hit?.innerHTML) != 0) {
              localStorage.setItem(`health`, JSON.stringify(hlthPts));
              setPrevHealth(hlthPts);
            };
            setHurt(false);
            setHits(0);
          }, 500);
        } else {
          // localStorage.setItem(`deaths`, JSON.stringify(parseInt(ded?.innerHTML) + 1));
          setDeaths(parseInt(ded?.innerHTML) + 1);
          calcScore(true);
          restartGame();
        }
      }
  }

  useEffect(() => {
    setPage(`Game`);
    if (loadedRef.current) return;
    loadedRef.current = true;
    
    startGame();
    setUpdates(updates+1);
    setHealth({...health, width: `${startHP}%`});

    runGame = setInterval(() => {
      updateGame();
    }, 10);

  }, [users, user, score, highScore, scoring, authState]);

  return <div className={`inner pageInner`}>
    <section id={`gameBanner`} className={`topContent`}>
      <div className="inner">
        <h1 style={{fontSize: `2.1em`}}>Get that Treasure Game</h1>
        <div className={`column rightColumn gameStats`}>
            {/* <h2 className={`flex row`}><span className="label">Total:</span><span className="score">{score.toLocaleString(`en-US`)}</span><i className="fas fa-coins"></i></h2> */}
            {/* <h2 className={`flex row`}><span className="label">Deaths:</span><span className="deaths">{deaths}</span><i className="fas fa-skull-crossbones"></i></h2> */}
            <button title={gameOver && !user ? `Click to Clear High Score` : `Click to View High Scores`} onClick={() => !gameOver ? setShowLeaders(!showLeaders) : !user ? clearHighScore() : setShowLeaders(!showLeaders)} style={{background: `var(--blackGlass)`, borderRadius: 4, justifyContent: `center`, alignItems: `center`, maxWidth: `fit-content`, padding: `5px 15px`}} className={`flex row`}><h2 className={`flex row`}><i style={{color: `var(--gameBlue)`}} className="fas fa-signal"></i><span className="buttonInnerLabel">{Math.floor(highScore).toLocaleString(`en-US`)}</span><span className="label">High Score</span></h2></button>
        </div>
      </div>
    </section>
    {gameLoaded &&  <Section id={`gameSection`}>
      <div className="game" style={{background: gameBackground, height: gameHeight}}>
        <div className="gameAnimation" id="gameAnimation">
          {/* {leftWind ? <lottie-player class="windAnim" src={`https://assets1.lottiefiles.com/packages/lf20_qdgvz2hn.json`} background="transparent" speed="0.75" style={{ width: 1000, height: 888, top: 0, left: 0 }} loop autoplay></lottie-player> : <lottie-player class="windAnim" src={`https://assets1.lottiefiles.com/packages/lf20_qdgvz2hn.json`} background="transparent" speed="0.75" style={{ width: 1000, height: 888, top: 100, left: 100 }} loop autoplay></lottie-player>} */}
          <lottie-player id="cloudsAnimation" src={cloudsAnimation} background="transparent" speed="1" style={{ width: 1000, height: 888 }} loop autoplay></lottie-player>
          <lottie-player id="oceanWaves" src="https://assets3.lottiefiles.com/datafiles/N8DaINa2dmLOJja/data.json" background="transparent" speed="2" style={{ width: 1000, height: 888 }} loop autoplay></lottie-player>
        </div>
        <div className="gameControls flex row" style={{display: devEnv ? `flex` : `none`}}>
          <div style={{display: `none`}} className="flex row">Jump Speed <input id={`jumpSpeed`} defaultValue={jumpSpeed} type="range" min="250" max="900" step="50" /> <div className="flex row">x{1000 - jumpSpeed}</div></div>
          <div className="flex row" style={{display: `none`}}><span className={`flex row`}><i style={{width: 15}} className="fas fa-heartbeat"></i><span style={{minWidth: 47, marginLeft: 5}}>Start HP</span></span><input id={`initialHealth`} defaultValue={initialHealth} type="range" min="69" max="100" onInput={changeHP} onKeyDown={(e) => e.preventDefault()} /><span className="startHP">{initialHealth}%</span></div>
          <div style={{display: `none`}} className="flex row">Enemy Speed <input id={`speed`} defaultValue={speed} type="range" min="1000" max="5500" step="500" /> <div className="flex row">{speed / 1000} S</div></div>
          <div className="flex row"><span className={`flex row`}><i style={{width: 15}} className="fas fa-tachometer-alt"></i><span style={{minWidth: 47, marginLeft: 5}}>Damage</span></span><input id={`damage`} defaultValue={damage} type="range" min="0.50" max="2.25" step="0.25" onKeyDown={(e) => e.preventDefault()} /> <div className="dmgText flex row">{`${((damage * 8) * (speed /8000)).toString().substr(0,4)}% - ${(Math.floor((damage * 10) * (speed /3333))).toString().substr(0,4)}%`}</div></div>
          <div className="flex row"><span className={`flex row`}><i style={{width: 15}} className="fas fa-tachometer-alt"></i><span style={{minWidth: 47, marginLeft: 5}}>Speed</span></span><input id={`moveSpeed`} defaultValue={moveSpeed} type="range" min="1" max="5" step="0.5" onKeyDown={(e) => e.preventDefault()} /> <div className="flex row">{moveSpeed}x</div></div>
          <div style={{display: `none`}} className="flex row"><span className={`flex row`}><i style={{width: 15}} className="fas fa-tachometer-alt"></i><span style={{minWidth: 47, marginLeft: 5}}>Countdown</span></span><input id={`deathTimer`} defaultValue={deathTimer} type="range" min="15" max="128" onKeyDown={(e) => e.preventDefault()} /> <div className="deathTime flex row">{deathTimer}s</div></div>
        </div>
        <div className={`health`} style={health}><span className="healthText"><i className="fas fa-heartbeat" style={{marginRight: 10}}></i><span style={{position: `relative`, top: `-4px`}}>Health</span></span><span className="healthPoints">{health.width}</span>{parseFloat(health.width) >= 30 && <div className="damageIndicator flex row" style={{minWidth: 200}}>
          {!hurt && (Math.abs(prevHealth - parseFloat(health.width)) < (((damage * 10) * (speed /3333)))) && <div id="dmg" className="dmg"><span className="damage">-{Math.abs(prevHealth - parseFloat(health.width))}%</span></div>}
          <div className="hit" style={{opacity: hits > 0.01 ? 1 : 0, color: dangerColor}}>-<span className="hits">{parseInt(hits as any)}%</span></div>
        </div>}</div>
        <div className="controls flex" style={controls}>
          <button id={`jumpButton`} className={`moveButton`} onClick={jump} style={{width: `50%`, margin: `0 auto`}}>^</button>
          <div className="flex row">
            <button id={`moveLeftButton`} className={`moveButton`} onClick={moveLeft}>{`<`}</button>
            <button id={`moveRightButton`} className={`moveButton`} onClick={moveRight}>{`>`}</button>
          </div>
          <button style={{pointerEvents: `none`, fontSize: `0.85em`, fontWeight: 500, height: 30, display: `none`}}><div className="timer"><i className="fas fa-stopwatch"></i> Time <span className="time">{time.toString().substr(0,8)}s</span></div></button>
          <button style={{pointerEvents: `none`, fontSize: `0.85em`, fontWeight: 500, height: 30}}><div className="timer flex row">Time<i style={{ maxWidth: `fit-content` }} className="fas fa-stopwatch"></i><span style={{ maxWidth: `fit-content` }} className="time">{genSeconds((Math.floor(initialDeathTimer) - Math.floor(time) > 0 ? Math.floor(Math.floor(initialDeathTimer) - Math.floor(time)) : 0))}</span></div></button>
          {/* <button className={`flex row`} style={{pointerEvents: `none`, fontSize: `0.85em`, fontWeight: 500, height: 30}}><i className="fas fa-coins"></i> Coins: <span className="points">{points}</span></button>
          <button className={`flex row`} style={{pointerEvents: `none`, fontSize: `0.85em`, fontWeight: 500, height: 30}}><i className="fas fa-skull-crossbones"></i> Deaths: <span className="deaths">{deaths}</span></button> */}
          <button className={`flex row`}style={{fontSize: `0.85em`, fontWeight: 500, height: 30, gridGap: 0, display: `none`}} onClick={resetGame}><i className="fas fa-undo"></i> Restart</button>
          <button className={`flex row`} style={{pointerEvents: `none`, fontSize: `0.85em`, fontWeight: 500, height: 30}}><i className="fas fa-signal"></i> Score <span className="score" id={`score`}>{Math.floor(score).toLocaleString(`en-US`)}</span></button>
          <button className={`flex row`} style={{fontSize: `0.85em`, fontWeight: 500}} onClick={() => window.location.reload()}><i style={{width: `15%`}} className="fas fa-undo"></i> Reset</button>
        </div>
        {!game && (gameOver ? <div className="gameStateAction gameOver flex">
          <LeaderBoard id={`leaderBoard`} className={`leaderBoard`} />
          <button id="startGame" onClick={saveAndRestartGame}><span className={`emphasis`} style={{color: `var(--mainGlass)`}}>GAME OVER,</span> Click Here or <span className={`emphasis`}>Type Enter</span> to Try Again</button>
        </div> : (win ? <div className="win">
          <button id="winGame" onClick={(Event: any) => startGame(Event)}>You Won</button>
        </div> : <div className="gameStateAction start flex">{showLeaders && <LeaderBoard id={`leaderBoard`} className={`leaderBoard`} />}<button id="startGame" onClick={(Event: any) => startGame(Event)}>Click Here or <span className={`emphasis`}>Type Enter</span> to Play <span className="emphasis">//</span> You can also <span className="emphasis">Press Escape</span> to Reset the Game!</button></div>))} 
        <div className="gameStateAction gameMessages flex">
          {game && time < 2 && <div className="intro">Try to get to the Treasure!</div>}
          {game && time > 2 && time < 7 && <div className="gameMessage" style={{color: `white`}}>Jump over Cannon Balls and move by tapping arrow keys!</div>}
          {game && time > 7 && time < 15 && <div className="gameMessage" style={{color: `white`}}>Getting treasure gives you LOTS of points, but sends you back!</div>}
          {game && time > 15 && <div className="gameMessage flex row stretch">
            {/* <span style={{minWidth: `max-content`}}>Your Current Score:</span> */}
            <span className="emphasis flex row" style={{color: `var(--js)`}}><i style={{color: `var(--js)`, maxWidth: `fit-content`}} className="fas fa-signal"></i> <span style={{maxWidth: `fit-content`}}>{Math.floor(score).toLocaleString(`en-US`)}</span></span></div>}
        </div>
        <div className={`player playerObj ${direction}`} style={player}><div className="playerSprite">
          {/* {movement != `standing` ?  : <img src="/stand.svg" />}   */}
          <lottie-player class="windAnim" src={`https://assets1.lottiefiles.com/packages/lf20_qdgvz2hn.json`} background="transparent" speed="0.75" style={{ width: 1000, height: 888, top: 25, left: -160 }} loop autoplay></lottie-player>
          <lottie-player src={shipAnim}  background="transparent" speed={playerSpeed} style={{width: initialPlayer.width * 5, height: initialPlayer.height * 5}} loop autoplay></lottie-player>
        </div></div>
        <div className={`enemy ${game ? `moving` : `stopped`}`} style={enemy}></div>
        {/* <div className={`enemy ${game ? `moving` : `stopped`}`} style={{...enemy, left: 55 + Math.floor(Math.random() * 400), bottom: enemy.bottom + 15, animationDelay: `3s`}}>2</div> */}
        <div className="ground" style={ground}>
          <div className="groundText">Click Arrow Buttons or Use Left and Right Arrow Keys to Move and Up or Space to jump. Thank you for Playing!</div>
          <div className="playerText playerObj" style={{position: `absolute`, left: player.left - 64, bottom: player.bottom - 64}}>
            <div className="topRow flex row" style={{top: -90 - (initialPlayer.height)}}>
               {/* <button className={`flex row`} style={{pointerEvents: `none`, fontSize: `0.85em`, fontWeight: 500, height: 30}}><i className="fas fa-coins
              "></i> Coins: <span className="points">{points}</span></button> */}
              <button className={`flex row`} style={{ pointerEvents: `none`, fontSize: `0.85em`, fontWeight: 500, height: 30, maxWidth: `fit-content` }}><i style={{ maxWidth: `fit-content` }} className="fas fa-signal"></i> Score <span style={{ maxWidth: `fit-content` }} className="score">{Math.floor(score).toLocaleString(`en-US`)}</span></button>
            </div>
            <div className="bottomRow flex row">
              <button className={`flex row`} style={{pointerEvents: `none`, fontSize: `0.85em`, fontWeight: 500, height: 30}}><i className="fas fa-heartbeat"></i>{user ? user?.name?.split(` `)[0] : `Player`}<span className="hlth">{health.width}</span></button>
              <button id={`playerTimer`} style={{ pointerEvents: `none`, fontSize: `0.85em`, fontWeight: 500, height: 30, maxWidth: `fit-content` }}><div className="timer flex row">Time<i style={{ maxWidth: `fit-content` }} className="fas fa-stopwatch"></i><span style={{ maxWidth: `fit-content` }} className="time">{genSeconds((Math.floor(initialDeathTimer) - Math.floor(time) > 0 ? Math.floor(Math.floor(initialDeathTimer) - Math.floor(time)) : 0))}</span></div></button>
            </div>
          </div>
        </div>
        <button className="treasure finish flex row" style={{ ...finish, fontWeight: 500, ...((gameOver && !user) ? false : { pointerEvents: `none` }) }} onClick={saveScore}><i className={`fas ${gameOver && !user ? `fa-save` : `fa-coins`}`} style={{ width: `10%` }}></i> {gameOver && !user ? `Save` : `Treasure`}<div style={{ display: scoring && game ? `flex` : `none` }} className="coinsAnimation">
        <div style={{position: `relative`, right: coinsPlacement }}><lottie-player src="https://assets10.lottiefiles.com/packages/lf20_smGEjL.json" background="transparent" speed="2" style={{ width: 300, height: 300 }} loop autoplay></lottie-player></div>
          <div style={{position: `relative`, right: coinsPlacement + coinsDistance }}><lottie-player src="https://assets10.lottiefiles.com/packages/lf20_smGEjL.json" background="transparent" speed={(coinsDistance + (coinsDistance * 2)).toString()} style={{ width: 300, height: 300 }} loop autoplay></lottie-player></div>
          <div style={{position: `relative`, right: coinsPlacement + coinsDistance * 2 }}><lottie-player src="https://assets10.lottiefiles.com/packages/lf20_smGEjL.json" background="transparent" speed={`2`} style={{ width: 300, height: 300 }} loop autoplay></lottie-player></div>
        </div></button>
      </div>
    </Section>}
    <Section id={`gameAuth`}>
      <h2>{focus ? `Please Sign In or Sign Up to Save Your Score!` : <i>User is {user ? user?.name : `Signed Out`}</i>}</h2>
      <AuthForm />
    </Section>
    {/* {!focus && <Section id={`gameContent`}>
      <p>A game where the player races against time to jump over the enemy and secure treasure! When the player secures treasure, they will however be almost immediately sent back to the start. This game was made by me for fun so its probably super glitchy haha. Feel free to HARD RESET the game anytime by clicking Reset. Have fun and thanks for playing!</p>
    </Section>} */}
  </div>
}