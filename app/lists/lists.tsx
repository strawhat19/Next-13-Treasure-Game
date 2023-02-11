'use client';
// import $ from 'jquery';
import { db } from '../../firebase';
import { StateContext } from '../home';
import AuthForm from '../components/form';
import Section from '../components/section';
import { doc, setDoc } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useRef, useEffect, useContext } from 'react';

export const log = (item: any) => console.log(item);

const defaultLists = [
  {id: 1, name: `ProductIVF`, itemName: `Ticket`, items: [
    {id: 1, order: 1, index: 0, item: `Draggable Lists`, complete: false},
    {id: 2, order: 2, index: 1, item: `Complete Item in List`, complete: false},
    {id: 3, order: 3, index: 2, item: `Icon in Tab`, complete: false},
    {id: 4, order: 4, index: 3, item: `Update Lists on Reorder`, complete: false},
    {id: 5, order: 5, index: 4, item: `Corner Draggable`, complete: false},
    {id: 6, order: 6, index: 5, item: `Create List`, complete: false},
    {id: 7, order: 7, index: 6, item: `localStorage if Signed Out`, complete: false},
    {id: 8, order: 8, index: 7, item: `Switch to User`, complete: false},
    {id: 9, order: 9, index: 8, item: `Save User List if Signed In`, complete: false},
    {id: 10, order: 10, index: 9,  item: `Mobile Responsiveness`, complete: false},
  ]},
  {id: 2, name: `To Do List`, itemName: `Task`, items: [
    {id: 1, order: 1, index: 0, item: `Check Calendar`, complete: false},
    {id: 2, order: 2, index: 1, item: `Pay Bills`, complete: false},
    {id: 3, order: 3, index: 2, item: `KOL`, complete: false},
    {id: 4, order: 4, index: 3, item: `YT`, complete: false},
  ]},
  {id: 3, name: `One Piece Strongest 2023`, itemName: `Character`, items: [
    {id: 1, order: 1, index: 0, item: `Imu`, complete: false},
    {id: 2, order: 2, index: 1, item: `Shanks`, complete: false},
    {id: 3, order: 3, index: 2, item: `Dragon`, complete: false},
    {id: 4, order: 4, index: 3, item: `Kaido`, complete: false},
    {id: 5, order: 5, index: 4, item: `Mihawk`, complete: false},
  ]},
];

