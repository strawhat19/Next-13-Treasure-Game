'use client';
import { useContext } from 'react';
import { StateContext } from './home';

export default function AuthForm() {
    const { user, setUser } = useContext(StateContext);

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
        //   setState({ ...state, updates: state.updates+1, user: user });
        } else {
          setUser(null);
        //   setState({ ...state, updates: state.updates+1, user: user });
        }
    }

    return <form id="authForm" className={`grid formGrid`} onSubmit={authForm}>
        {!user && <input placeholder="Email" type="email" name="email" autoComplete={`email`} required />}
        {!user && <input placeholder="Password" type="password" name="password" required />}
        <input type="submit" name="authFormSubmit" value={user ? `Sign Out` : `Sign In`} />
    </form>
}