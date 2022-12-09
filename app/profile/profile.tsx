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
            <h2><i>User is {user ? user?.name : `Signed Out`}</i></h2>
            {user ? <div className="profile flex">
              <span>Name: {user.name}</span>
              {user.email && <span>Email: {user.email}</span>}
              {user.password && <span className={`flex row start`}>Password: <span className={`flex row contain`}>{user?.password?.split(``).map((char: any, i: any) => {
                return <span key={i} className={`blur`}>X</span>
              })}</span></span>}
            </div> : `Please Sign In to View Content on this Page`}
            <div className="flex auth">
              <AuthForm />
            </div>
          </article>
        </div>
      </section>
    </div>
}