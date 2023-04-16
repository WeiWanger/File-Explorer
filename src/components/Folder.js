import { Draggable, Droppable } from "react-beautiful-dnd";
import explorer from "../data/folderData";
import React, { useState } from "react";

function Folder({ handleInsertNode = () => {}, explorer }) {
  const [expand, setExpand] = useState(false);

  const [showInput, setShowInput] = useState({
    visible: false,
    isFolder: null,
  });

  const handleNewFolder = (event, isFolder) => {
    event.stopPropagation();
    setExpand(true);
    setShowInput({ visible: true, isFolder });
  };

  const onAddFolder = (event) => {
    if (event.keyCode === 13 && event.target.value) {
      handleInsertNode(explorer.id, event.target.value, showInput.isFolder);
      // add logic to add folder
      setShowInput({ ...showInput, visible: false });
    }
  };

  if (explorer.isFolder) {
    return (<Draggable draggableId={explorer.id} index={explorer.index}>
      {(provided) => (
      <div style={{ marginTop: 15 }}
      {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}>
        <div
          className="folder"
          onClick={() => {
            setExpand(!expand);
          }}
        >
          <span>📁{explorer.name}</span>

          <div>
            <button onClick={(event) => handleNewFolder(event, true)}>
              Folder +
            </button>
            <button onClick={(event) => handleNewFolder(event, false)}>
              File +
            </button>
          </div>
        </div>
        
            <div
              style={{
                display: expand ? "block" : "none",
                paddingLeft: 20,
              
              }}
              
            >
              {showInput.visible && (
                <div className="inputContainer">
                  <span>{showInput.isFolder ? "📁" : "📃"}</span>
                  <input
                    className="inputContainer__input"
                    type="text"
                    onBlur={() =>
                      setShowInput({ ...showInput, visible: false })
                    }
                    autoFocus
                    onKeyDown={onAddFolder}
                  ></input>
                </div>
              )}
              {explorer.items.map((exp, index) => {
                return (
                  <Droppable key={exp.id} droppableId={exp.id}>
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <Folder
                          explorer={exp}
                          key={exp.id}
                          handleInsertNode={handleInsertNode}
                          index={index}
                        />

                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                );
              })}
            </div>
        
      </div>
      )}
      </Draggable>);
  } else {
    return (
      <Draggable
        key={explorer.id}
        draggableId={explorer.id}
        index={explorer.index}
      >
        {(provided) => (
          <span
            className="file"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            📃{explorer.name}
          </span>
        )}
      </Draggable>
    );
  }
}
export default Folder;
