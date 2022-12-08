'use client';
import { useContext, useEffect, useState } from 'react';
import { createContext } from "react";

export const StateContext = createContext<any>({});

export const capitalizeAllWords = (string: any) => {
  if (string != null || string != undefined) {
    return string.replace(`  `,` `).split(` `).map((word: any) => word?.charAt(0)?.toUpperCase() + word?.slice(1).toLowerCase()).join();
  }
};

export const getFormValuesFromFields = (formFields: any) => {
  for (let i = 0; i < formFields.length; i++) {
    let field = formFields[i];
    if (field.type != `submit`) {
      console.log(field.type, field.value);
    };
  }
}

export default function Home() {
  const custom = (e: any) => console.log(e);
  const { state, setState, user, setUser, page, setPage } = useContext(StateContext);

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

  const authForm = (e?: any) => {
    e.preventDefault();
    let formFields = e.target.children;
    let submit = formFields.authFormSubmit.value ?? `submit`;
    
    if (submit == `Sign In`) {
      let email = formFields.email.value ?? `email`;
      let password = formFields.password.value ?? `password`;
      setUser({
        id: 0,
        email,
        password
      });
      setState({ ...state, updates: state.updates+1, user: user });
    } else {
      setUser(null);
      setState({ ...state, updates: state.updates+1, user: user });
    }
  }

  useEffect(() => {
    setState({ 
      ...state,
      user,
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
          <h2><i>Home Auth State</i></h2>
          <div className="grid">
            <div className="gridItem">
              <div className="auth">
                <h3>User is {user ? user?.email : `Signed Out`}</h3>
                <form id="authForm" className={`grid formGrid`} onSubmit={authForm}>
                  {!user && <input placeholder="Email" type="email" name="email" autoComplete={`email`} required />}
                  {!user && <input placeholder="Password" type="password" name="password" required />}
                  <input type="submit" name="authFormSubmit" value={user ? `Sign Out` : `Sign In`} />
                </form>
              </div>
            </div>
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
              <div className="gridItem"><button onClick={randomize}>Randomize Paragraph</button></div>
              <div className="gridItem"><button onClick={randomize}>Randomize Paragraph</button></div>
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
}