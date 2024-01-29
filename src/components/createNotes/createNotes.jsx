import React from 'react'
import { useState, useRef } from 'react';
import homePage from '../../media/homePage.svg';
import './createNotes.css';
import sendMessageArrow from '../../media/sendMessageArrow.svg';
import enabledSendMsgArrow from '../../media/enabledSendMsgArrow.svg';
import backArrow from '../../media/back-arrow.svg'

let allCurrentNotes = {};

function NotePanel(props) {
  let dateTime = new Date(props.dateTime);
  return (
    <div className='NotePanel'>
      <div className='note'>
        {props.note}
      </div>
      <div className='dateTime'>
        {dateTime.getDate() + " " + dateTime.toLocaleString('en-US', { month: 'long' }) + " " + dateTime.getFullYear()}&nbsp;
        <span className='dot'></span>&nbsp;
        {dateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}

      </div>

    </div>
  )
}


export default function NotesList(props) {
  let groupSelectedObj = props.all_groups.filter((grp) => grp.id == props.selectedGroup)[0];
  let noteRef = useRef('');
  const [isTextAreaEmpty, setTextAreaEmpty] = useState(true);

  allCurrentNotes = JSON.parse(localStorage.getItem('notes'));
  if (allCurrentNotes == undefined) {
    allCurrentNotes = {};
  }
  let [allNotes, setAllNotes] = useState(allCurrentNotes);

  
  function handleTextAreaChange(event) {
    setTextAreaEmpty(event.target.value.trim() === "");
  }

  function savingNote() {
    if (noteRef.current.value.trim() === "") {
      return;
    }

    let note = {
      dateTime: new Date().toString(),
      note: noteRef.current.value
    }

    noteRef.current.value = "";

    if (Object.keys(allCurrentNotes).includes(groupSelectedObj.id)) {
      allCurrentNotes[groupSelectedObj.id].push(note);
    }
    else {
      allCurrentNotes = { ...allCurrentNotes, [groupSelectedObj.id]: [note] };
    }
    setAllNotes(allCurrentNotes);
    console.log(allCurrentNotes);
    localStorage.setItem('notes', JSON.stringify(allCurrentNotes));
    setTextAreaEmpty(true);
  }

  return (
    <section className='noteSection'>
      {!props.selectedGroup ?
        <div className='noGroupSelectedSection'>
          <div className='messageWrapper'>
            <img style={{ width: "100%" }} src={homePage}></img>
            <h1 className='pocketNotesHeading'>Pocket Notes</h1>
            <p>Send and receive messages without keeping your phone online.
              <br />Use Pocket Notes on up to 4 linked devices and 1 mobile phone</p>
          </div>
          <div className='encryptionMsg'>
            {/* <img src='../../media/Vector.svg'></img> */}
            <i className="fa fa-lock"></i> end-to-end encrypted

          </div>
        </div>
        :
        <div className='NotesListInnerWrapper'>
          <div className='notesIconBar'>
            {!props.isDesktop &&
              <div className='backIconWrapper' onClick={() => props.setSelectedGroup((selected) => !selected)}>
                <img src={backArrow} />
              </div>
            }
            <div style={{ background: groupSelectedObj.color }} className='navGroupIcon'>
              {groupSelectedObj.name.slice(0, 2).toUpperCase()}
            </div>
            <div className='navGroupName'>
              {groupSelectedObj.name}
            </div>
          </div>

          <div className='NotesList'>
            {Object.keys(allNotes).includes(groupSelectedObj.id) && allNotes[groupSelectedObj.id].map((note) => (
              <NotePanel key={note.dateTime} dateTime={note.dateTime} note={note.note} />
            ))}
          </div>

          <div className='notesInputWrapper'>
            <textarea ref={noteRef} className='notesInputArea' placeholder='Enter Your Text Here....' onChange={handleTextAreaChange}></textarea>
            {isTextAreaEmpty ?
              <img
                className='sendMessageArrow'
                src={sendMessageArrow} />
              :
              <img onClick={savingNote}
                className='sendMessageArrownotempty'
                src={enabledSendMsgArrow} />}

          </div>

        </div>
      }
    </section>
  )
}

