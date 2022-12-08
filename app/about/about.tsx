'use client';
import { useContext, useEffect } from 'react';
import { capitalizeAllWords, StateContext } from '../home';

export default function About() {
    const { state, setState, user, setUser,  page, setPage } = useContext(StateContext);

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
      console.log(`About`, state);
    }, [])

    return <div className={`inner pageInner`}>
        <section className={`topContent`}>
          <div className="inner">
            <h1>About</h1>
            <div className="column rightColumn">
                <h2>Clicks: {state.updates}</h2>
                <h2>State: {capitalizeAllWords(page)}</h2>
                <h2>State: {state.page == `` ? `Home` : capitalizeAllWords(state.page)}</h2>
            </div>
          </div>
        </section>
        <section>
          <div className="inner">
            <article>
              <h2><i>About Auth State</i></h2>
              <div className="flex auth">
                <h3>User is {user ? user?.email : `Signed Out`}</h3>
                <form id="authForm" className={`grid formGrid`} onSubmit={authForm}>
                  {!user && <input placeholder="Email" type="email" name="email" autoComplete={`email`} required />}
                  {!user && <input placeholder="Password" type="password" name="password" required />}
                  <input type="submit" name="authFormSubmit" value={user ? `Sign Out` : `Sign In`} />
                </form>
              </div>
            </article>
          </div>
        </section>
    </div>
}