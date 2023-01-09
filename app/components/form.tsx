'use client';
import { db } from '../../firebase';
import { defaultContent } from '../home';
import { formatDate } from '../projects/projects';
import { useContext, useEffect, useRef, useState } from 'react';
import { capitalizeAllWords, createXML, StateContext } from '../home';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

export default function AuthForm() {
  const loadedRef = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false); 
  const { user, setUser, updates, setUpdates, setUsers, setContent, authState, setAuthState, emailField, setEmailField, users, setFocus } = useContext(StateContext);

  const addOrUpdateUser = async (id: any, user: any) => {
    setDoc(doc(db, `users`, id), { ...user, id }).then(newSub => {
      localStorage.setItem(`user`, JSON.stringify({ ...user, id }));
      setUser({ ...user, id });
      setUpdates(updates + 1);
      return newSub;
    }).catch(error => console.log(error));
  }

  const showAlert = async (alertTitle: any, alertMessage?: any, additionalInfo?:any) => {
    if (alertOpen) return;
    setAlertOpen(true);
    setUpdates(updates+1);
    let alertDialog = document.createElement(`div`);
    alertDialog.className = `alert`;
    if ((!alertMessage && !additionalInfo) || additionalInfo.length == 0) alertDialog.classList.add(`slim`);
    alertDialog.innerHTML = `<h3>${alertTitle}</h3>
    ${alertMessage ? additionalInfo ? `` : alertMessage : ``}
    `;
    if (additionalInfo?.length > 0) {
      additionalInfo?.forEach((info: any, index: any) => {
        let element: any = createXML(`<p>${index+1}. ${alertMessage} ${info}</p>`);
        alertDialog.append(element);
      });
    }
    document.body.appendChild(alertDialog);
    let closeButton = document.createElement(`button`);
    closeButton.innerHTML = `X`;
    closeButton.onclick = () => {
      document.body.removeChild(alertDialog);
      setUpdates(updates+1);
      setAlertOpen(false);
    };
    alertDialog.appendChild(closeButton);
  }

  const authForm = (e?: any) => {
    e.preventDefault();
    let clicked = e?.nativeEvent?.submitter;
    let formFields = e.target.children;
    let email = formFields?.email?.value ?? `email`;

    switch(clicked?.value) {
      default:
        console.log(clicked?.value);
        break;
      case `Next`:
        getDocs(collection(db, `users`)).then((snapshot) => {
          let latestUsers = snapshot.docs.map((doc: any) => doc.data());
          let macthingEmails = latestUsers.filter((usr: any) => usr?.email == email);
          setUsers(latestUsers);
          setEmailField(true);
          if (macthingEmails.length > 0) {
            localStorage.setItem(`account`, JSON.stringify(macthingEmails[0]));
            setAuthState(`Sign In`);
          } else {
            setAuthState(`Sign Up`);
          }
        });
        break;
      case `Back`:
        setUpdates(updates+1);
        setAuthState(`Next`);
        setEmailField(false);
        break;
      case `Sign Out`:
        setUser(null);
        setUpdates(updates+1);
        localStorage.removeItem(`user`);
        setAuthState(`Next`);
        setEmailField(false);
        setContent(defaultContent);
        break;
      case `Save`:
        let emptyFields = [];
        let fieldsToUpdate = [];

        for (let i = 0; i < formFields.length; i++) {
          const input = formFields[i];
          if (input?.classList?.contains(`userData`)) {
            if (input.value === ``) {
              emptyFields.push(input?.placeholder);
            } else {
              fieldsToUpdate.push(input);
            }
          }
        }

        if (fieldsToUpdate.length == 0) {
          showAlert(`The Form was NOT Saved.`, `You Can Fill`, emptyFields);
        } else {
          let updatedUser = { ...user, updated: formatDate(new Date()) };
          Object.assign(updatedUser, ...([...fieldsToUpdate].map(input => {
            if (input?.classList?.contains(`userData`)) {
              if (input?.id == `bio`) setContent(formFields?.bio?.value);
              return {[input.id]: input.value}
            }
          })));
          addOrUpdateUser(user?.id, updatedUser);
        }
        break;
      case `Sign In`:
        let existingAccount = JSON.parse(localStorage.getItem(`account`) as any);
        let password = formFields?.password?.value;

        if (password == ``) {
          showAlert(`Password Required`);
        } else {
          if (password == existingAccount?.password) {
            setFocus(false);
            setAuthState(`Sign Out`);
            setUser(existingAccount);
            setContent(existingAccount?.bio);
            addOrUpdateUser(existingAccount?.id, {...existingAccount, lastSignin: formatDate(new Date())});
          } else {
            showAlert(`Invalid Password`);
          }
        }
        break;
      case `Sign Up`:
        let name = capitalizeAllWords(email.split(`@`)[0]);

        getDocs(collection(db, `users`)).then((snapshot) => {
          let latestUsers = snapshot.docs.map((doc: any) => doc.data());
          let macthingEmails = latestUsers.filter((usr: any) => usr?.email == email);
          setUsers(latestUsers);
          if (macthingEmails.length > 0) {
            localStorage.setItem(`account`, JSON.stringify(macthingEmails[0]));
            setAuthState(`Sign In`);
          } else {
            setAuthState(`Sign Up`);
          }

          let password = formFields?.password?.value;
          if (password == ``) {
            showAlert(`Password Required`);
          } else {
            let potentialUser = { 
              id: users.length + 1, 
              bio: ``,
              color: ``, 
              number: 0,
              status: ``,
              name: name, 
              email: email,
              roles: [`user`],
              password: password, 
              updated: formatDate(new Date()), 
              lastSignin: formatDate(new Date()), 
              registered: formatDate(new Date()), 
            };
  
            let uuid = `${latestUsers.length + 1} ${potentialUser?.name} ${potentialUser?.registered.split(` `)[0] + ` ` + potentialUser?.registered.split(` `)[1] + ` ` + potentialUser?.registered.split(` `)[2]}`;
            addOrUpdateUser(uuid, potentialUser);
            setAuthState(`Sign Out`);
          }
        });
        break;
    };
  }

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    setLoaded(true);
  }, [user]);

  return <>
  <form id="authForm" className={`flex`} onSubmit={authForm}>
      {!user && <input placeholder="Email" type="email" name="email" autoComplete={`email`} required />}
      {!user && emailField && <input placeholder="Password" type="password" name="password" autoComplete={`current-password`} />}
      {user && window?.location?.href?.includes(`profile`) && <input id="status" className={`status userData`} placeholder="Status" type="text" name="status" />}
      {user && window?.location?.href?.includes(`profile`) && <input id="bio" className={`bio userData`} placeholder="About You" type="text" name="bio" />}
      {user && window?.location?.href?.includes(`profile`) && <input id="number" className={`number userData`} placeholder="Favorite Number" type="number" name="number" />}
      {user && window?.location?.href?.includes(`profile`) && <input id="password" className={`editPassword userData`} placeholder="Edit Password" type="password" name="editPassword" autoComplete={`current-password`} />}
      <input className={(user && window?.location?.href?.includes(`profile`) || (authState == `Sign In` || authState == `Sign Up`)) ? `submit half` : `submit full`} type="submit" name="authFormSubmit" value={user ? `Sign Out` : authState} />
      {(authState == `Sign In` || authState == `Sign Up`) && <input id={`back`} className={`back`} type="submit" name="authFormBack" value={`Back`} />}
      {user && window?.location?.href?.includes(`profile`) && <input id={user?.id} className={`save`} type="submit" name="authFormSave" value={`Save`} />}
    </form>
  </>
}