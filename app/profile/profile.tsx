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
            <div className="flex row subBanner">
              <h2><i>User is {user ? user?.name : `Signed Out`}</i></h2>
              {user?.updated && <h4><i>Updated {user?.updated}</i></h4>}
            </div>
            {user ? <div className="profile flex">
              <span>Name: {user.name}</span>
              <span>Status: {user?.status == `` ? `--` : user?.status}</span>
              <span>Number: {user?.number == `` ? `--` : user?.number}</span>
              {user?.email && <span>Email: {user?.email}</span>}
              {user?.color && <span>Color: {user?.color}</span>}
              {user?.password && <span className={`flex row start`}>Password: <span className={`flex row contain`}>{user?.password?.split(``).map((char: any, i: any) => {
                return <span key={i} className={`blur`}>X</span>
              })}</span></span>}
              <span>About: {user?.bio == `` ? `--` : user?.bio}</span>
            </div> : `Please Sign In to View Content on this Page`}
          </article>
        </div>
      </section>
      <section>
        <div className="inner">
          <article>
            <div className="flex auth">
              <AuthForm />
            </div>
          </article>
        </div>
      </section>
    </div>
}