'use client';
import { StateContext } from '../home';
import Banner from '../components/banner';
import Table from '../components/table';
import AuthForm from '../components/form';
import { useContext, useEffect } from 'react';

export default function About() {
  const { updates, setUpdates, user, setPage } = useContext(StateContext);

  const colData = [
    {
      name: 'John Doe',
      age: 32,
      address: '123 Main St.',
      cell: `data`
    },
    {
      name: 'Jane Smith',
      age: 26,
      address: '456 Park Ave.',
      cell: `data`
    },
    // more data...
  ];

  const nums = [1,2]

  const data = [
    colData,
    nums
  ];

  const columns = [
    {
      Header: 'Name',
      accessor: 'name', // accessor is the "key" in the data
    },
    {
      Header: 'Age',
      accessor: 'age',
    },
    {
      Header: 'Address',
      accessor: 'address',
    },
  ];

    useEffect(() => {
      setPage(`About`);
      setUpdates(updates+1);
    }, [])

    return <div className={`inner pageInner`}>
      <Banner id={`aboutBanner`} />
      <section>
        <div className="inner">
          <article>
            <h2><i>User is {user ? user?.name : `Signed Out`}</i></h2>
            <div className="flex auth">
              <AuthForm />
            </div>
          </article>
        </div>
      </section>
      <section>
        <div className="inner">
          Tsble
          <article>
            <Table columns={columns.map(col => col.Header)} data={[colData.map(col => col.address)]} />
          </article>
        </div>
      </section>
    </div>
}