export default function Lists() {
  let loadedRef = useRef(false);
  let updatedListsToSet: any = [];
  let [typedValue, setTypedValue] = useState();
  let dev = () => window.location.host.includes(`localhost`);
  const { lists, setLists, updates, setUpdates, user, page, setPage, setUser, showLeaders, setShowLeaders } = useContext(StateContext);

  const generateUniqueID = (existingIDs?:any) => {
    let newID = Math.random().toString(36).substr(2, 9);
    if (existingIDs && existingIDs.length > 0) {
      while (existingIDs.includes(newID)) {
        newID = Math.random().toString(36).substr(2, 9);
      }
    }
    return newID;
  }
  
  const updateOrAdd = (obj: any, arr: any) => {
    let index = arr.findIndex((item: any) => item.name === obj.name);
    if (index !== -1) {
      arr[index] = obj;
    } else {
      arr.push(obj);
    }
    return arr;
  }
  
  const getNumberFromString = (string: string) => {
    let result: any = string.match(/\d+/);
    let number = parseInt(result[0]);
    return number;
  }

  const addOrUpdateUser = async (id: any, user: any) => {
    await setDoc(doc(db, `users`, id), { ...user, id }).then(newSub => {
      localStorage.setItem(`user`, JSON.stringify({ ...user, id }));
      setUser({ ...user, id });
      setUpdates(updates + 1);
      // dev() && console.log(`addOrUpdateUser`, { ...user, id });
      // dev() && console.log(`addOrUpdateUser lists`, { ...user, id }.lists);
      // dev() && console.log(`Updated Database Items`, { ...user, id }.lists[0].items.sort((a: any, b: any) => a.index - b.index));
      return newSub;
    }).catch(error => console.log(error));
  }

  const formatDate = (date: any) => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime + ` ` + (date.getMonth() + 1) + "-" + date.getDate() + "-" + date.getFullYear();
  }

  const setDraggable = async () => {
    await $(`.items`).each(function(this) {
      let any: any = $(this);
      any.sortable();
      any.droppable({
        drop: (event: any, ui: any) => {
          updateIndexes(event, ui);
        },
      });
    });
  }

  const updateLists = async (newLists: any) => {
    let storedUser = JSON.parse(localStorage.getItem(`user`) as any);
    let currentUser = storedUser;
    if (currentUser) {
      let updatedUser = { ...currentUser, lists: newLists, updated: formatDate(new Date())};
      addOrUpdateUser(currentUser?.id, updatedUser);
      dev() && console.log(`Lists`, (newLists.length == 1 ? newLists[0] : newLists), `user`, updatedUser);
    } else {
      dev() && console.log(`Lists`, (newLists.length == 1 ? newLists[0] : newLists));
    }
    localStorage.setItem(`lists`, JSON.stringify(newLists));
    if ($(`.items`).length > 0) setDraggable();
    setUpdates(updates + 1);
    await setLists(newLists);
  }

  const setItemComplete = async (e: any, item: any, list: any) => {
    list.items[list.items.indexOf(item)].complete = !list.items[list.items.indexOf(item)].complete;
    let filteredLists = lists.filter((lis: any) => lis.id != list.id);
    let newLists = [...filteredLists, list].sort((a: any, b: any) => a.id - b.id);
    await updateLists(newLists);
  }
  
  const createItem = async (e: any, list: any) => {
    e.preventDefault();
    let formFields = e.target.children;
    let newItem = {id: list.items.length + 1, item: formFields[0].value, complete: false, index: list.items.length, order: list.items.length + 1};
    let newList = {...list, items: [...list.items, newItem]};
    let filteredLists = lists.filter((lis: any) => lis.id != list.id);
    let newLists = [...filteredLists, newList].sort((a: any, b: any) => a.id - b.id);
    await updateLists(newLists);
    e.target.reset();
  }

  const manageList = async (e: any, list: any, lists: any) => {
    e.preventDefault();
    let changedList;
    let formFields = e.target.children;
    let formValues = Array.from(formFields).filter((field: any) => field?.name != `` && field.value != ``);
    let values: any = formValues.map((field: any, index: any) => {
      return {
        [field.name]: field.value,
      }
    });

    const hasListAndItem = values.some((obj: any) => obj.hasOwnProperty(`list`) && obj.hasOwnProperty(`item`));
    const hasListOnly = values.some((obj: any) => obj.hasOwnProperty(`list`) && !obj.hasOwnProperty(`item`));
    const hasItemOnly = values.some((obj: any) => obj.hasOwnProperty(`item`) && !obj.hasOwnProperty(`list`));

    const listObject = values.find((obj: any) => obj.hasOwnProperty(`list`));
    const itemObject = values.find((obj: any) => obj.hasOwnProperty(`item`));
    if (hasListAndItem) {
      changedList = {
        ...list, 
        name: listObject.list ?? list.name, 
        itemName: itemObject.item ?? list.itemName
      };
    } else if (hasListOnly) {
      changedList = {
        ...list, 
        name: listObject.list ?? list.name, 
      };
    } else if (hasItemOnly) {
      changedList = {
        ...list, 
        itemName: itemObject.item ?? list.itemName
      };
    }

    let filteredLists = lists.filter((lis: any) => lis.id != list.id);
    let newLists = [...filteredLists, changedList].sort((a: any, b: any) => a.id - b.id);
    await updateLists(newLists);
    e.target.reset();
  }

  const updateIndexes = (event: any, ui: any) => {
    let updateIndex = 0;
    let updateInterval: any;
    updateInterval = setInterval(() => {
      updateIndex++;
      if (updateIndex < 400) {
        let allItems: any = document.querySelector(`#${event.target.id}` as any).querySelectorAll(`.item`);
        if (allItems.length > 0) {
          allItems.forEach((item: any, index: any) => {
            if (!item.classList.contains(`ui-sortable-placeholder`)) {
              item.firstChild.innerHTML = index + 1;
            }
          });
        }
      } else {
        const children = Array.from(event.target.children);
        const filteredChildren = children.filter((listItem: any) => !listItem.classList.contains(`ui-sortable-placeholder`));
        let reorderedItems = filteredChildren.map((itm: any, index: any) => {
          return {
            index: index,
            order: index + 1,
            item: itm.dataset.item,
            id: getNumberFromString(itm.id),
            complete: JSON.parse(itm.dataset.complete),
          }
        }).sort((a, b) => a?.index - b?.index);

        let thisList = JSON.parse(event.target.dataset.list);
        let filteredLists = updatedListsToSet.filter((lis: any) => lis.id != getNumberFromString(event.target.id));
        let newList = { ...thisList, items: reorderedItems.sort((a: any, b: any) => a.index - b.index)};
        let newLists = [...filteredLists, newList].sort((a: any, b: any) => a.id - b.id);
        
        let storedUser = JSON.parse(localStorage.getItem(`user`) as any);
        let currentUser = storedUser;
        if (currentUser) {
          dev() && console.log(`New User Lists`, newLists);
          addOrUpdateUser(currentUser?.id, {...currentUser, lists: newLists, updated: formatDate(new Date())});
        } else {
          dev() && console.log(`Updated Lists`, newLists.length == 1 ? newLists[0] : newLists);
        }
        
        localStorage.setItem(`lists`, JSON.stringify(newLists));
        clearInterval(updateInterval);
      }
    }, 1); 
  }

  useEffect(() => {
    setPage(`Lists`);
    if (loadedRef.current) return;
    loadedRef.current = true;
    let storedUser = JSON.parse(localStorage.getItem(`user`) as any);
    let currentUser = storedUser;
    if (currentUser) {
      getDocs(collection(db, `users`)).then((snapshot: any) => {
        let latestUsers = snapshot.docs.map((doc: any) => doc.data()).sort((a: any, b: any) => b?.highScore - a?.highScore);
        let latestUser = latestUsers.filter((usr: any) => usr?.id == storedUser?.id)[0];

        dev() && console.log(`Dev Env Current User List Items`, (latestUser?.lists.length == 1 ? latestUser?.lists[0] : latestUser?.lists).items.sort((a: any, b: any) => a?.index - b?.index));
        updatedListsToSet = latestUser?.lists || JSON.parse(localStorage.getItem(`lists`) as any) || defaultLists;
        setUser(latestUser || null);
        updateLists(updatedListsToSet);
      });
    } else {
      updatedListsToSet = JSON.parse(localStorage.getItem(`lists`) as any) || defaultLists;
      dev() && console.log(`Dev Env List Items`, updatedListsToSet);
      updateLists(updatedListsToSet);
    }

    setUpdates(updates+1);

    // $(`.lists`).each(function(this) {
    //   let any: any = $(this);
    //   any.sortable();
    // });
    
    setTimeout(() => {
      // dev() && console.log(`Dev Env Draggable Items`, $(`.items`));
      if ($(`.items`).length > 0) {
        setDraggable();
      }
    }, 420);
    
  }, [user, lists]);

  return <div className={`inner pageInner`}>
  {/* <section id={`listsPageBanner`} className={`topContent`}>
    <div className="inner">
      <h1 style={{width: `40%`}}>{page != `` ? capitalizeAllWords(page) + ` (${lists.length})` : `Lists`}</h1>
      <div className={`column rightColumn`} style={{width: `60%`}}>
        {user ? <h2>User is {user ? user?.name : `Signed Out`}</h2> : <AuthForm style={{width: `100%`}} />}
      </div>
    </div>
  </section> */}
  <section id={`profileBanner`} className={`topContent`}>
    <div className="inner">
      {/* {user ? <h1 style={{fontSize: `2.1em`}}>{user?.name}'s List(s)</h1> : <h2><i>List(s)</i></h2>} */}
      <div className={`column rightColumn gameStats`}>
        {/* <button title={`Manage ${lists.length} List(s)`} style={{background: `var(--blackGlass)`, borderRadius: 4, justifyContent: `center`, alignItems: `center`, maxWidth: `fit-content`, padding: `5px 15px`}} className={`flex row`} onClick={(e) => setShowLeaders(!showLeaders)}>
          <h2 className={`flex row`}>
            <span className="highScore">{Math.floor(lists.length).toLocaleString(`en-US`)}</span>
            <i style={{color: `var(--gameBlue)`}} className="fas fa-list"></i>
            <span className="label">Manage Lists</span>
          </h2>
        </button> */}
        {/* <button title="Click to View High Scores" style={{background: `var(--blackGlass)`, borderRadius: 4, justifyContent: `center`, alignItems: `center`, maxWidth: `fit-content`, padding: `5px 15px`, pointerEvents: `none`}} className={`flex row`}><h2 className={`flex row`}><i style={{color: `var(--gameBlue)`}} className="fas fa-list"></i><span className="highScore">{Math.floor(lists.length).toLocaleString(`en-US`)}</span><span className="label">{user ? `${user?.name}` : `Your Lists`}</span></h2></button> */}
      </div>
    </div>
  </section>
  <section className={`lists`} id={`lists`}>
    {(user ? user.lists : lists).map((list: any, listIndex: any) => {
      return <article key={`list-${listIndex}-${list.id}`} id={`list${list.id}`} className={`list inner ${lists.length == 2 ? `twoList` : (lists.length == 1 ? `oneList` : `bigList`)}`} style={{width: `100%`}}>
      <Section id={`listsSection`}>
        <h2 className={`textOverflow`}><i>{list.name}</i><span style={{fontSize: 15, fontWeight: 500, padding: `0 10px`}}>({list.items.length})</span></h2>
        <div id={`items${list.id}`} className={`items active sortable draggable ${list.items.length > 6 ? `overflow` : ``}`} data-list={JSON.stringify(list)}>
          {list.items.sort((a: any, b: any) => a?.index - b?.index).map((item: any, itemIndex: any) => {
            // dev() && console.log({itemIndex, item, list, lists});
            return <div className={`item sortable draggable ${item.complete ? `complete` : ``}`} title={`Click to Complete, Click and Hold to Drag & Drop!`} id={`item${item.id}`} key={itemIndex} onClick={(e) => setItemComplete(e, item, list)} data-order={item.order} data-index={item.index} data-complete={item.complete} data-item={item.item}>
              <span className={`itemOrder`}>{itemIndex + 1}</span> <span className={`itemName textOverflow`}>{item.item}</span>
            </div>
          })}
        </div>
      </Section>
      <Section id={`createItemFormSection`}>
        {/* <h2><i>{list.name}</i></h2> */}
        {/* <form id={`addList${list.id}`} className={`flex`} style={{width: `100%`, flexDirection: `row`}} onInput={(e: any) => setTypedValue(e.target.value)} onSubmit={(e) => manageList(e, list, lists)}>
          <input placeholder={`Add '${list.name}' Name`} type="text" name="list" />
          <input placeholder={`Change the '${list.itemName}' Item Name`} type="text" name="item" />
          <input style={{width: `35%`}} id={user?.id} className={`save`} type="submit" value={`Save`} />
        </form> */}
        <form id={`listsForm${list.id}`} className={`flex`} style={{width: `100%`, flexDirection: `row`}} onInput={(e: any) => setTypedValue(e.target.value)} onSubmit={(e) => manageList(e, list, lists)}>
          <input placeholder={`Change '${list.name}' Name`} type="text" name="list" />
          <input placeholder={`Change the '${list.itemName}' Item Name`} type="text" name="item" />
          {/* <input placeholder={`or Select Custom Position in List`} type="number" min={0} max={lists.length} name="selectPosition" /> */}
          <input style={{width: `35%`}} id={user?.id} className={`save`} type="submit" value={`Save`} />
        </form>
        <form id={`listForm${list.id}`} className={`flex`} style={{width: `100%`, flexDirection: `row`}} onSubmit={(e) => createItem(e, list)}>
          <input placeholder={`Add ${list.itemName} #${list.items.length + 1}`} type="text" name="createItem" required />
          <input placeholder={`or Select Custom Position in List`} type="number" min={0} max={lists.length} name="selectPosition" />
          <input style={{width: `35%`}} id={user?.id} className={`save`} type="submit" value={`Add ${list.itemName}`} />
        </form>
      </Section>
    </article>
    })}
  </section>
  <Section id={`profileSection`}>
    <AuthForm />
    {/* {user ? <div className="flex row subBanner">
      <h2 style={{fontSize: 18, fontWeight: 400}}><i>You have {lists.length} Total Lists</i></h2>
      {user?.updated && <h4><i>Updated {user?.updated}</i></h4>}
    </div> : <AuthForm />} */}
  </Section>
</div>
}