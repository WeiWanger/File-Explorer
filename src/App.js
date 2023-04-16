import { useState } from "react";

import explorer from "./data/folderData";
import Folder from "./components/Folder";
import useTraverseTree from "./hooks/use-traverse-tree";
import "./styles.css";

import { DragDropContext, Droppable } from "react-beautiful-dnd";

function App() {
  const [explorerData, setExplorerData] = useState(explorer);
  const { insertNode } = useTraverseTree();

  const handleInsertNode = (folderId, item, isFolder) => {
    const finalTree = insertNode(explorerData, folderId, item, isFolder);
    setExplorerData(finalTree);
  };

  const dragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    if (explorerData.isFolder) {
      if (type === "nodes") {
        const newFolderOrder = explorerData.items;
        const movedFolder = newFolderOrder.splice(source.index, 1);
        newFolderOrder.splice(destination.index, 0, movedFolder);
        const newExplorerData = {
          ...explorerData,
          items: newFolderOrder,
        };
        setExplorerData(newExplorerData);
        return;
      }
    } else {
      const item = explorerData.items[source.droppableId];
      const newChildrenItems = item.items;
      newChildrenItems.splice(source.index, 1);
      newChildrenItems.splice(destination.index, 0, draggableId);

      const newItem = {
        ...item,
        items: newChildrenItems,
      };
      const newExplorerData = {
        ...explorerData,
        items: {
          ...explorerData.items,
          [newChildrenItems.id]: newChildrenItems,
        },
      };
      setExplorerData(newExplorerData);
      return;
    }
  };

  return (
    <DragDropContext onDragEnd={dragEnd}>
      <Droppable
       key={explorerData.id}
        droppableId={explorerData.id}
        type="nodes"
      >
        {(provided) => (
          <div
            className="App"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <Folder
              handleInsertNode={handleInsertNode}
              explorer={explorerData}
            />
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default App;
