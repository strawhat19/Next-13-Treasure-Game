'use client';
import { useContext, useEffect } from 'react';
import { createContext } from "react";

export const StateContext = createContext<any>({});

export const capitalizeAllWords = (string: any) => {
  if (string != null || string != undefined) {
    return string.replace(`  `,` `).split(` `).map((word: any) => word?.charAt(0)?.toUpperCase() + word?.slice(1).toLowerCase()).join();
  }
};

export default function Home() {
  const custom = (e: any) => console.log(e);
  const { state, setState } = useContext(StateContext);

  const shuffle = (array: any) => {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  const randomize = (e?: any) => {
    setState({ ...state, content: shuffle(state.content.split(` `)).join(` `) });
  }

  const shufflePara = (para: any) => {
    return para;
  }

  useEffect(() => {
    setState({ 
      content: state.content,
      updates: state.updates++, 
      page: window.location.pathname.replace(`/`,``), 
      devEnv: window.location.host.includes(`localhost`)
    });
    console.log(`Home`, state);
  }, [])

  return <div className={`inner pageInner`}>
    <section className={`topContent`}>
        <h1>Home</h1>
      <div className={`column rightColumn`}>
          {state.devEnv && <h2>Clicks: {state.updates}</h2>}
          <h2>Env: {state.devEnv ? `Dev` : `Prod`}</h2>
          {state.devEnv && <h2>State: {state.page == `` ? `Home` : capitalizeAllWords(state.page)}</h2>}
        </div>
      </section>
      <section>
        <article>
          <h2><i>Content</i></h2>
          <div className="grid">
            <div className="gridItem">{state?.content ?? `Loading...`}</div>
            <div className="gridItem">{state?.content ?? `Loading...`}</div>
            <div className="gridItem">{state?.content ?? `Loading...`}</div>
            <div className="gridItem">{state?.content ?? `Loading...`}</div>
            <div className="gridItem">{state?.content ?? `Loading...`}</div>
            <div className="grid">
              <div className="gridItem"><button onClick={randomize}>Randomize Paragraph</button></div>
              <div className="gridItem"><button onClick={randomize}>Randomize Paragraph</button></div>
              <div className="gridItem"><button onClick={randomize}>Randomize Paragraph</button></div>
              <div className="gridItem"><button onClick={randomize}>Randomize Paragraph</button></div>
              <div className="gridItem"><button onClick={randomize}>Randomize Paragraph</button></div>
              <div className="gridItem"><button onClick={randomize}>Randomize Paragraph</button></div>
            </div>
          </div>
        </article>
      </section>
  </div>
}