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
  let { updates, setUpdates, user, setPage } = useContext(StateContext);
  let [ground, setGround] = useState({background: `#17a117`, height: 9});
  let [health, setHealth] = useState({background: `#00b900`, height: 20, width: `${100}%`});
  let [enemy, setEnemy] = useState({background: `red`, height: 15, width: 15, bottom: 9, left: 25});
  let [player, setPlayer] = useState({background: `black`, height: 15, width: 15, bottom: 9, left: 0});

  const startGame = () => {
    setUpdates(updates+1);
    setGame(true);

    playerInput = window.addEventListener(`keydown`, KeyboardEvent => {
      KeyboardEvent.preventDefault();
      let moveLeftButton: any = document.querySelector(`#moveLeftButton`);
      let moveRightButton: any = document.querySelector(`#moveRightButton`);
      if (KeyboardEvent.key == `ArrowLeft`) {
        if (moveLeftButton) moveLeftButton.click();
      } else  if (KeyboardEvent.key == `ArrowRight`) {
        if (moveRightButton) moveRightButton.click();
      }
    });
  }

  const moveLeft = () => {
    setUpdates(updates+1);
    setPlayer({...player, left: player.left - 1});
    checkPlayer();
  }

  const moveRight = () => {
    setUpdates(updates+1);
    setPlayer({...player, left: player.left + 1});
    checkPlayer();
  }

  const checkPlayer = () => {
    if (!game) return;
    let plyr: any = document.querySelector(`.player`)?.getBoundingClientRect();
    let enmy: any = document.querySelector(`.enemy`)?.getBoundingClientRect();

    if (plyr.right > enmy.left && 
      plyr.left < enmy.right && 
      plyr.bottom > enmy.top &&
      plyr.top < enmy.bottom) {
        if (parseFloat(health.width) > 0) {
          setHealth({...health, width: `${parseFloat(health.width) - 20}%`});
        } else {
          endGame();
        }
    } else {
        console.log(`No Lose HP`);
    }
  }

  const endGame = () => {
    setHealth({...health, width: `100%`});
    window.removeEventListener(`keydown`, playerInput);
    setPlayer({background: `black`, height: 15, width: 15, bottom: 9, left: 0});
    setGame(false);
  }

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    setUpdates(updates+1);
    setPage(`Game`);
  }, [])

  return <div className={`inner pageInner`}>
    <Banner id={`gameBanner`} />
    <Section id={`gameSection`}>
      Attempt 1 at making a Game with JavaScript
      <div className="game" style={{background: `#74d7ff`}}>
        {!game ? <div className="start">
          <button id="startGame" onClick={startGame}>Start Game</button>
        </div> : <div className="level" id="levelOne">
          <div className="health" style={health}>{health.width}</div>
          <div className="controls flex row">
            <button id={`moveLeftButton`} onClick={moveLeft}>{`<`}</button>
            <button id={`moveRightButton`} onClick={moveRight}>{`>`}</button>
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