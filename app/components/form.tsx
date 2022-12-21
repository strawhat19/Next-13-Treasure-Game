'use client';
import { db } from '../../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { formatDate } from '../projects/projects';
import { capitalizeAllWords, StateContext } from '../home';

import { useContext, useEffect, useRef, useState } from 'react';

export default function AuthForm() {
  const loadedRef = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const { user, setUser, updates, setUpdates, users } = useContext(StateContext);

  const addOrUpdateUser = async (user: any, id: any) => {
    setDoc(doc(db, `users`, id), {
      ...user,
      id,
    }).then(newSub => {
      return newSub;
    }).catch(error => console.log(error));
  }

  const authForm = (e?: any) => {
      e.preventDefault();
      let formFields = e.target.children;
      let submit = formFields.authFormSubmit.value ?? `submit`;
      
      if (submit == `Sign In`) {
        let email = formFields.email.value ?? `email`;
        let name = capitalizeAllWords(email.split(`@`)[0]);
        let password = formFields.password.value ?? `password`;
        let updated = formatDate(new Date());
        let lastSignin = formatDate(new Date());
        let registered = formatDate(new Date());

        let potentialUser = { 
          id: users.length + 1, 
          bio: ``,
          color: ``, 
          number: 0,
          status: ``,
          name: name, 
          email: email,
          roles: [`user`],
          updated: updated, 
          password: password, 
          lastSignin: lastSignin, 
          registered: registered, 
        };

        setUser(potentialUser);
        localStorage.setItem(`user`, JSON.stringify(potentialUser));
        setUpdates(updates + 1);

        // Add User

      } else {
        setUser(null);
        setUpdates(updates+1);
        localStorage.removeItem(`user`);
      }
  }

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    setLoaded(true);
  }, []);

  return <>
    {loaded ? <form id="authForm" className={`flex`} onSubmit={authForm}>
      {!user && <input placeholder="Email" type="email" name="email" autoComplete={`email`} required />}
      {!user && <input placeholder="Password" type="password" name="password" autoComplete={`current-password`} required />}
      <input type="submit" name="authFormSubmit" value={user ? `Sign Out` : `Sign In`} />
    </form> : <div className={`skeleton`}>
        <form id="authForm" className={`flex`} onSubmit={authForm}>
          <input placeholder="Email" type="email" name="email" autoComplete={`email`} required />
          <input placeholder="Password" type="password" name="password" autoComplete={`current-password`} required />
          <input type="submit" name="authFormSubmit" value={user ? `Sign Out` : `Sign In`} />
        </form>
    </div>}
  </>
}