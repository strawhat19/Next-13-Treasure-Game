'use client';
import React, { useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

interface TableProps {
    columns: string[];
    data: any[][];
}

const Table: React.FC<TableProps> = ({ columns, data }) => {
    const [order, setOrder] = useState(columns);
    const tableRef = useRef<HTMLTableElement>(null);

    const onDragEnd = (result: any) => {
        if (!result.destination) return;
        const newOrder = Array.from(order);
        newOrder.splice(result.source.index, 1);
        newOrder.splice(result.destination.index, 0, order[result.source.index]);
        setOrder(newOrder);
    };

    return (
        <div className="table-container">
            <DragDropContext onDragEnd={onDragEnd}>
                <table ref={tableRef}>
                    <thead>
                        <tr>
                            {order.map((column, index) => (
                                <Draggable key={column} draggableId={column} index={index}>
                                    {(provided) => (
                                        <th
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            {column}
                                        </th>
                                    )}
                                </Draggable>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {/* {data.map((row, index) => (
                            <tr key={index}>
                                <Droppable droppableId={`row-${index}`}>
                                    {(provided) => (
                                        <td ref={provided.innerRef} {...provided.droppableProps}>
                                            {row.map((cell, cellIndex) => (
                                                <div key={cellIndex}>{cell}</div>
                                            ))}
                                            {provided.placeholder}
                                        </td>
                                    )}
                                </Droppable>
                            </tr>
                        ))} */}
                    </tbody>
                </table>
            </DragDropContext>

            <style jsx>{`
        .table-container {
          overflow-x: auto;
          width: 100%;
        }

        table {
          border-collapse: collapse;
          width: 100%;
        }

        td,
        th {
          border: 1px solid #dddddd;
          padding: 8px;
        }

        tr:nth-child(even) {
          background-color: #dddddd;
        }
      `}</style>
        </div>
    );
}

export default Table