'use client';
const sheetdb = require('sheetdb-node');
import { useContext, useEffect, useState } from 'react';
import { capitalizeAllWords, StateContext } from '../home';
export const client = sheetdb({ address: 'zq3w3fff2pbsd' });

export default function AuthForm() {
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

        let userObj = {
          id: 1,
          name,
          email,
          password
        };

        setUser(userObj);
        // addUser(name, email, password);
        updateUser(`id`, 1, { updated: formatDate(new Date()) });

        localStorage.setItem(`user`, JSON.stringify(userObj));
        setUpdates(updates+1);
      } else {
        setUser(null);
        setUpdates(updates+1);
        localStorage.removeItem(`user`);
      }
  }

  const formatDate = (date: any) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + " " + strTime;
  }

  const addUser = (name: any, email: any, password: any) => {
    client.read({ limit: 99999 }).then(function (data: any) {
      let users = JSON.parse(data);
      let dataToAdd = { id: users.length + 1, name: name, email: email, password: password };
      client.create(dataToAdd).then(function (data: any) {
        client.read({ limit: 99999 }).then(function (data: any) {
          let databaseData = JSON.parse(data);
          console.log(`Updated Users`, databaseData, `with Data`, dataToAdd);
        });
      }, function (err: any) {
        console.log(err);
      });
    });
  }

  const updateUser = (fieldName: any, fieldValue: any, valueToUpdateObj: any) => {
    client.update(fieldName, fieldValue, valueToUpdateObj).then(function (data: any) {
      console.log(data);
    });
  }

  let isLoaded = false;
  useEffect(() => {
    setLoaded(true);
    isLoaded = !isLoaded;
    if (isLoaded) {
      return;
    } else {
      client.read({ limit: 99999 }).then(function (data: any) {
        let databaseData = JSON.parse(data);
        console.log(`Initial Users`, databaseData);
      });
    };
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