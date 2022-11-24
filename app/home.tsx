'use client';
import { createContext } from "react";
import { useContext, useEffect } from 'react';

export const StateContext = createContext<any>({});

export const capitalizeAllWords = (string: any) => {
  if (string != null || string != undefined) {
    return string.replace(`  `,` `).split(` `).map((word: any) => word?.charAt(0)?.toUpperCase() + word?.slice(1).toLowerCase()).join();
  }
};

export default function Home() {
    const { state, setState } = useContext(StateContext);

    useEffect(() => {
      setState({ page: window.location.pathname.replace(`/`,``) });
    }, [])

    return <div className={`inner`}>
        <h1>Home</h1>
        <h2>{state.page == `` ? `Home` : capitalizeAllWords(state.page)}</h2>
    </div>
}