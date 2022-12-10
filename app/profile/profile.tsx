'use client';
import { StateContext } from '../home';
import Banner from '../components/banner';
import AuthForm from '../components/form';
import { useContext, useEffect } from 'react';

export default function Profile() {
  const { updates, setUpdates, width, user, setPage } = useContext(StateContext);

    useEffect(() => {
      setPage(`Profile`);
      setUpdates(updates+1);
    }, [])

    return <div className={`inner pageInner`}>
      <Banner id={`profileBanner`} />
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