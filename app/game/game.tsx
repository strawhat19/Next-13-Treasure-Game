'use client';
import { StateContext } from '../home';
import AuthForm from '../components/form';
import Banner from '../components/banner';
import Section from '../components/section';
import { useContext, useEffect, useRef, useState } from 'react';

export default function Game() {
  let playerInput: any;
  let loadedRef = useRef(false);
  let [game, setGame] = useState(false);
  let [damage, setDamage] = useState(0.25);
  let [jumpSpeed, setJumpSpeed] = useState(500);
  let { updates, setUpdates, user, setPage } = useContext(StateContext);
  let initialBounds = {background: `#00b900`, height: 20, width: `${100}%`};
  let initialPlayer = {background: `black`, height: 15, width: 15, bottom: 19, left: 15};
  let [enemy, setEnemy] = useState({background: `red`, height: 15, width: 15, bottom: 19, left: 25});
  let [ground, setGround] = useState(initialBounds);
  let [health, setHealth] = useState(initialBounds);
  let [player, setPlayer] = useState(initialPlayer);

  const startGame = () => {
    setUpdates(updates+1);
    setGame(true);

    playerInput = window.addEventListener(`keydown`, KeyboardEvent => {
      KeyboardEvent.preventDefault();
      let jumpButton: any = document.querySelector(`#jumpButton`);
      let moveLeftButton: any = document.querySelector(`#moveLeftButton`);
      let moveRightButton: any = document.querySelector(`#moveRightButton`);
      if (KeyboardEvent.key == `ArrowLeft`) {
        if (moveLeftButton) moveLeftButton.click();
      } else  if (KeyboardEvent.key == `ArrowRight`) {
        if (moveRightButton) moveRightButton.click();
      } else {
        if (jumpButton) jumpButton.click();
      }
    });
  }

  const moveLeft = () => {
    setUpdates(updates+1);
    setPlayer({...player, left: player.left - 15});
  }

  const moveRight = () => {
    setUpdates(updates+1);
    setPlayer({...player, left: player.left + 15});
  }

  const jump = () => {
    setUpdates(updates+1);
    setPlayer({...player, bottom: player.bottom + 35});
    setTimeout(() => setPlayer({...player, bottom: initialPlayer.bottom}), jumpSpeed);
  }

  const checkPlayer = () => {
    let dmg: any = document.querySelector(`#damage`);
    let jmpSpd: any = document.querySelector(`#jumpSpeed`);
    let hlth: any = document.querySelector(`.healthPoints`);
    let hlthPts: any = parseFloat(hlth?.innerHTML);
    let plyr: any = document.querySelector(`.player`)?.getBoundingClientRect();
    let enmy: any = document.querySelector(`.enemy`)?.getBoundingClientRect();
    setJumpSpeed(jmpSpd?.value);
    setDamage(dmg?.value);

    if (plyr && enmy) {
      if (plyr.right >= enmy.left && 
        plyr.left <= enmy.right && 
        plyr.bottom >= enmy.top &&
        plyr.top <= enmy.bottom) {
          if (hlthPts >= 7.4) {
            setHealth({...health, width: `${hlthPts - dmg.value}%`, background: hlthPts <= 15 ? `red` : (hlthPts <= 45 ? `#cbcb1c` : initialBounds.background)});
          } else {
            endGame();
            // startGame();
          }
      }
    } else {
      endGame();
      // startGame();
    }
  }

  const endGame = () => {
    window.removeEventListener(`keydown`, playerInput);
    setHealth(initialBounds);
    setPlayer(initialPlayer);
    setDamage(0.25);
    setJumpSpeed(500);
    setGame(false);
  }

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    setUpdates(updates+1);
    setPage(`Game`);
    startGame();

    setInterval(() => {
      checkPlayer();
    }, 1);
  }, [])

  return <div className={`inner pageInner`}>
    <Banner id={`gameBanner`} />
    <Section id={`gameSection`}>
      Attempt 2 at making a Game with JavaScript
      <div className="game" style={{background: `#74d7ff`}}>
        {!game ? <div className="start">
          <button id="startGame" onClick={startGame}>Start Game</button>
        </div> : <div className="level" id="levelOne">
          <div className="gameControls flex row">
            <div className="flex row">Jump: <input id={`jumpSpeed`} defaultValue={jumpSpeed} type="range" min="150" max="1000" step="50" /> <div className="flex row">{jumpSpeed}</div></div>
            <div className="flex row">Damage: <input id={`damage`} defaultValue={damage} type="range" min="0.25" max="2.25" step="0.25" /> <div className="flex row">{`${damage * 5} - ${damage * 25}`}</div></div>
          </div>
          <div className="health" style={health}>Health: <span className="healthPoints">{health.width}</span></div>
          <div className="controls flex">
            <button id={`jumpButton`} onClick={jump} style={{width: `50%`, margin: `0 auto`}}>^</button>
            <div className="flex row">
              <button id={`moveLeftButton`} onClick={moveLeft}>{`<`}</button>
              <button id={`moveRightButton`} onClick={moveRight}>{`>`}</button>
            </div>
          </div>
          <div className="player" style={player}></div>
          <div className="enemy" style={enemy}></div>
          <div className="ground" style={ground}></div>
        </div>}
      </div>
    </Section>
    <Section id={`gameAuth`}>
      <h2><i>User is {user ? user?.name : `Signed Out`}</i></h2>
      <AuthForm />
    </Section>
  </div>
}