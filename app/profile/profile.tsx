'use client';
import { StateContext } from '../home';
import AuthForm from '../components/form';
import Section from '../components/section';
import { useContext, useEffect } from 'react';
import LeaderBoard from '../components/leaderboard';

export default function Profile() {
  const { updates, setUpdates, user, setPage, highScore, colorPref, setColorPref, showLeaders, setShowLeaders } = useContext(StateContext);

  useEffect(() => {
    setPage(`Profile`);
    setUpdates(updates+1);
  }, [])

  return <div className={`inner pageInner`}>
    <section id={`profileBanner`} className={`topContent`}>
      <div className="inner">
        {user ? <h1>{user?.name}</h1> : <h2><i>Signed Out</i></h2>}
          {/* <h1>Profile</h1>
          <h2><i>User is {user ? user?.name : `Signed Out`}</i></h2> */}
          <div className={`column rightColumn gameStats`}>
            <button title="Click to View High Scores" style={{background: `var(--blackGlass)`, borderRadius: 4, justifyContent: `center`, alignItems: `center`, maxWidth: `fit-content`, padding: `5px 15px`}} className={`flex row`}><h2 className={`flex row`} onClick={(e) => setShowLeaders(!showLeaders)}><i style={{color: `var(--gameBlue)`}} className="fas fa-signal"></i><span className="highScore">{Math.floor(highScore).toLocaleString(`en-US`)}</span><span className="label">High Score</span></h2></button>
            <button onClick={() => setColorPref(!colorPref)} title="Click to Set Color Preference" style={{background: `var(--blackGlass)`, borderRadius: 4, justifyContent: `center`, alignItems: `center`, maxWidth: `fit-content`, padding: `5px 15px`, marginTop: 10}} className={`flex row`}><h2 className={`flex row`}><span className="label">{colorPref ? `Default Color` : `Change Color`}</span><i style={{color: `var(--gameBlue)`}} className="fas fa-question"></i></h2></button>
          </div>
      </div>
    </section>
    <Section id={`profileSection`}>
      <div className="flex row subBanner">
        <h2><i>Signed in as {user ? user?.email : `Signed Out`}</i></h2>
        {user?.updated && <h4><i>Updated {user?.updated}</i></h4>}
      </div>
    </Section>
    <section id={`profileSection`} className={`topContent`}>
      <div className="inner">
        <div className={`column rightColumn`} style={{minWidth: `65%`}}>
          <AuthForm style={{width: `100%`}} />
        </div>
        {user ? <div className="profile flex profileText" style={{textAlign: `right`}}>
          <span>List(s): <span className="emphasis white">{user?.lists.length == 0 ? `--` : user?.lists.length}</span></span>
          <span>Number: <span className="emphasis white">{user?.number == `` ? `--` : user?.number}</span></span>
          <span>Name: <span className="emphasis white">{user.name}</span></span>
          <span>Favorite Color: <span className="emphasis white">{user?.color == `` ? `--` : user?.color}</span></span>
          {user?.email && <span>Email: <span className="emphasis white">{user?.email}</span></span>}
          {user?.password && <span className={`flex row end`}>Password: <span className={`flex row contain emphasis white`}>{user?.password?.split(``).map((char: any, i: any) => {
            return <span key={i} className={`blur`}>X</span>
          })}</span></span>}
          <span>Status: <span className="emphasis white">{user?.status == `` ? `--` : user?.status}</span></span>
          <span>About: <span className="emphasis white">{user?.bio == `` ? `--` : user?.bio}</span></span>
        </div> : `Please Sign In to View Content In This Section`}
      </div>
    </section>
    <Section id={`profileLeaderBoardSection`}>
      {showLeaders && <LeaderBoard id={`leaderBoard`} className={`leaderBoard`} style={{maxWidth: 420, fontSize: `0.85em`, padding: `1em`}} />}
    </Section>
  </div>
}