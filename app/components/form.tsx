'use client';
import { db } from '../../firebase';
import { defaultContent } from '../home';
import { formatDate } from '../projects/projects';
import { useContext, useEffect, useRef, useState } from 'react';
import { capitalizeAllWords, createXML, StateContext } from '../home';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

export const convertHexToRGB = (HexString?:any, returnObject?: any) => {
  let r = parseInt(HexString.slice(1, 3), 16),
  g = parseInt(HexString.slice(3, 5), 16),
  b = parseInt(HexString.slice(5, 7), 16);
  let rgbaString = `rgba(${r}, ${g}, ${b}, 1)`;
  if (returnObject) {
    return { r, g, b };
  } else {
    return rgbaString;
  }
}

export const isShadeOfBlack = (HexString?:any) => {
  let darkColorBias = 50;
  let returnObject = true;
  let rgb: any = convertHexToRGB(HexString, returnObject);
  return (rgb?.r < darkColorBias) && (rgb?.g < darkColorBias) && (rgb?.b < darkColorBias);
}

export default function AuthForm(props?: any) {
  const { style } = props;
  const loadedRef = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false); 
  const { user, setUser, updates, setUpdates, setUsers, setContent, authState, setAuthState, emailField, setEmailField, users, setFocus, setHighScore, color, setColor, dark, setDark } = useContext(StateContext);

  const genUUID = (latestUsers?:any, potentialUser?:any) => {
    return `${latestUsers.length + 1} ${potentialUser?.name} ${potentialUser?.registered.split(` `)[0] + ` ` + potentialUser?.registered.split(` `)[1] + ` ` + potentialUser?.registered.split(` `)[2]}`;
  }

  // const setPageViews = (id?:any, user?: any) => {
  //   setDoc(doc(db, `pageViews`, id), { ...user, id }).then(newSub => {
  //     localStorage.setItem(`user`, JSON.stringify({ ...user, id }));
  //     setUser({ ...user, id });
  //     setUpdates(updates + 1);
  //     return newSub;
  //   }).catch(error => console.log(error));
  // }

  const changeColor = (colorRangePickerEvent?: any) => {
    // Set Current Color to Hex String. (Example: `#0b4366`);
    let currentColor: any = colorRangePickerEvent.target.value;
    localStorage.setItem(`color`, JSON.stringify(currentColor));
    setColor(currentColor);

    // Conver Hex to RGB for Color Check and Comparison.
    let r = parseInt(currentColor.slice(1, 3), 16),
    g = parseInt(currentColor.slice(3, 5), 16),
    b = parseInt(currentColor.slice(5, 7), 16);

    let luminance = (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
    if (luminance > 128) {
      // Background is light, set text color to black
      setDark(false);
    } else {
      // Background is dark, set text color to white
      setDark(true);
    }    
  }

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
    let formFields = e.target.children;
    let clicked = e?.nativeEvent?.submitter;
    let email = formFields?.email?.value ?? `email`;

    switch(clicked?.value) {
      default:
        console.log(clicked?.value);
        break;
      case `Next`:
        getDocs(collection(db, `users`)).then((snapshot) => {
          let latestUsers = snapshot.docs.map((doc: any) => doc.data()).sort((a: any, b: any) => b?.highScore - a?.highScore);
          let macthingEmails = latestUsers.filter((usr: any) => usr?.email.toLowerCase() == email.toLowerCase());
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
        setHighScore(0);
        setAuthState(`Next`);
        setEmailField(false);
        setUpdates(updates+1);
        setContent(defaultContent);
        localStorage.removeItem(`user`);
        localStorage.removeItem(`users`);
        localStorage.removeItem(`score`);
        localStorage.removeItem(`health`);
        localStorage.removeItem(`account`);
        localStorage.removeItem(`highScore`);
        break;
      case `Save`:
        let emptyFields = [];
        let fieldsToUpdate = [];

        console.log(formFields);

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
        let storedScore = JSON.parse(localStorage.getItem(`score`) as any);
        let existingAccount = JSON.parse(localStorage.getItem(`account`) as any);
        let password = formFields?.password?.value;
        let scoreToSet = Math.floor(existingAccount?.highScore > storedScore ? existingAccount?.highScore : storedScore);

        if (password == ``) {
          showAlert(`Password Required`);
        } else {
          if (password == existingAccount?.password) {
            setFocus(false);
            setAuthState(`Sign Out`);
            setUser(existingAccount);
            setHighScore(scoreToSet);
            setContent(existingAccount?.bio);
            setColor((existingAccount?.color || `#000000`));
            addOrUpdateUser(existingAccount?.id, {...existingAccount, highScore: scoreToSet, lastSignin: formatDate(new Date())});
            getDocs(collection(db, `users`)).then((snapshot) => setUsers(snapshot.docs.map((doc: any) => doc.data()).sort((a: any, b: any) => b?.highScore - a?.highScore)));
          } else {
            showAlert(`Invalid Password`);
          }
        }
        break;
      case `Sign Up`:
        let name = capitalizeAllWords(email.split(`@`)[0]);

        getDocs(collection(db, `users`)).then((snapshot) => {
          let latestUsers = snapshot.docs.map((doc: any) => doc.data());
          let macthingEmails = latestUsers.filter((usr: any) => usr?.email.toLowerCase() == email.toLowerCase());
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
            setFocus(false);
            let storedHighScore = JSON.parse(localStorage.getItem(`highScore`) as any);
            let potentialUser = { 
              id: users.length + 1, 
              bio: ``,
              color: ``, 
              number: 0,
              deaths: 0,
              status: ``,
              name: name, 
              email: email,
              roles: [`user`],
              password: password, 
              updated: formatDate(new Date()), 
              lastSignin: formatDate(new Date()), 
              registered: formatDate(new Date()), 
              highScore: Math.floor(storedHighScore) || 0,
            };
  
            let uuid = genUUID(latestUsers, potentialUser);
            addOrUpdateUser(uuid, potentialUser);
            getDocs(collection(db, `users`)).then((snapshot) => setUsers(snapshot.docs.map((doc: any) => doc.data()).sort((a: any, b: any) => b?.highScore - a?.highScore)));
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
  }, [user, users, authState]);

  return <>
  <form id="authForm" className={`flex`} onSubmit={authForm} style={style}>
      {!user && <input placeholder="Email" type="email" name="email" autoComplete={`email`} required />}
      {!user && emailField && <input placeholder="Password" type="password" name="password" autoComplete={`current-password`} />}
      {user && window?.location?.href?.includes(`profile`) && <input id="name" className={`name userData`} placeholder="Name" type="text" name="status" />}
      {user && window?.location?.href?.includes(`profile`) && <input id="status" className={`status userData`} placeholder="Status" type="text" name="status" />}
      {user && window?.location?.href?.includes(`profile`) && <input id="bio" className={`bio userData`} placeholder="About You" type="text" name="bio" />}
      {user && window?.location?.href?.includes(`profile`) && <input id="number" className={`number userData`} placeholder="Favorite Number" type="number" name="number" />}
      {user && window?.location?.href?.includes(`profile`) && <input id="password" className={`editPassword userData`} placeholder="Edit Password" type="password" name="editPassword" autoComplete={`current-password`} />}
      {user && window?.location?.href?.includes(`profile`) && <input type="color" id="color" name="color" placeholder="color" className={dark ? `dark` : `light`} data-color={`Color: ${convertHexToRGB(color)} // Hex: ${color}`} onInput={(e?: any) => changeColor(e)} defaultValue={color} />}
      <input className={(user && window?.location?.href?.includes(`profile`) || (authState == `Sign In` || authState == `Sign Up`)) ? `submit half` : `submit full`} type="submit" name="authFormSubmit" value={user ? `Sign Out` : authState} />
      {(authState == `Sign In` || authState == `Sign Up`) && <input id={`back`} className={`back`} type="submit" name="authFormBack" value={`Back`} />}
      {user && window?.location?.href?.includes(`profile`) && <input id={user?.id} className={`save`} type="submit" name="authFormSave" value={`Save`} />}
    </form>
  </>
}