import SortableTree, {addNodeUnderParent, changeNodeAtPath,  removeNodeAtPath,toggleExpandedForAll} from "react-sortable-tree";
import { useState, useRef } from "react";
import "react-sortable-tree/style.css";



const seed = [
  {
    id: "123",
    title: "JAVASCRIPT",
    subtitle: "zzz",
    isDirectory: true,
    expanded: true,
    children: [
      { id: "456", title: "Human Resource", subtitle: "zzz" },
      {
        id: "789",
        title: "Bussiness",
        subtitle: "zzz",
        expanded: true,
        children: [
          {
            id: "234",
            title: "Store A",
            subtitle: "zzz"
          },
          { id: "567", title: "Store B", subtitle: "zzz" }
        ]
      }
    ]
  }
];

function App() {
  const [treeData, setTreeData] = useState(seed);
  const inputEl = useRef();
  const getNodeKey = ({ treeIndex }) => treeIndex;


  function createNode() {
    const value = inputEl.current.value;
    //console.log(value)
    if (value === "") {
      inputEl.current.focus();
      return;
    }

    let newTree = addNodeUnderParent({
      treeData: treeData,
      parentKey: null,
      expandParent: true,
      getNodeKey,
      newNode: {
        id: "123",
        title: value
      }
    });

    setTreeData(newTree.treeData);

    inputEl.current.value = "";
    
  }

  function updateNode(rowInfo) {
    const { node, path } = rowInfo;
    const { children } = node;

    const value = inputEl.current.value;

    if (value === "") {
      inputEl.current.focus();
      return;
    }

    let newTree = changeNodeAtPath({
      treeData,
      path,
      getNodeKey,
      newNode: {
        children,
        title: value
      }
    });

    setTreeData(newTree);

    inputEl.current.value = "";
  }
  
  function removeNode(rowInfo) {
    const { path } = rowInfo;
    setTreeData(
      removeNodeAtPath({
        treeData,
        path,
        getNodeKey
      })
    );
  }

  function addNodeChild(rowInfo) {
    let { path } = rowInfo;

    const value = inputEl.current.value;
    // const value = inputEls.current[treeIndex].current.value;

    if (value === "") {
      inputEl.current.focus();
      // inputEls.current[treeIndex].current.focus();
      return;
    }

    let newTree = addNodeUnderParent({
      treeData: treeData,
      parentKey: path[path.length - 1],
      expandParent: true,
      getNodeKey,
      newNode: {
        title: value
      }
    });

    setTreeData(newTree.treeData);

    inputEl.current.value = "";
    // inputEls.current[treeIndex].current.value = "";
  }

  function addNodeSibling(rowInfo) {
    let { path } = rowInfo;

    const value = inputEl.current.value;
    // const value = inputEls.current[treeIndex].current.value;

    if (value === "") {
      inputEl.current.focus();
      // inputEls.current[treeIndex].current.focus();
      return;
    }

    let newTree = addNodeUnderParent({
      treeData: treeData,
      parentKey: path[path.length - 2],
      expandParent: true,
      getNodeKey,
      newNode: {
        title: value
      }
    });

    setTreeData(newTree.treeData);

    inputEl.current.value = "";
    // inputEls.current[treeIndex].current.value = "";
  }

  function expand(expanded) {
    setTreeData(
      toggleExpandedForAll({
        treeData,
        expanded
      })
    );
  }

  const alertNodeInfo = ({ node, path, treeIndex }) => {
    const objectString = Object.keys(node)
      .map((k) => (k === "children" ? "children: Array" : `${k}: '${node[k]}'`))
      .join(",\n   ");

    global.alert(
      "Info passed to the icon and button generators:\n\n" +
        `node: {\n   ${objectString}\n},\n` +
        `path: [${path.join(", ")}],\n` +
        `treeIndex: ${treeIndex}`
    );
  };

  function expandAll() {
    expand(true);
  }

  function collapseAll() {
    expand(false);
  }

  function updateTreeData(treeData) {
    setTreeData(treeData);
  }

  return (
    <div style={{height: "100vh"}}>
    <input ref={inputEl} type="text" />
        <br/>
        <button onClick={createNode}>Create Node</button>
        <br/>
        <button onClick={expandAll}>Expand All</button>
        <button onClick={collapseAll}>Collapse All</button>
      <SortableTree
          isVirtualized = {false}
          treeData={treeData}
          onChange={(treeData) => updateTreeData(treeData)}
          generateNodeProps={(rowInfo) => ({
          buttons: [
            <div>
              
              <button
                  label="Add Sibling"
                  onClick={(event) => addNodeSibling(rowInfo)}
                ><i class="fa-solid fa-plus"></i> Sibling
                </button>
                <button
                  label="Add Child"
                  onClick={(event) => addNodeChild(rowInfo)}
                >
                  <i class="fa-solid fa-plus"></i> Child

                </button>
              <button label="Update" onClick={(event) => updateNode(rowInfo)}>
              <i class="fa-solid fa-pen-to-square"></i>
              </button>
               <button label="Delete" onClick={(event) => removeNode(rowInfo)}>
               <i class="fa-solid fa-trash-can"></i>
              </button>
             <button
                label="Alert"
                onClick={(event) => alertNodeInfo(rowInfo)}
              >
               <i class="fa-sharp fa-solid fa-info"></i>
              </button>
            </div>
          ],
          style: {
            height: "50px"
          }
        })}
        />
    </div>
  );
}

export default App;
