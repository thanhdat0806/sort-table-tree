import SortableTree, {addNodeUnderParent, changeNodeAtPath,  removeNodeAtPath,toggleExpandedForAll} from "react-sortable-tree";
import { useState, useRef, useEffect } from "react";
import "./App.css";
import "react-sortable-tree/style.css";
import axios from "axios";
import File from "./File";

const seed = [
  {
    id: "1",
    title: "WEB DEVELOPMENT",
    subtitle: "zzz",
    isDirectory: true,
    expanded: true,
    children: [
      { id: "11",
	title: "FRONTEND",
	subtitle: "zzz",
      expanded: true,
      children: [
		{
		id: "111",
		title: "HTML",
		subtitle: "zzz"
		},
		{ 
		id: "112",
		title: "CSS",
		subtitle: "zzz"
		},
		{
		id: "113",
		title: "JavaScript",
		subtitle: "zzz" },
		{
		id: "114",
		title: "ReactJs",
		subtitle: "zzz" }]
		},
      {
        id: "12",
        title: "BACKEND",
        subtitle: "zzz",
        expanded: true,
        children: [
          {
            id: "121",
            title: "PHP",
            subtitle: "zzz"
          },
          { id: "122", title: "NODEJS", subtitle: "zzz" },
          { id: "123", title: "ASP.NET CORE", subtitle: "zzz" }
        ]
      }
    ]
  }
];
function App() {
  const [treeData, setTreeData] = useState([]);
  const inputEl = useRef();
  const [searchString, setSearchString] = useState("");
  const [searchFocusIndex, setSearchFocusIndex] = useState(0);
  const [searchFoundCount, setSearchFoundCount] = useState(null);
  const getNodeKey = ({ treeIndex }) => treeIndex;
  console.log(JSON.stringify(seed));
  useEffect(()=>{
    axios
      .get("https://63b385655901da0ab3816ed1.mockapi.io/Sorttable-tree")
      .then(function (res){
        console.log(res.data);
        setTreeData(res.data[0].data);
      })
  },[])

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

  const selectPrevMatch = () => {
    setSearchFocusIndex(
      searchFocusIndex !== null
        ? (searchFoundCount + searchFocusIndex - 1) % searchFoundCount
        : searchFoundCount - 1
    );
  };
  const selectNextMatch = () => {
    setSearchFocusIndex(
      searchFocusIndex !== null ? (searchFocusIndex + 1) % searchFoundCount : 0
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
  function saveTreeData(){
    axios
    .put(`https://63b385655901da0ab3816ed1.mockapi.io/Sorttable-tree/1`,{
    id: 1,
    data: treeData,});
  };

  return (
    <div className="">
    <div className="container-fluid  p-2 bg-primary text-white text-center"><h1>TreeView</h1></div>
    <div className="container-fluid mt-3">
      <div className="Slidebar col-sm-4 p-3">
      <div className="nav-item" style={{textAlign: 'center'}}>
        <h3>Slidebar</h3>
      </div >
      <div className="nav-item"><i className="fa-solid fa-house-chimney"></i>  Home</div >
      <div className="nav-item">
      {treeData.map((item)=>(
         <File treeData={item}></File>
      ))}</div>
      </div>
    <div className="sort-table-tree col-sm-8 p-3">
    <input ref={inputEl} type="text" />
        <br/>
        <button className="btnclick" onClick={createNode}><i className="fa-solid fa-plus"></i> Create Node</button>
        <button className="btnclick" onClick={expandAll}><i className="fa-solid fa-up-right-and-down-left-from-center"></i> Expand All</button>
        <button className="btnclick" onClick={collapseAll}><i className="fa-solid fa-down-left-and-up-right-to-center"></i> Collapse All</button>
        <button className="btnclick" onClick={saveTreeData}><i className="fa-sharp fa-solid fa-floppy-disk"></i> Save</button>
        <br/>
        <form
          style={{ display: "inline-block" }}
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <label htmlFor="find-box">
            Search:&nbsp;
            <input
              id="find-box"
              type="text"
              value={searchString}
              onChange={(event) => setSearchString(event.target.value)}
            />
          </label>

          <button
            type="button"
            disabled={!searchFoundCount}
            onClick={selectPrevMatch}
          >
            &lt;
          </button>

          <button
            type="submit"
            disabled={!searchFoundCount}
            onClick={selectNextMatch}
          >
            &gt;
          </button>

          <span>
            &nbsp;
            {searchFoundCount > 0 ? searchFocusIndex + 1 : 0}
            &nbsp;/&nbsp;
            {searchFoundCount || 0}
          </span>
        </form>
      <SortableTree
          isVirtualized = {false}
          treeData={treeData}
          searchQuery={searchString}
          searchFocusOffset={searchFocusIndex}
          searchFinishCallback={(matches) => {
            setSearchFoundCount(matches.length);
            setSearchFocusIndex(
              matches.length > 0 ? searchFocusIndex % matches.length : 0
            );
          }}
          canDrag={({ node }) => !node.dragDisabled}
          onChange={(treeData) => updateTreeData(treeData)}
          generateNodeProps={(rowInfo) => ({
          buttons: [
            <div className="">
              
              <button className="btn"
                  label="Add Child"
                  onClick={(event) => addNodeChild(rowInfo)}
                ><i className="fa-solid fa-plus plus2"></i>
                </button>
              <button className="btn"
               label="Update" onClick={(event) => updateNode(rowInfo)}>
              <i className="fa-solid fa-pen-to-square"></i>
              </button>
               <button className="btn"
                label="Delete" onClick={(event) => removeNode(rowInfo)}>
               <i className="fa-solid fa-trash-can"></i>
              </button>
             <button className="btn"
                label="Alert"
                onClick={(event) => alertNodeInfo(rowInfo)}
              >
               <i className="fa-sharp fa-solid fa-info "></i>
              </button>
            </div>
          ],
          style: {
            height: "50px"
          }
        })}
        />
      </div>
    </div>
    </div>
  );
}

export default App;
