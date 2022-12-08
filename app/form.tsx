'use client';
import { useContext } from 'react';
import { capitalizeAllWords, StateContext } from './home';

export default function AuthForm() {
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
            id: 0,
            name,
            email,
            password
          };

          setUser(userObj);
          localStorage.setItem(`user`, JSON.stringify(userObj));
          setUpdates(updates+1);
        } else {
          setUser(null);
          setUpdates(updates+1);
        }
    }

    return <form id="authForm" className={`grid formGrid`} onSubmit={authForm}>
        {!user && <input placeholder="Email" type="email" name="email" autoComplete={`email`} required />}
        {!user && <input placeholder="Password" type="password" name="password" required />}
        <input type="submit" name="authFormSubmit" value={user ? `Sign Out` : `Sign In`} />
    </form>
}