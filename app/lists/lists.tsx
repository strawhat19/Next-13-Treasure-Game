'use client';
import { db } from '../../firebase';
import AuthForm from '../components/form';
import Section from '../components/section';
import { doc, setDoc } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { useState, useRef, useEffect, useContext } from 'react';
import { defaultLists, formatDate, getNumberFromString, StateContext } from '../home';

export default function Lists() {
  let loadedRef = useRef(false);
  let updatedListsToSet: List[] = [];
  let [typedValue, setTypedValue] = useState(``);
  let dev = () => window.location.host.includes(`localhost`);
  const { items, setItems, lists, setLists, updates, setUpdates, user, page, setPage, setUser, showLeaders, setShowLeaders } = useContext(StateContext);

  const addOrUpdateUserLists = async (id: any, user: User) => {
    setDoc(doc(db, `users`, id), { ...user, id }).then(newSub => {
      localStorage.setItem(`user`, JSON.stringify({ ...user, id }));
      setUser({ ...user, id });
      setUpdates(updates + 1);
      return newSub;
    }).catch(error => console.log(error));
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

  const updateLists = async (updatedLists: List[], logString?: any) => {
    let storedUser = JSON.parse(localStorage.getItem(`user`) as any);
    let currentUser = storedUser;
    if (currentUser) {
      let updatedUser = { ...currentUser, lists: updatedLists, updated: formatDate(new Date())};
      addOrUpdateUserLists(currentUser?.id, updatedUser);
      dev() && console.log(`${logString ?? ``} Lists`, (updatedLists.length == 1 ? updatedLists[0] : updatedLists), `user`, updatedUser);
    } else {
      dev() && console.log(`${logString ?? ``} Lists`, (updatedLists.length == 1 ? updatedLists[0] : updatedLists));
    }
    localStorage.setItem(`lists`, JSON.stringify(updatedLists));
    if ($(`.items`).length > 0) setDraggable();
    setUpdates(updates + 1);
    await setLists(updatedLists);
    await setItems([].concat(...updatedLists.map((lis: any) => lis.items)));
  }

  const setItemComplete = async (e: any, item: Item, list: List) => {
    list.items.sort((a, b) => a?.index - b?.index)[list.items.sort((a, b) => a?.index - b?.index).indexOf(item)].complete = !list.items.sort((a, b) => a?.index - b?.index)[list.items.sort((a, b) => a?.index - b?.index).indexOf(item)].complete;
    let filteredLists: List[] = lists.filter((lis: any) => lis.id != list.id);
    let newLists: List[] = [...filteredLists, list].sort((a: any, b: any) => a.id - b.id);
    await updateLists(newLists, `Set Item Complete Form`);
  }
  
  const createItem = async (e: any, list: List) => {
    e.preventDefault();
    let formFields = e.target.children;
    let newItem: Item = {
      complete: false, 
      index: list.items.length, 
      item: formFields[0].value, 
      id: list.items.length + 1, 
      order: list.items.length + 1,
    };
    let updatedItems: Item[] = [...list.items.sort((a, b) => a?.index - b?.index), newItem];
    let newList: List = {...list, items: updatedItems};
    let filteredLists: List[] = lists.filter((lis: any) => lis.id != list.id);
    let newLists: List[] = [...filteredLists, newList].sort((a: any, b: any) => a.id - b.id);
    await updateLists(newLists, `Create Item Form`);
    e.target.reset();
  }

  const manageList = async (e: any, list: List, lists: List[]) => {
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
      } as List;
    } else if (hasListOnly) {
      changedList = {
        ...list, 
        name: listObject.list ?? list.name, 
      } as List;
    } else if (hasItemOnly) {
      changedList = {
        ...list, 
        itemName: itemObject.item ?? list.itemName
      } as List;
    }

    let filteredLists: List[] = lists.filter((lis: List) => lis.id != list.id);
    let newLists: any[] = [...filteredLists, changedList].sort((a: any, b: any) => a.id - b.id);
    await updateLists(newLists, `Manage List Form`);
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
        let reorderedItems: Item[] = filteredChildren.map((itm: any, index: any) => {
          return {
            index: index,
            order: index + 1,
            item: itm.dataset.item,
            id: getNumberFromString(itm.id),
            complete: JSON.parse(itm.dataset.complete),
          } as Item;
        }).sort((a, b) => a?.index - b?.index);

        let thisList: List = JSON.parse(event.target.dataset.list);
        let filteredLists: List[] = updatedListsToSet.filter((lis: any) => lis.id != getNumberFromString(event.target.id));
        let newList: List = { ...thisList, items: reorderedItems.sort((a: any, b: any) => a.index - b.index)};
        let newLists: List[] = [...filteredLists, newList].sort((a: any, b: any) => a.id - b.id);
        
        let storedUser = JSON.parse(localStorage.getItem(`user`) as any);
        let currentUser = storedUser;
        if (currentUser) {
          dev() && console.log(`New User Lists`, newLists);
          // addOrUpdateUserLists(currentUser?.id, {...currentUser, lists: newLists, updated: formatDate(new Date())});
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
        updatedListsToSet = latestUser?.lists.map((lis: List) => {
          return {
            ...lis,
            items: lis.items.sort((a: any, b: any) => a?.index - b?.index)
          }
        }) || JSON.parse(localStorage.getItem(`lists`) as any).map((lis: List) => {
          return {
            ...lis,
            items: lis.items.sort((a: any, b: any) => a?.index - b?.index)
          }
        }) || defaultLists.map((lis: List) => {
          return {
            ...lis,
            items: lis.items.sort((a: any, b: any) => a?.index - b?.index)
          }
        });
        setUser(latestUser || null);
        updateLists(updatedListsToSet, `User Initialized`);
      });
    } else {
      updatedListsToSet = JSON.parse(localStorage.getItem(`lists`) as any) || defaultLists;
      updateLists(updatedListsToSet, `Initialized`);
    }

    setUpdates(updates+1);

    // $(`.lists`).each(function(this) {
    //   let any: any = $(this);
    //   any.sortable();
    // });
    
    setTimeout(() => {
      if ($(`.items`).length > 0) {
        setDraggable();
      }
    }, 420);
    
  }, [user, lists]);

  return <div className={`inner pageInner`}>
  <section id={`listsBanner`} className={`topContent`}>
    <div className="inner">
      <button id={`manageListsButton`} title={`Manage ${lists.length} List(s)`} className={`flex row iconButton`} onClick={(e) => setShowLeaders(!showLeaders)}>
        <h2 className={`flex row buttonLabel`}>
          <i style={{color: `var(--gameBlue)`, fontSize: 20}} className="fas fa-list"></i>
          <span className="label">
            <i style={{fontWeight: 500}}>Manage 
              <span className="buttonInnerLabel" style={{fontSize: 18, fontWeight: 700, padding: `0 10px`, color: `var(--gameBlue)`}}>
                {Math.floor(lists.length).toLocaleString(`en-US`)}
              </span> 
              Lists with
              <span className="buttonInnerLabel" style={{fontSize: 18, fontWeight: 700, padding: `0 10px`, color: `var(--gameBlue)`}}>
                {items.length}
              </span> 
              Total Items
            </i>
          </span>
        </h2>
      </button>
    </div>
  </section>
  <section className={`lists`} id={`lists`}>
    {(user ? user.lists : lists).map((list: any, listIndex: any) => {
      return <Section key={`list-${listIndex}-${list.id}`} id={`list${list.id}`} className={`list inner ${lists.length == 2 ? `twoList` : (lists.length == 1 ? `oneList` : `bigList`)}`} style={{width: `100%`}}>
        <button id={`manageList#${list.id}Button`} title={`Manage ${list.name}`}  className={`flex row iconButton`} onClick={(e) => setShowLeaders(!showLeaders)}>
          <div className={`flex row buttonLabel`}>
            <h2><i style={{color: `var(--gameBlue)`, fontSize: 18}} className="fas fa-list"></i></h2>
            <h3>
              <i style={{fontSize: 16, fontWeight: 500}}>{list.name}</i>
              <span className={`textOverflow`} style={{fontSize: 18, fontWeight: 700, padding: `0 10px`, color: `var(--gameBlue)`}}>{list.items.length}</span>
            </h3>
          </div>
        </button>
        <div id={`items${list.id}`} className={`items active sortable draggable ${list.items.length > 6 ? `overflow` : ``}`} data-list={JSON.stringify(list)}>
          {list.items.sort((a: any, b: any) => a?.index - b?.index).map((item: any, itemIndex: any) => {
            return <div className={`item sortable draggable ${item.complete ? `complete` : ``}`} title={`Click to Complete, Click and Hold to Drag & Drop!`} id={`item${item.id}`} key={itemIndex} onClick={(e) => setItemComplete(e, item, list)} data-order={item.order} data-index={item.index} data-complete={item.complete} data-item={item.item}>
              <span className={`itemOrder`}><i className={`itemIndex`}>{itemIndex + 1}</i></span> <span className={`itemName textOverflow`}>{item.item}</span>
            </div>
          })}
        </div>
        <form id={`listsForm${list.id}`} className={`flex`} style={{width: `100%`, flexDirection: `row`}} onInput={(e: any) => setTypedValue(e.target.value ?? typedValue)} onSubmit={(e) => manageList(e, list, lists)}>
          <input placeholder={`Change '${list.name}' Name`} type="text" name="list" />
          {/* <input placeholder={`Change the '${list.itemName}' Item Name`} type="text" name="item" /> */}
          <input style={{width: `35%`}} id={user?.id} className={`save`} type="submit" value={`Save`} />
        </form>
        <form id={`listForm${list.id}`} className={`flex`} style={{width: `100%`, flexDirection: `row`}} onSubmit={(e) => createItem(e, list)}>
          <input placeholder={`Add ${`Item` ?? list.itemName} ${list.items.length + 1}`} type="text" name="createItem" required />
          {/* <input placeholder={`or Select Custom Position in List`} type="number" min={0} max={lists.length} name="selectPosition" /> */}
          <input style={{width: `35%`}} id={user?.id} className={`save`} type="submit" value={`Add ${`Item` ?? list.itemName}`} />
        </form>
      </Section>
    })}
  </section>
  <Section id={`listsAuthSection`}>
    <AuthForm />
  </Section>
</div>
}