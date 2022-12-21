'use client';
import { db } from '../../firebase';
import { formatDate } from '../projects/projects';
import { capitalizeAllWords, createXML, StateContext } from '../home';
import { useContext, useEffect, useRef, useState } from 'react';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

export default function AuthForm() {
  const loadedRef = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false); 
  const { user, setUser, updates, setUpdates, setUsers, setContent, authState, setAuthState, emailField, setEmailField, users } = useContext(StateContext);

  const addOrUpdateUser = async (id: any, user: any) => {
    setDoc(doc(db, `users`, id), { ...user, id }).then(newSub => {
      localStorage.setItem(`user`, JSON.stringify({ ...user, id }));
      setUser({ ...user, id });
      setUpdates(updates + 1);
      return newSub;
    }).catch(error => console.log(error));
  }
 
  const getDBUsers = async () => {
    let latestUsers;
    try {
      getDocs(collection(db, `users`)).then((snapshot) => {
        latestUsers = snapshot.docs.map((doc: any) => doc.data());
        setUsers(latestUsers);
        return latestUsers;
      });
    } catch (err:any) {
      console.log(err);
    }
    return latestUsers;
  }

  const showAlert = async (alertTitle: any, alertMessage?: any, additionalInfo?:any) => {
    if (alertOpen) return;
    setAlertOpen(true);
    setUpdates(updates+1);
    let alertDialog = document.createElement(`div`);
    alertDialog.className = `alert`;
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

    if (clicked?.value == `Sign Out`) {
      setUser(null);
      setUpdates(updates+1);
      localStorage.removeItem(`user`);
      setEmailField(false);
      setAuthState(`Next`);
    } else if (clicked?.classList?.contains(`submit`)) {
      let submissionType = formFields.authFormSubmit.value ?? `submit`;
      let email = formFields.email.value ?? `email`;
      
      if (submissionType == `Next`) {
        setEmailField(true);
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
        });
      } else if (submissionType == `Sign In`) {
        let existingAccount = JSON.parse(localStorage.getItem(`account`) as any);
        let password = formFields?.password?.value;
        
        if (password == existingAccount?.password) {
          setUser(existingAccount);
          setContent(existingAccount?.bio);
        } else {
          showAlert(`Invalid Password`);
        }
      } else if (submissionType == `Sign Up`) {
        let name = capitalizeAllWords(email.split(`@`)[0]);
        let updated = formatDate(new Date());
        let lastSignin = formatDate(new Date());
        let registered = formatDate(new Date());

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

          let uuid = `${latestUsers.length + 1} ${potentialUser?.name} ${potentialUser?.registered.split(` `)[0] + ` ` + potentialUser?.registered.split(` `)[1] + ` ` + potentialUser?.registered.split(` `)[2]}`;
          addOrUpdateUser(uuid, potentialUser);
        });
      }
    } else {
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
    }
  }

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    setLoaded(true);
  }, [user]);

  return <>
    {loaded ? <form id="authForm" className={`flex`} onSubmit={authForm}>
      {!user && <input placeholder="Email" type="email" name="email" autoComplete={`email`} required />}
      {!user && emailField && <input placeholder="Password" type="password" name="password" autoComplete={`current-password`} required />}
      {user && <>Status <input id="status" className={`status userData`} placeholder="Status" type="text" name="status" /></>}
      {user && <>About You <input id="bio" className={`bio userData`} placeholder="About You" type="text" name="bio" /></>}
      {user && <>Favorite Number <input id="number" className={`number userData`} placeholder="Favorite Number" type="number" name="number" /></>}
      {user && <>Edit Password <input id="password" className={`editPassword userData`} placeholder="Edit Password" type="password" name="editPassword" autoComplete={`current-password`} /></>}
      <input className={user ? `submit half` : `submit full`} type="submit" name="authFormSubmit" value={user ? `Sign Out` : authState} />
      {user && <input id={user?.id} className={`save`} type="submit" name="authFormSave" value={`Save`} />}
    </form> : <div className={`skeleton`}>
        <form id="authForm" className={`flex`} onSubmit={authForm}>
          <input placeholder="Email" type="email" name="email" autoComplete={`email`} required />
          <input placeholder="Password" type="password" name="password" autoComplete={`current-password`} required />
          <input type="submit" name="authFormSubmit" value={user ? `Sign Out` : authState} />
        </form>
    </div>}
  </>
}