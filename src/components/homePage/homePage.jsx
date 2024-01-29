import React from 'react'
import './homePage.css'

function GroupTile(props){
  return (
    <>
      <div style={props.id == props.selectedGroup ? {background: "#2F2F2F2B"}:{background:"white"} } className='GroupTile'
       onClick={() => {props.setSelectedGroup(props.id)} }>
        <div style={{background:props.groupIconColor}} className='groupIcon'>
            {props.name.slice(0,2).toUpperCase()}
        </div>
        <div className='groupName'>
            {props.name}
        </div>
      </div>
    </>
  )
 

}

export default function GroupSection(props) {
  return (
    <section className='notesGroup'>
        <div className='groupListTopSection'>
            <h2 className='appHeading'>Pocket Notes</h2>
        </div>
    
        <div className='groupListSection'>
          {
            props.all_groups.map((group) => (
              <GroupTile key={group.id} id={group.id} name={group.name} groupIconColor={group.color} selectedGroup={props.selectedGroup} setSelectedGroup={props.setSelectedGroup}/>
            ))
          }
        </div>
        <button onClick={ () => {props.setShowCreateGroupForm(true);
            }} className='createGroupBtn'>	<i className="fa fa-plus"></i></button>
    </section>
  )
}
