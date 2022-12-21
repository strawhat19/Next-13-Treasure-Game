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
  const { user, setUser, updates, setUpdates, users, setUsers } = useContext(StateContext);

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

  const showAlert = async (alertTitle: any, alertMessage: any, additionalInfo?:any) => {
    if (alertOpen) return;
    setAlertOpen(true);
    let alertDialog = document.createElement(`div`);
    alertDialog.className = `alert`;
    alertDialog.innerHTML = `<h3>${alertTitle}</h3>
    ${additionalInfo ? `` : alertMessage}
    `;
    additionalInfo.forEach((info: any, index: any) => {
      let element: any = createXML(`<p>${index+1}. ${alertMessage} ${info}</p>`);
      alertDialog.append(element);
    });
    document.body.appendChild(alertDialog);
    let closeButton = document.createElement(`button`);
    closeButton.innerHTML = `X`;
    closeButton.onclick = () => {
      document.body.removeChild(alertDialog);
      setAlertOpen(false);
    };
    alertDialog.appendChild(closeButton);
  }

  const authForm = (e?: any) => {
    e.preventDefault();
    let clicked = e?.nativeEvent?.submitter;
    let formFields = e.target.children;

    if (clicked?.classList?.contains(`submit`)) {
      let submit = formFields.authFormSubmit.value ?? `submit`;
      
      if (submit == `Sign In`) {
        let email = formFields.email.value ?? `email`;
        let name = capitalizeAllWords(email.split(`@`)[0]);
        let password = formFields.password.value ?? `password`;

        // Implement Users Check

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

        getDocs(collection(db, `users`)).then((snapshot) => {
          let latestUsers = snapshot.docs.map((doc: any) => doc.data());   
          console.log(`Latest Users`, latestUsers);
          let uuid = `${latestUsers.length + 1} ${potentialUser?.name} ${potentialUser?.registered.split(` `)[0] + ` ` + potentialUser?.registered.split(` `)[1] + ` ` + potentialUser?.registered.split(` `)[2]}`;

          addOrUpdateUser(uuid, potentialUser);          
        });

      } else {
        setUser(null);
        setUpdates(updates+1);
        localStorage.removeItem(`user`);
      }
    } else {
      let formErrors = [];

      for (let i = 0; i < formFields.length; i++) {
        const input = formFields[i];
        if (input.value === ``) {
          formErrors.push(input?.placeholder);
        }
      }

      if (formErrors.length > 0) {
        console.log(formErrors);
        showAlert(`The Form was NOT Saved.`, `Please Fill`, formErrors);
      } else {
        let updatedUser = { ...user, updated: formatDate(new Date()) };
        Object.assign(updatedUser, ...([...formFields].map(input => {
          if (input?.classList?.contains(`userData`)) {
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
      {!user && <input placeholder="Password" type="password" name="password" autoComplete={`current-password`} required />}
      {user && <>Status <input id="status" className={`status userData`} placeholder="Status" type="text" name="status" /></>}
      {user && <>About You <input id="bio" className={`bio userData`} placeholder="About You" type="text" name="bio" /></>}
      {user && <>Favorite Number <input id="number" className={`number userData`} placeholder="Favorite Number" type="number" name="number" /></>}
      {user && <>Edit Password <input id="password" className={`editPassword userData`} placeholder="Edit Password" type="password" name="editPassword" autoComplete={`current-password`} /></>}
      <input className={user ? `submit half` : `submit full`} type="submit" name="authFormSubmit" value={user ? `Sign Out` : `Sign In`} />
      {user && <input id={user?.id} className={`save`} type="submit" name="authFormSave" value={`Save`} />}
    </form> : <div className={`skeleton`}>
        <form id="authForm" className={`flex`} onSubmit={authForm}>
          <input placeholder="Email" type="email" name="email" autoComplete={`email`} required />
          <input placeholder="Password" type="password" name="password" autoComplete={`current-password`} required />
          <input type="submit" name="authFormSubmit" value={user ? `Sign Out` : `Sign In`} />
        </form>
    </div>}
  </>
}