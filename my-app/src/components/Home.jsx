import Editor from "./Editor";
import sidebarTexts from "../datas/sidebarTexts";
import { useEffect, useState, useRef, useMemo } from "react";
import Modal from 'react-modal';
import options from "../datas/selectBoxDatas";
import values from '../datas/values';
import JoditEditor from 'jodit-react';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: "90%",
    height: "50vh"
  },
};

const Home = () => {
  let subtitle;
  const editorRef = useRef(null);
  const [text, setText] = useState([]);
  const [content, setContent] = useState('');
  const [editorValue, setEditorValue] = useState('');
  const [modalIsOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(JSON.stringify(options[0]))
  const [modalTitle, setModalTitle] = useState('');
  const [defaultValue, setDefaultValue] = useState(options[0].name);
  const [defaultConentValue, setDefaultContentValue] = useState();

  console.log("editorValue: ", editorValue);

  const config = useMemo(() => 
  ({ readonly: false, emptyEnter: "keep", disablePlugins: "enter" }));

  const getTextValue = (value) => {
    setText(prevState => [...prevState, value]);
    setEditorValue(defaultValue);
  };

  function getModalTitle(value) {
    setModalTitle(value);
  };

  function openModal(value) {
    getModalTitle(value);
    setIsOpen(true);
    // setDefaultContentValue(`${value}: ${values[0].name}`);
    // setContent(defaultConentValue);
  };

  function afterOpenModal() {
    subtitle.style.color = 'black';
  };

  function closeModal() {
    setIsOpen(false);
  };

  const sidebarTextsEl = sidebarTexts.map((item) => {
    return <div key={item.id} className="text-box">{item.text} <span onClick={() => getTextValue(item.text)} className="icon">---+---</span></div>
  });

  const optionsValue = options.map((item, index) => {
    return <option value={JSON.stringify(item)} key={index}>{item.name} {item.lastName} {item.fatherName}</option>
  });

  const valuesEl = values.map((item, index) => {
    return <div name={item.name} key={index} onClick={() => setContent((prevState) => prevState + " " + JSON.parse(selectedOption)[item.key])} className="value-box">{item.name} <span>+</span></div>
  });

  const insertTextAtCursor = (text) => {
    const editor = editorRef.current.editor;
    if (!editor) {
      return;
    }
    const cursorPosition = editor.s.focusOffset;
    const cursorContent = editor.getEditorValue();
    console.log("editor: ", editor);
    console.log("cursorPosition: ", cursorPosition);
    console.log("cursorContent: ", cursorContent);
    const newContent =
      cursorContent.slice(0, cursorPosition) + text + cursorContent.slice(cursorPosition);
    editor.setNativeProps({ content: newContent });
  };

  const handleAddButtonClick = (event) => {
    if (content.length === 0) {
      alert('content length should be greater than 0');
    } else if (content.length > 0) {
      insertTextAtCursor(editorValue);
      setEditorValue(content);
      setIsOpen(false);
      setContent('');
    }
  };

  return (
    <div className="home">
      <div className="sidebar">
        <div className="top">
          <input type="search" />
          {sidebarTextsEl}
        </div>
        <div className="content-box">
          {text.map((item, index) =>
            <div key={index + 2}>
              <div className="show-text" key={index}>{item} <span onClick={() => openModal(item)} className="icon">OM</span></div>
              <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                ariaHideApp={false}
                contentLabel="Example Modal"
              >
                <div className="modal-title">
                  <h4 ref={(_subtitle) => (subtitle = _subtitle)}>{modalTitle}</h4>
                  <button onClick={closeModal}>X</button>
                </div>

                <div>
                  <select name="users" id="users" className="select-box" onChange={(e) => setSelectedOption(e.target.value)}>
                    {optionsValue}
                  </select>
                </div>

                <div className="values-part">
                  <h2>Dəyişənlar</h2>
                  <div className="value-container">{valuesEl}</div>
                </div>

                <div>
                  <h2>Ümumi dəyər</h2>
                  <JoditEditor ref={editorRef} value={content} config={config} onBlur={newContent => {
                    setContent(newContent)
                  }} />
                </div>

                <button onClick={() => handleAddButtonClick()} type="button" className="add-btn">Əlave et</button>
              </Modal>
            </div>
          )}
        </div>
      </div>
      <div className="content">
        <Editor value={editorValue} editor={editorRef} placeholder={'Typing...'} />
      </div>
    </div>
  )
};

export default Home;