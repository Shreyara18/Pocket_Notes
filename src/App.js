import React,{ componentDidMount,useState, useRef, useEffect } from 'react';
import './App.css';
import GroupSection from './components/homePage/homePage';
import NotesList from './components/createNotes/createNotes';


let all_groups = JSON.parse(localStorage.getItem('groups'));
if(all_groups == undefined){
  all_groups = [];
}

function getNotesIdOrNextGroup(prefix) {
  let count = all_groups.length + 1;
  return function() {
      return prefix + count++;
  }
}
let nextGroupIDgenerator = getNotesIdOrNextGroup('gp');

function App() {
  const [isDesktop, setDesktop] = useState(window.innerWidth > 650);

  const updateMedia = () => {
    setDesktop(window.innerWidth > 650);
  };

  useEffect(() => {
    window.addEventListener("resize", updateMedia);
    return () => window.removeEventListener("resize", updateMedia);
  });
let [selectedGroup, setSelectedGroup] = useState(null);
  let [groups, setGroups] = useState([]);
  let [showCreateGroupForm, setShowCreateGroupForm] = useState(false);

  let selectedColor = "";

  let initialColorOptions = {
    '#B38BFA': false,
    '#FF79F2': false,
    '#43E6FC': false,
    '#F19576': false,
    '#0047FF': false,
    '#6691FF': false,
  };
  let [colorOptions, setColorOptions] = useState(initialColorOptions);

  let groupNameRef = useRef("");

  const addGroup = () => {
    selectedColor = Object.keys(colorOptions).find(key => colorOptions[key] === true);
    if(groupNameRef.current.value.trim() == ""){
      alert("Please enter Group Name.");
      return;
    }
    if(selectedColor == undefined){
      alert("Please choose a color .");
      return;
    }
  
    all_groups.push(
      {
        id: nextGroupIDgenerator(),
        name : groupNameRef.current.value,
        color : selectedColor
      }
    )
  
    setColorOptions(initialColorOptions);
    setShowCreateGroupForm(false);

    localStorage.setItem('groups', JSON.stringify(all_groups));
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (event.target.id === 'targetpopup') {
        setShowCreateGroupForm(false);
       
      }
    };
  
    document.addEventListener('click', handleClickOutside);
  
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []); 
  
  return (
    <>
      {
        isDesktop ?
        <>
          <div className='groupSectionWrapper'>
            <GroupSection setShowCreateGroupForm={setShowCreateGroupForm}  setGroups={setGroups} all_groups = {all_groups} setSelectedGroup={setSelectedGroup} selectedGroup={selectedGroup} />
          </div>
          <div className='NotesListWrapper'>
            <NotesList isDesktop={isDesktop} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} all_groups={all_groups}/>
          </div>
        </>
        : (selectedGroup?
          <NotesList isDesktop={isDesktop} selectedGroup={selectedGroup} setSelectedGroup={setSelectedGroup} all_groups={all_groups}/>
          :
          <GroupSection setShowCreateGroupForm={setShowCreateGroupForm}  setGroups={setGroups} all_groups = {all_groups} setSelectedGroup={setSelectedGroup} selectedGroup={selectedGroup} />
          )
      }
    {
      showCreateGroupForm &&
      <div className='createNewGroupSection'id='targetpopup'> 
        <div className='createGroupForm' >
          <h2>Create New Group</h2>
          <div className='createGroupInputWrapper'>
            <span className='createGroupInputs'>
              <label className='groupNameLabel' >Group Name</label>
              <input ref={groupNameRef} className='groupNameInput' placeholder='Enter Group Name...' type='text'/>
            </span>
            <span className='createGroupInputs'>
              <label className='chooseColourLabel' >Choose Colour</label>
              <div className='colorOptionsWrapper'>
                {Object.keys(colorOptions).map((colorCode, value) =>
                    <span onClick={
                      () => {
                        selectedColor = colorCode; 
                        let newOptions = {};
                        Object.entries(colorOptions).map(([color, value]) => {
                          if(color !== selectedColor){
                            newOptions[color] = false;
                          }
                          else{
                            newOptions[color] = true;
                          }
                        })
                        
                        setColorOptions(() => newOptions);
                        }
                  } key={colorCode} style={!colorOptions[colorCode] ? {background: colorCode}: {border: "solid 3px grey", background: colorCode} } className='colorOption'></span>
                )
                }
              </div>
            </span>
          </div>  
          <div className='createGroupBtnWrapper'>
            <button onClick={addGroup} className='createGroupFormBtn'>Create</button>
          </div>
        </div>
      </div>
    }

    </>
  );
}

export default App;
