import React,{useState} from "react";



const File = ({treeData})=>{
    const[expand,setExpand]=useState(false);
return(
<span>
    <span onClick={()=> setExpand(!expand)}>{treeData.title}</span>
    <br/>
    <div
      style={{
        cursor:"pointer",
        display: expand ? "block":"none",
        paddingLeft: 15,
      }}>
        {treeData.children?.map((item)=>(
          <File treeData={item} ></File>
        ))}
    
    </div>
    </span>
);};

export default File;