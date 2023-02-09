'use client';
import { StateContext } from '../home';
import AuthForm from '../components/form';
import Banner from '../components/banner';
import { useRef, useState, useEffect, useContext } from 'react';

export default function Active() {
  const { updates, setUpdates, user, setPage } = useContext(StateContext);
  let loadedRef = useRef(false);
  let newTasks = [];
  let [tasks, setTasks] = useState([
    {id: 1, task: `task 1`, complete: false}, {id: 2, task: `task 2`, complete: true}, {id: 3, task: `task 3`, complete: false}
  ]);

  const createTask = async (e: any) => {
    e.preventDefault();
    let formFields = e.target.children;
    await setTasks([...tasks, {id: tasks.length + 1, task: formFields[0].value, complete: false}]);
    newTasks = [...tasks, {id: tasks.length + 1, task: formFields[0].value, complete: false}];
  }

  const updateIndexes = () => {
    $(`.task`).each(function(index) {
      $(this).text(`(` + (index + 1) + `) ` + $(this).text().substring(4));
    });
  }

  useEffect(() => {
    setPage(`Active`);
    if (loadedRef.current) return;
    loadedRef.current = true;

    setUpdates(updates+1);
    console.clear();

    let allTasks: any = $(`#tasks`);
    allTasks.sortable();
    allTasks.droppable({
      drop: ( event: any, ui: any ) => {
        updateIndexes();
        let newIndex;
        let taskElement = ui.draggable[0];
        let thisTask = tasks.filter(tas => tas.id == taskElement.id)[0];
        let indexOfTask = tasks.lastIndexOf(thisTask);
        console.log({event, ui, taskElement, tasks});
        // let filteredTasks = tasks.filter(tas => tas.id != taskElement.id);
        // console.log(filteredTasks);
      },
      // stop: ( event: any, ui: any ) => {
      //   updateIndexes();
      // }
  });

  }, [user, tasks]);

  return <div className={`inner pageInner`}>
  <Banner id={`activeBanner`} />
  <section id={`activeAuth`}>
    <div className="inner">
      <article>
        <h2><i>User is {user ? user?.name : `Signed Out`}</i></h2>
        {!user && <div className="flex auth">
          <AuthForm />
        </div>}
      </article>
    </div>
  </section>
  <section id={`createTaskSection`}>
    <div className="inner">
      <article>
        <h2><i>Create Task</i></h2>
        <form className={`flex`} style={{width: `100%`}} onSubmit={(e) => createTask(e)}>
          <input placeholder="Create Task" type="text" name="createTask" required />
          <input id={user?.id} className={`save`} type="submit" value={`Save`} />
        </form>
      </article>
    </div>
  </section>
  <section id={`activeSection`}>
    <div className="inner">
      <article>
        <h2><i>Active</i></h2>
        <div id="tasks" className="tasks active sortable draggable">
          {tasks.map((task, index) => {
            return <div className="task sortable draggable" id={task.id.toString()} key={task.id}>
              ({index + 1}) {task.task}
            </div>
          })}
        </div>
      </article>
    </div>
  </section>
</div>
}