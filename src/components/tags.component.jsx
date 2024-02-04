import React, { useContext } from "react";
import { EditorContext } from "../context/editor.context";

const Tags = ({ tag, tagIndex }) => {
  const {
    blogInputs: { tags },
    setBlogInputs,
  } = useContext(EditorContext);

  /*======================= DELETE TAG HANDLER ======================== */

  const deletedTagHandler = () => {
    const updatedTags = tags.filter((t) => t !== tag);
    setBlogInputs((prevState) => ({ ...prevState, tags: updatedTags }));
  };

  // console.log(tags);

  /*======================= CHANGE TAG TO EDITABLE HANDLER ======================== */

  const changeToEditableTag = (e) => {
    e.target.setAttribute("contentEditable", "true");
    e.target.focus();
  };

  /*======================= EDIT AND UPDATE TAG HANDLER ======================== */

  const editTagHandler = (e) => {
    // console.log(e.keyCode);
    if (e.keyCode === 13 || e.keyCode === 188) {
      e.preventDefault();

      // const isTagExist = tags.includes(tag)

      const updatedTags = tags.map((t, i) =>
        i === tagIndex ? e.target.innerText : t
      );

      // console.log(updatedTags);

      setBlogInputs((prevState) => ({ ...prevState, tags: updatedTags }));
      e.target.setAttribute("contentEditable", "false");
    }
  };

  return (
    <div className="relative py-[9px] mt-2 px-5 rounded-full pr-3 bg-white hover:bg-opacity-70 flex items-center gap-3 w-fit">
      <p
        className="outline-none capitalize"
        suppressContentEditableWarning="true"
        onKeyDown={editTagHandler}
        onClick={changeToEditableTag}
        spellCheck="false"
      >
        {tag}
      </p>

      <i
        className="fi fi-rr-cross-small h-4 mt-0 cursor-pointer"
        onClick={deletedTagHandler}
      ></i>
    </div>
  );
};

export default Tags;
