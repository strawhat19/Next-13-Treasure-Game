'use client';
const sheetdb = require('sheetdb-node');
import { formatDate } from '../projects/projects';
import { capitalizeAllWords, StateContext } from '../home';
export const client = sheetdb({ address: 'zq3w3fff2pbsd' });
import { useContext, useEffect, useRef, useState } from 'react';

export default function AuthForm() {
  const loadedRef = useRef(false);
  const [users, setUsers] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { user, setUser, updates, setUpdates } = useContext(StateContext);

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

        client.read({ limit: 99999 }).then(function (data: any) {
          let latestUsers = JSON.parse(data);
          let potentialUser = { id: latestUsers.length + 1, name: name, email: email, password: password, updated: updated, lastSignin: lastSignin, registered: registered, roles: [`user`] };

          client.create(potentialUser).then(function (data: any) {
            setUser(potentialUser);
            localStorage.setItem(`user`, JSON.stringify(potentialUser));
            setUpdates(updates + 1);
            client.read({ limit: 99999 }).then(function (data: any) {
              let databaseData = JSON.parse(data);
              console.log(`Updated Users`, databaseData, `with Data`, potentialUser);
            });
          }, function (err: any) {
            console.log(err);
          });
        }, function (err: any) {
          console.log(err);
        });
        // updateUser(`id`, 1, { updated: formatDate(new Date()) });
      } else {
        setUser(null);
        setUpdates(updates+1);
        localStorage.removeItem(`user`);
      }
  }

  const updateUser = (fieldName: any, fieldValue: any, valueToUpdateObj: any) => {
    client.update(fieldName, fieldValue, valueToUpdateObj).then(function (data: any) {
      console.log(data);
    });
  }

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    setLoaded(true);
    client.read({ limit: 99999 }).then(function (data: any) { setUsers(JSON.parse(data)) });
  }, [])

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