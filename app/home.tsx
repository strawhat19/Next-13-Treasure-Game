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
  const { state, setState, page, setPage } = useContext(StateContext);

  const shuffle = (array: any) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  const randomize = (e?: any) => {
    setState({ ...state, updates: state.updates+1, content: shuffle(state.content.split(` `)).join(` `) });
  }

  useEffect(() => {
    setState({ 
      ...state,
      updates: state.updates+1, 
      page: window.location.pathname.replace(`/`,``),
    });
    setPage(window.location.pathname.replace(`/`,``));
    console.log(`Home`, state);
  }, [])

  return <div className={`inner pageInner`}>
    <section className={`topContent`}>
      <div className="inner">
        <h1>Home</h1>
        <div className={`column rightColumn`}>
            <h2>Clicks: {state.updates}</h2>
            <h2>State: Home</h2>
            <h2>State: {state.page == `` ? `Home` : capitalizeAllWords(state.page)}</h2>
        </div>
      </div>
    </section>
    <section>
     <div className="inner">
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
              <div className="gridItem"><button onClick={randomize}>Randomize Paragraph</button></div>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
}