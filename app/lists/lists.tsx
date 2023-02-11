'use client';
// import $ from 'jquery';
import AuthForm from '../components/form';
import Section from '../components/section';
import { capitalizeAllWords, StateContext } from '../home';
import { useRef, useState, useEffect, useContext } from 'react';

const defaultLists = [
  {id: 1, name: `ProductIVF`, itemName: `Ticket`, items: [
    {id: 1, item: `Draggable Lists`, complete: false},
    {id: 1, item: `Complete Item in List`, complete: false},
    {id: 1, item: `Icon in Tab`, complete: false},
    {id: 2, item: `Update Lists on Reorder`, complete: false},
    {id: 1, item: `Corner Draggable`, complete: false},
    {id: 1, item: `Create List`, complete: false},
    {id: 2, item: `localStorage if Signed Out`, complete: false},
    {id: 3, item: `Switch to User`, complete: false},
    {id: 3, item: `Save User List if Signed In`, complete: false},
    {id: 4, item: `Mobile Responsiveness`, complete: false},
  ]},
  {id: 2, name: `To Do List`, itemName: `Task`, items: [
    {id: 1, item: `Check Calendar`, complete: false},
    {id: 2, item: `Pay Bills`, complete: false},
    {id: 3, item: `KOL`, complete: false},
    {id: 4, item: `YT`, complete: false},
  ]},
  {id: 3, name: `One Piece Strongest 2023`, itemName: `Character`, items: [
    {id: 1, item: `Imu`, complete: false},
    {id: 2, item: `Shanks`, complete: false},
    {id: 3, item: `Dragon`, complete: false},
    {id: 4, item: `Kaido`, complete: false},
    {id: 5, item: `Mihawk`, complete: false},
  ]},
];

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

export default function Lists() {
  let loadedRef = useRef(false);
  let dev = () => window.location.host.includes(`localhost`);
  const { updates, setUpdates, user, page, setPage, } = useContext(StateContext);
  let [lists, setLists] = useState<any[]>([]);

  useEffect(() => {
    setPage(`Lists`);
    if (loadedRef.current) return;
    loadedRef.current = true;
    let listsToSet = JSON.parse(localStorage.getItem(`lists`) as any) || defaultLists;

    setUpdates(updates+1);
    setLists(listsToSet);


    $(`.lists`).each(function(this) {
      let any: any = $(this);
      any.sortable();
    });
    
    setTimeout(() => {
      if ($(`.items`).length > 0) {
        $(`.items`).each(function(this) {
          let any: any = $(this);
          any.sortable();
          any.droppable({
            drop: (event: any, ui: any) => {
              console.clear();
              dev() && console.log(this);
              dev() && console.log($(this));
              dev() && console.log(event.target);
              let thisList = JSON.parse(event.target.dataset.list);
              let filteredLists = listsToSet.filter((lis: any) => lis.id != getNumberFromString(event.target.id));
              dev() && console.log(`thisList`, thisList);
              dev() && console.log(`thisList`, thisList.items.map((itm: any) => {
                return {
                  ...itm,
                }
              }));
              dev() && console.log(`filteredLists`, filteredLists);
              // console.log(event.target);
              // console.log(event.target.id);
              // console.log(getNumberFromString(event.target.id));
              // console.log(ui.draggable[0]);
              // console.log(ui.draggable[0].innerHTML);
              // console.log({event, ui});
              updateIndexes(event, ui);
              // updateLists(lists);
            },
          });
        });
      }
    }, 1);
    
    dev() && console.log(`Dev Env`, localStorage);
    
  }, [user, lists]);

  const updateLists = (newLists: any) => {
    let storedUser = JSON.parse(localStorage.getItem(`user`) as any);
    let currentUser = storedUser;
    if (currentUser) {
      console.log({...currentUser, lists: newLists});
      localStorage.setItem(`lists`, JSON.stringify(newLists));
    }
    localStorage.setItem(`lists`, JSON.stringify(newLists));
    setLists(newLists);
  }

  const setItemComplete = async (e: any, item: any, list: any) => {
    list.items[list.items.indexOf(item)].complete = !list.items[list.items.indexOf(item)].complete;
    let filteredLists = lists.filter(lis => lis.id != list.id);
    let newLists = [...filteredLists, list].sort((a: any, b: any) => a.id - b.id);
    updateLists(newLists);
    await setLists(newLists);
  }
  
  const createItem = async (e: any, list: any) => {
    e.preventDefault();
    let formFields = e.target.children;
    let newItem = {id: `${list.itemName}-${list.items.length + 1}`, item: formFields[0].value, complete: false};
    let newList = {...list, items: [...list.items, newItem]};
    let filteredLists = lists.filter(lis => lis.id != list.id);
    let newLists = [...filteredLists, newList].sort((a: any, b: any) => a.id - b.id);
    await setLists(newLists);
    e.target.reset();
  }

  const updateIndexes = (event: any, ui: any) => {
    let updateIndex = 0;
    let updateInterval: any;
    updateInterval = setInterval(() => {
      dev() && console.log(`Dropped Item`, {event, ui});
      updateIndex++;
      if (updateIndex < 400) {
        let allItems: any = document.querySelector(`#${event.target.id}` as any).querySelectorAll(`.item`);
        if (allItems.length > 0) {
          allItems.forEach((item: any, index: any) => {
            if (!item.classList.contains(`ui-sortable-placeholder`)) {
              item.innerHTML = (`(` + (index + 1) + `) ` + item.textContent.substring(4));
            }
          });
        }
      } else {
        clearInterval(updateInterval);
      }
    }, 1); 
  }

  return <div className={`inner pageInner`}>
  <section id={`listsPageBanner`} className={`topContent`}>
    <div className="inner">
      <h1 style={{width: `40%`}}>{page != `` ? capitalizeAllWords(page) + ` (${lists.length})` : `Lists`}</h1>
      <div className={`column rightColumn`} style={{width: `60%`}}>
        {user ? <h2>User is {user ? user?.name : `Signed Out`}</h2> : <AuthForm style={{width: `100%`}} />}
      </div>
    </div>
  </section>
  <section className={`lists`} id={`lists`}>
    {lists.map((list, index) => {
      return <article id={`list${list.id}`} className={`list inner`} style={{width: `100%`}}>
      <Section id={`listsSection`}>
        <h2><i>{list.name} {list.id}</i></h2>
        <div id={`items${list.id}`} className={`items active sortable draggable ${list.items.length > 6 ? `overflow` : ``}`} data-list={JSON.stringify(list)}>
          {list.items.map((item: any, index: any) => {
            return <div className={`item sortable draggable ${item.complete ? `complete` : ``}`} id={item.id.toString()} key={item.id} onClick={(e) => setItemComplete(e, item, list)}>
              ({index + 1}) {item.id} {item.item}
            </div>
          })}
        </div>
      </Section>
      <Section id={`createItemSection`}>
        <h2><i>Create {list.itemName}</i></h2>
        <form id={`listForm${list.id}`} className={`flex`} style={{width: `100%`}} onSubmit={(e) => createItem(e, list)}>
          <input placeholder={`Create ${list.itemName}`} type="text" name="createItem" required />
          <input id={user?.id} className={`save`} type="submit" value={`Add ${list.itemName}`} />
        </form>
      </Section>
    </article>
    })}
  </section>
</div>
}