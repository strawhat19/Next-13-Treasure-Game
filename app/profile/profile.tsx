'use client';
import AuthForm from '../form';
import { useContext, useEffect } from 'react';
import { capitalizeAllWords, StateContext } from '../home';

export default function Profile() {
  const { updates, setUpdates, width, user, setPage } = useContext(StateContext);

    useEffect(() => {
      setPage(`Profile`);
      setUpdates(updates+1);
    }, [])

    return <div className={`inner pageInner`}>
        <section className={`topContent`}>
          <div className="inner">
            <h1>Profile</h1>
            <div className={`column rightColumn`}>
              <h2>Updates: {updates}</h2>
              <h2>Width: {width}</h2>
            </div>
          </div>
        </section>
        <section>
          <div className="inner">
            <article>
              <h2><i>User is {user ? user?.email : `Signed Out`}</i></h2>
              {user && <div className="profile flex">
                <span>Name: {capitalizeAllWords(user.email.split(`@`)[0])}</span>
                <span>Email: {user.email}</span>
                <span>Password: {user.password}</span>
              </div>}
              <div className="flex auth">
                <AuthForm />
              </div>
            </article>
          </div>
        </section>
    </div>
}