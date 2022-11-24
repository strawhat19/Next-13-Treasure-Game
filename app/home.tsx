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
  const { state, setState } = useContext(StateContext);

  useEffect(() => {
    setState({ 
      updates: state.updates++, 
      page: window.location.pathname.replace(`/`,``), 
      devEnv: window.location.host.includes(`localhost`)
    });
    console.log(`Home`, state);
  }, [])

  return <div className={`inner`}>
      <h1>Home</h1>
      <div className="column rightColumn">
        {state.devEnv && <h2>Clicks: {state.updates}</h2>}
        <h2>Env: {state.devEnv ? `Dev` : `Prod`}</h2>
        {state.devEnv && <h2>State: {state.page == `` ? `Home` : capitalizeAllWords(state.page)}</h2>}
      </div>
  </div>
}